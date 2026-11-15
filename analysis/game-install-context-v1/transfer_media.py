"""One-shot streaming transfer of the pinned stage102 data ISO to this VM.

No arbitrary request path, directory listing, upload or execution. The original
installer source/terms gate is independent of this local data transfer.
"""

import argparse
import hashlib
import json
import os
import signal
import socket
import stat
import time
from http.server import BaseHTTPRequestHandler, HTTPServer
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]
SOURCE = ROOT / "build/analysis/game-install-context-v1/MoliInstall-stage102.iso"
SIZE = 1106515968
SHA = "e013e939d934471787b78c7c388e5a704eb133fc29cc9b53c0cb6325f9a6a2d8"
URL_PATH = "/MoliInstall-stage102.iso"
PEERS = {"127.0.0.1": "127.0.0.1", "10.211.55.2": "10.211.55.3"}


def stamp(f):
    s = os.fstat(f.fileno())
    return (s.st_dev, s.st_ino, s.st_size, s.st_mtime_ns)


def open_verified(path, size, sha):
    for p in [*reversed(path.parents), path]:
        if p.is_symlink():
            raise RuntimeError("SOURCE_SYMLINK")
    f = os.fdopen(os.open(str(path), os.O_RDONLY | os.O_NOFOLLOW), "rb")
    try:
        before = stamp(f)
        if not stat.S_ISREG(os.fstat(f.fileno()).st_mode) or before[2] != size:
            raise RuntimeError("SOURCE_TYPE_OR_SIZE")
        digest = hashlib.sha256()
        for block in iter(lambda: f.read(1024 * 1024), b""):
            digest.update(block)
        if stamp(f) != before or digest.hexdigest() != sha:
            raise RuntimeError("SOURCE_IDENTITY")
        f.seek(0)
        return f, before
    except BaseException:
        f.close()
        raise


def emit(event, **fields):
    print(json.dumps({"event": event, **fields}, sort_keys=True), flush=True)


class Server(HTTPServer):
    allow_reuse_address = False

    def get_request(self):
        connection, peer = super().get_request()
        connection.settimeout(5)
        return connection, peer


class Handler(BaseHTTPRequestHandler):
    protocol_version = "HTTP/1.0"

    def log_message(self, *_args):
        pass

    def reply(self, status, metadata=False):
        self.close_connection = True
        self.send_response_only(status)
        self.send_header("Content-Length", str(self.server.source_size if metadata else 0))
        self.send_header("Connection", "close")
        self.send_header("Cache-Control", "no-store")
        if metadata:
            self.send_header("Content-Type", "application/octet-stream")
            self.send_header("X-Content-SHA256", self.server.source_sha)
        self.end_headers()

    def send_error(self, code, message=None, explain=None):
        self.reply(code)

    def transfer(self, head):
        server = self.server
        own = server.server_address[0]
        if self.client_address[0] not in ({server.peer, own} if head else {server.peer}):
            return self.reply(403)
        if self.path != URL_PATH:
            return self.reply(404)
        if self.headers.get("Range") or self.headers.get("Transfer-Encoding"):
            return self.reply(400)
        if self.headers.get("Content-Length", "0") != "0":
            return self.reply(400)
        if server.attempted or server.stop or time.monotonic() >= server.deadline:
            return self.reply(410)
        if stamp(server.source) != server.source_stamp:
            server.stop = True
            return self.reply(409)
        if head:
            return self.reply(200, True)
        server.attempted = True  # A partial transfer consumes the single attempt.
        digest = hashlib.sha256()
        count = 0
        try:
            server.source.seek(0)
            self.reply(200, True)
            while count < server.source_size:
                if time.monotonic() >= server.deadline or server.stop:
                    raise TimeoutError("TRANSFER_BUDGET")
                block = server.source.read(min(1024 * 1024, server.source_size - count))
                if not block:
                    raise OSError("SOURCE_EOF")
                self.wfile.write(block)
                digest.update(block)
                count += len(block)
            self.wfile.flush()
            server.complete = (
                digest.hexdigest() == server.source_sha
                and stamp(server.source) == server.source_stamp
            )
            emit("response_finished", bytes=count, source_hash_matches=server.complete)
        except (OSError, TimeoutError):
            emit("response_interrupted", bytes_written_before_error=count)
        finally:
            server.stop = True

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


def configure(server, source, source_stamp, size, sha, peer, ttl):
    server.source, server.source_stamp = source, source_stamp
    server.source_size, server.source_sha = size, sha
    server.peer, server.deadline = peer, time.monotonic() + ttl
    server.stop = server.attempted = server.complete = False
    server.timeout = 0.5


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--bind", choices=tuple(PEERS), default="127.0.0.1")
    parser.add_argument("--ttl", type=int, default=300)
    args = parser.parse_args()
    if not 10 <= args.ttl <= 600:
        parser.error("ttl must be 10..600")
    source, observed = open_verified(SOURCE, SIZE, SHA)
    with source, Server((args.bind, 0), Handler) as server:
        configure(server, source, observed, SIZE, SHA, PEERS[args.bind], args.ttl)

        def stop(_signal, _frame):
            server.stop = True

        signal.signal(signal.SIGINT, stop)
        signal.signal(signal.SIGTERM, stop)
        emit("ready", bind=args.bind, port=server.server_address[1],
             allowed_get_peer=server.peer, bytes=SIZE, sha256=SHA, ttl_seconds=args.ttl)
        while not server.stop and time.monotonic() < server.deadline:
            server.handle_request()
    emit("closed", attempted=server.attempted, response_complete=server.complete,
         guest_hash_or_execution_verified=False)


if __name__ == "__main__":
    main()
