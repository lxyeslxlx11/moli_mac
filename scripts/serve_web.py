#!/usr/bin/env python3
"""Serve only web/shared source on loopback. Never serves moli, analysis, or uploads."""
import argparse
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import unquote, urlsplit

ROOT = Path(__file__).resolve().parent.parent
SUFFIXES = {'.html', '.css', '.mjs', '.js', '.svg'}


class LocalHTTPServer(ThreadingHTTPServer):
    # ESM imports arrive in bursts; the older runtime's default backlog of 5
    # reset local connections before the handler could accept them.
    request_queue_size = 64


class Handler(SimpleHTTPRequestHandler):
    extensions_map = {**SimpleHTTPRequestHandler.extensions_map, '.mjs': 'text/javascript'}

    def translate_path(self, request):
        raw = unquote(urlsplit(request).path)
        if raw == '/':
            raw = '/web/index.html'
        if raw.endswith('/'):
            raw += 'index.html'
        path = (ROOT / raw.lstrip('/')).resolve()
        allowed = any(path.is_relative_to((ROOT / prefix).resolve()) for prefix in ('web', 'shared'))
        if not allowed or path.suffix not in SUFFIXES or not path.is_file():
            return str(ROOT / '.not-served-by-offline-viewer')
        return str(path)

    def end_headers(self):
        self.send_header('Cache-Control', 'no-store')
        self.send_header('X-Content-Type-Options', 'nosniff')
        self.send_header('Content-Security-Policy', "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' blob: data:; connect-src 'none'; object-src 'none'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'")
        super().end_headers()

    def list_directory(self, path):
        self.send_error(404)
        return None


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--port', type=int, default=4173)
    args = parser.parse_args()
    if not 1024 <= args.port <= 65535:
        parser.error('port must be 1024...65535')
    server = LocalHTTPServer(('127.0.0.1', args.port), Handler)
    print(f'Offline viewer: http://127.0.0.1:{args.port}/web/ (loopback only)', flush=True)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        server.server_close()


if __name__ == '__main__':
    main()
