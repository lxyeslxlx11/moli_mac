"""Temporary, pinned transfer of the two own stage101 test executables.

This is a task tool, not a game service. It never serves a filesystem path
supplied by a request. A completed HTTP response is not guest acceptance.
"""

import argparse
import hashlib
import json
import signal
import socket
import time
from http.server import BaseHTTPRequestHandler, HTTPServer
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]
FIXED = {
    "entry-fixture.exe": (
        129968,
        "cf8bd654d9daf5c222f5a8ee565085013cf284ee74165a25558c5bbe0cf41c2a",
    ),
    "callback-probe.exe": (
        143326,
        "f3632249024e59515c323cd621af5d3ff9b733b8c92321e85be1adc91593e140",
    ),
}
ALLOWED_GET_PEER = {
    "127.0.0.1": "127.0.0.1",
    "10.211.55.2": "10.211.55.3",
}


def emit(event, **fields):
    print(json.dumps({"event": event, **fields}, sort_keys=True), flush=True)


def load_fixed():
    files = {}
    for name, (size, sha) in FIXED.items():
        source = ROOT / "build/analysis/game-entry-v1/probe-stage101" / name
        if source.is_symlink() or not source.is_file():
            raise RuntimeError("FIXED_SOURCE_NOT_REGULAR")
        data = source.read_bytes()
        if len(data) != size or hashlib.sha256(data).hexdigest() != sha:
            raise RuntimeError("FIXED_SOURCE_IDENTITY_MISMATCH")
        files["/" + name] = data
    return files


class FixedTransfer(HTTPServer):
    allow_reuse_address = False

    def get_request(self):
        connection, peer = super().get_request()
        connection.settimeout(3)
        return connection, peer


class Handler(BaseHTTPRequestHandler):
    protocol_version = "HTTP/1.0"
    server_version = "MoliOwnFixtureTransfer/1"

    def log_message(self, *_args):
        # Never log request lines, headers, account identifiers, or payloads.
        pass

    def send_error(self, code, message=None, explain=None):
        self.reply(code)

    def reply(self, status, data=None, sha=None):
        self.close_connection = True
        self.send_response_only(status)
        self.send_header("Content-Length", str(len(data) if data else 0))
        self.send_header("Connection", "close")
        self.send_header("Cache-Control", "no-store")
        if data is not None:
            self.send_header("Content-Type", "application/octet-stream")
            self.send_header("X-Content-SHA256", sha)
        self.end_headers()

    def transfer(self, head):
        state = self.server.transfer_state
        own_address = self.server.server_address[0]
        peer = self.client_address[0]
        allowed = {state["get_peer"]}
        if head:
            allowed.add(own_address)
        if peer not in allowed:
            return self.reply(403)
        if time.monotonic() >= state["deadline"] or state["stop"]:
            return self.reply(410)
        if self.path not in state["files"]:
            return self.reply(404)
        if self.headers.get("Range") or self.headers.get("Transfer-Encoding"):
            return self.reply(400)
        if self.headers.get("Content-Length", "0") != "0":
            return self.reply(400)
        if not head and self.path in state["sent"]:
            return self.reply(410)
        data = state["files"][self.path]
        sha = FIXED[self.path[1:]][1]
        try:
            self.reply(200, data, sha)
            if not head:
                self.wfile.write(data)
                self.wfile.flush()
                state["sent"].add(self.path)
                emit("response_sent", name=self.path[1:], bytes=len(data), sha256=sha)
        except (BrokenPipeError, ConnectionResetError, socket.timeout):
            emit("response_interrupted", name=self.path[1:])

    def do_HEAD(self):
        self.transfer(True)

    def do_GET(self):
        self.transfer(False)

    def do_POST(self):
        self.reply(405)

    do_PUT = do_POST
    do_DELETE = do_POST
    do_PATCH = do_POST
    do_CONNECT = do_POST


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--bind", choices=tuple(ALLOWED_GET_PEER), default="127.0.0.1")
    parser.add_argument("--ttl", type=int, default=300)
    args = parser.parse_args()
    if not 10 <= args.ttl <= 600:
        parser.error("ttl must be 10..600 seconds")
    files = load_fixed()
    state = {
        "files": files,
        "get_peer": ALLOWED_GET_PEER[args.bind],
        "deadline": time.monotonic() + args.ttl,
        "stop": False,
        "sent": set(),
    }

    def stop(_signal, _frame):
        state["stop"] = True

    signal.signal(signal.SIGTERM, stop)
    signal.signal(signal.SIGINT, stop)
    with FixedTransfer((args.bind, 0), Handler) as server:
        server.transfer_state = state
        server.timeout = 0.5
        emit("ready", bind=args.bind, port=server.server_address[1], ttl_seconds=args.ttl,
             allowed_get_peer=state["get_peer"], names=sorted(FIXED))
        while not state["stop"] and time.monotonic() < state["deadline"] and len(state["sent"]) < 2:
            server.handle_request()
        reason = "two_responses_sent" if len(state["sent"]) == 2 else "stopped_or_expired"
    emit("closed", reason=reason, response_count=len(state["sent"]),
         guest_hashes_and_execution_verified=False)


if __name__ == "__main__":
    main()
