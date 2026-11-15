"""One fixed original observer download or one pinned original-fixture upload.

No guest control, arbitrary file service, credentials, or vendor code transport.
"""
from pathlib import Path
import argparse
import hashlib
import json
import signal
import socket
import sys
import time
from http.server import BaseHTTPRequestHandler, HTTPServer

ROOT = Path(__file__).resolve().parents[2]
PRIVATE = ROOT / 'build/analysis/game-text-observer-runtime-v1/stage118'
sys.path.insert(0, str(ROOT / 'analysis/game-text-observer-v1/tool'))
from fixture_oracle import FIXTURE, expected_fixture_text

OBSERVER = ROOT / 'build/analysis/game-text-observer-v1/tool/text-observer.exe'
OBSERVER_SIZE = 146798
OBSERVER_SHA = '163864829f3b47eaa0b640c44b5de1d46f0e44658919b7c4e51974e5b83732f5'
PEERS = {'127.0.0.1': '127.0.0.1', '10.211.55.2': '10.211.55.3'}


def emit(event, **fields):
    print(json.dumps({'event': event, **fields}, sort_keys=True), flush=True)


def observer_bytes():
    if OBSERVER.is_symlink() or not OBSERVER.is_file():
        raise ValueError('OBSERVER_FILE_TYPE')
    data = OBSERVER.read_bytes()
    if len(data) != OBSERVER_SIZE or hashlib.sha256(data).hexdigest() != OBSERVER_SHA:
        raise ValueError('OBSERVER_IDENTITY')
    return data


class FixedServer(HTTPServer):
    allow_reuse_address = False

    def get_request(self):
        connection, peer = super().get_request()
        connection.settimeout(3)
        return connection, peer


class Handler(BaseHTTPRequestHandler):
    protocol_version = 'HTTP/1.0'

    def log_message(self, *_args):
        pass  # Never log request lines, headers or byte payloads.

    def reply(self, status, body=b'', digest=None):
        self.close_connection = True
        self.send_response_only(status)
        self.send_header('Content-Length', str(len(body)))
        self.send_header('Connection', 'close')
        self.send_header('Cache-Control', 'no-store')
        if digest:
            self.send_header('Content-Type', 'application/octet-stream')
            self.send_header('X-Content-SHA256', digest)
        self.end_headers()
        if body:
            self.wfile.write(body)
        self.wfile.flush()

    def send_error(self, code, message=None, explain=None):
        self.reply(code)

    def guard(self):
        state = self.server.state
        if self.client_address[0] != state['peer']:
            self.reply(403)
            return None
        if state['done'] or time.monotonic() >= state['deadline']:
            self.reply(410)
            return None
        if self.path != state['route']:
            self.reply(404)
            return None
        if any(self.headers.get(x) for x in ['Range', 'Transfer-Encoding', 'Authorization', 'Cookie']):
            self.reply(400)
            return None
        return state

    def do_GET(self):
        state = self.guard()
        if state is None:
            return
        if state['mode'] != 'send-observer':
            return self.reply(405)
        lengths = self.headers.get_all('Content-Length', [])
        if lengths not in ([], ['0']):
            return self.reply(400)
        try:
            self.reply(200, state['data'], state['sha256'])
        except (BrokenPipeError, ConnectionResetError, socket.timeout):
            state['done'] = True
            emit('response_interrupted')
            return
        state['done'] = state['success'] = True
        emit('observer_sent', bytes=len(state['data']), sha256=state['sha256'])

    def do_POST(self):
        state = self.guard()
        if state is None:
            return
        if state['mode'] != 'receive-fixture':
            return self.reply(405)
        if self.headers.get_all('Content-Length', []) != [str(len(state['data']))]:
            return self.reply(400)
        try:
            data = self.rfile.read(len(state['data']))
        except (ConnectionResetError, socket.timeout):
            return self.reply(408)
        if len(data) != len(state['data']) or hashlib.sha256(data).hexdigest() != state['sha256']:
            return self.reply(422)
        if data != state['data']:
            return self.reply(422)
        try:
            with state['output'].open('xb') as output:
                output.write(data)
                output.flush()
        except FileExistsError:
            state['done'] = True
            return self.reply(409)
        state['done'] = state['success'] = True
        emit('original_fixture_received', bytes=len(data), sha256=state['sha256'])
        self.reply(200)

    def do_HEAD(self):
        self.reply(405)

    do_PUT = do_HEAD
    do_PATCH = do_HEAD
    do_DELETE = do_HEAD
    do_CONNECT = do_HEAD


def make_server(bind, port, mode, data, output=None, ttl=300):
    if bind not in PEERS or mode not in {'send-observer', 'receive-fixture'}:
        raise ValueError('FIXED_SCOPE')
    if not 1 <= ttl <= 600:
        raise ValueError('TTL')
    if mode == 'receive-fixture' and (len(data) != 6624 or output is None):
        raise ValueError('ORIGINAL_FIXTURE_ONLY')
    server = FixedServer((bind, port), Handler)
    server.timeout = 0.25
    server.state = {'mode': mode, 'route': '/text-observer.exe' if mode == 'send-observer' else '/fixture-text.bin',
                    'data': data, 'sha256': hashlib.sha256(data).hexdigest(),
                    'peer': PEERS[bind], 'deadline': time.monotonic() + ttl,
                    'output': output, 'done': False, 'success': False}
    return server


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('mode', choices=['send-observer', 'receive-fixture'])
    parser.add_argument('--bind', choices=list(PEERS), required=True)
    parser.add_argument('--port', type=int, default=65378)
    parser.add_argument('--ttl', type=int, default=300)
    parser.add_argument('--base', type=lambda text: int(text, 0))
    args = parser.parse_args()
    if not 49152 <= args.port <= 65535 or not 10 <= args.ttl <= 600:
        parser.error('Use one unprivileged port49152..65535 and ttl10..600.')
    output = None
    if args.mode == 'send-observer':
        if args.base is not None:
            parser.error('No base for observer download.')
        data = observer_bytes()
    else:
        if args.base is None:
            parser.error('Fresh actual original-fixture base required.')
        data, _ = expected_fixture_text(FIXTURE.read_bytes(), args.base)
        output = PRIVATE / 'fixture-text.bin'
        if not output.parent.is_dir() or output.exists() or output.is_symlink():
            raise ValueError('FIXED_OUTPUT_NOT_NEW')
    server = make_server(args.bind, args.port, args.mode, data, output, args.ttl)

    def stop(_signal, _frame):
        server.state['done'] = True

    signal.signal(signal.SIGTERM, stop)
    signal.signal(signal.SIGINT, stop)
    emit('listening', mode=args.mode, bind=args.bind, port=server.server_address[1],
         peer=server.state['peer'], bytes=len(data), sha256=server.state['sha256'], ttl=args.ttl)
    try:
        while not server.state['done'] and time.monotonic() < server.state['deadline']:
            server.handle_request()
    finally:
        server.server_close()
        emit('closed', success=server.state['success'])
    return 0 if server.state['success'] else 1


if __name__ == '__main__':
    raise SystemExit(main())
