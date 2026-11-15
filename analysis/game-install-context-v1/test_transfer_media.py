"""Synthetic source and HTTP boundary checks; never serve vendor files."""

import contextlib
import hashlib
import http.client
import tempfile
import threading
import unittest
from pathlib import Path

import transfer_media as media


class TransferTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.path = Path(self.temp.name).resolve() / "own-data.bin"
        self.data = b"Original synthetic transfer case\0" * 70001
        self.path.write_bytes(self.data)
        self.sha = hashlib.sha256(self.data).hexdigest()

    @contextlib.contextmanager
    def server(self, peer="127.0.0.1"):
        source, observed = media.open_verified(self.path, len(self.data), self.sha)
        stop = threading.Event()
        with source, media.Server(("127.0.0.1", 0), media.Handler) as server:
            media.configure(server, source, observed, len(self.data), self.sha, peer, 20)

            def run():
                while not stop.is_set():
                    server.handle_request()

            thread = threading.Thread(target=run)
            thread.start()
            try:
                yield server
            finally:
                stop.set()
                thread.join(2)
                self.assertFalse(thread.is_alive())

    def request(self, server, method, path=media.URL_PATH, headers=None, body=None):
        with contextlib.closing(http.client.HTTPConnection(*server.server_address, timeout=3)) as c:
            c.request(method, path, body=body, headers=headers or {})
            r = c.getresponse()
            return r.status, dict(r.getheaders()), r.read()

    def test_multichunk_identity_and_one_attempt(self):
        with self.server() as s:
            code, headers, body = self.request(s, "HEAD")
            self.assertEqual((code, body), (200, b""))
            self.assertEqual(headers["Content-Length"], str(len(self.data)))
            self.assertEqual(headers["X-Content-SHA256"], self.sha)
            code, headers, body = self.request(s, "GET")
            self.assertEqual((code, body), (200, self.data))
            # The next handled request follows server-side digest/finally work.
            self.assertEqual(self.request(s, "GET")[0], 410)
            self.assertTrue(s.complete)
            self.assertTrue(s.attempted)

    def test_request_boundaries(self):
        with self.server() as s:
            for path in ("/", "/missing", "/../moli/POLCN_Setup.exe", media.URL_PATH + "?x=1"):
                with self.subTest(path=path):
                    self.assertEqual(self.request(s, "GET", path)[0], 404)
            self.assertEqual(self.request(s, "POST")[0], 405)
            self.assertEqual(self.request(s, "GET", headers={"Range": "bytes=0-1"})[0], 400)
            self.assertEqual(self.request(s, "GET", body=b"x")[0], 400)
            self.assertFalse(s.attempted)

    def test_peer_gate(self):
        with self.server(peer="127.0.0.2") as s:
            self.assertEqual(self.request(s, "HEAD")[0], 200)
            self.assertEqual(self.request(s, "GET")[0], 403)
            self.assertFalse(s.attempted)

    def test_expired_gate(self):
        with self.server() as s:
            s.deadline = 0
            self.assertEqual(self.request(s, "GET")[0], 410)
            self.assertFalse(s.attempted)

    def test_mutated_open_file_rejected(self):
        with self.server() as s:
            self.path.write_bytes(b"changed")
            self.assertEqual(self.request(s, "GET")[0], 409)
            self.assertFalse(s.attempted)

    def test_wrong_size_or_digest(self):
        for size, sha in ((len(self.data) + 1, self.sha), (len(self.data), "0" * 64)):
            with self.subTest(size=size, sha=sha):
                with self.assertRaises(RuntimeError):
                    media.open_verified(self.path, size, sha)

    def test_symlink_rejected(self):
        link = self.path.with_name("link")
        link.symlink_to(self.path)
        with self.assertRaises(RuntimeError):
            media.open_verified(link, len(self.data), self.sha)


if __name__ == "__main__":
    unittest.main()
