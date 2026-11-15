from pathlib import Path
import http.client
import tempfile
import threading
import unittest
from fixed_transfer import FIXTURE, expected_fixture_text, make_server, observer_bytes


class FixedTransferTests(unittest.TestCase):
    def request(self, server, method, path, body=None, headers=None):
        thread = threading.Thread(target=server.handle_request)
        thread.start()
        client = http.client.HTTPConnection('127.0.0.1', server.server_address[1], timeout=3)
        try:
            client.request(method, path, body=body, headers=headers or {})
            response = client.getresponse()
            result = response.status, response.read()
        finally:
            client.close()
            thread.join(4)
        self.assertFalse(thread.is_alive())
        return result

    def test_download_identity_route_method_and_once(self):
        data = observer_bytes()
        server = make_server('127.0.0.1', 0, 'send-observer', data)
        try:
            self.assertEqual(self.request(server, 'GET', '/other')[0], 404)
            self.assertEqual(self.request(server, 'POST', '/text-observer.exe', b'')[0], 405)
            self.assertEqual(self.request(server, 'GET', '/text-observer.exe', headers={'Range': 'bytes=0-2'})[0], 400)
            self.assertEqual(self.request(server, 'GET', '/text-observer.exe'), (200, data))
            self.assertEqual(self.request(server, 'GET', '/text-observer.exe')[0], 410)
            self.assertTrue(server.state['success'])
        finally:
            server.server_close()

    def test_wrong_peer_denied_without_payload(self):
        server = make_server('127.0.0.1', 0, 'send-observer', observer_bytes())
        server.state['peer'] = '10.211.55.3'
        try:
            self.assertEqual(self.request(server, 'GET', '/text-observer.exe'), (403, b''))
            self.assertFalse(server.state['success'])
        finally:
            server.server_close()

    def test_upload_wrong_length_hash_then_exact_original_bytes(self):
        data, _ = expected_fixture_text(FIXTURE.read_bytes(), 0x360000)
        with tempfile.TemporaryDirectory() as folder:
            output = Path(folder) / 'fixture.bin'
            server = make_server('127.0.0.1', 0, 'receive-fixture', data, output)
            try:
                self.assertEqual(self.request(server, 'POST', '/fixture-text.bin', data[:-1])[0], 400)
                self.assertEqual(self.request(server, 'POST', '/fixture-text.bin', bytes(len(data)))[0], 422)
                self.assertFalse(output.exists())
                self.assertEqual(self.request(server, 'POST', '/fixture-text.bin', data)[0], 200)
                self.assertEqual(output.read_bytes(), data)
                self.assertTrue(server.state['success'])
            finally:
                server.server_close()

    def test_upload_never_overwrites(self):
        data, _ = expected_fixture_text(FIXTURE.read_bytes(), 0x360000)
        with tempfile.TemporaryDirectory() as folder:
            output = Path(folder) / 'fixture.bin'
            output.write_bytes(b'keep')
            server = make_server('127.0.0.1', 0, 'receive-fixture', data, output)
            try:
                self.assertEqual(self.request(server, 'POST', '/fixture-text.bin', data)[0], 409)
                self.assertEqual(output.read_bytes(), b'keep')
                self.assertFalse(server.state['success'])
            finally:
                server.server_close()

    def test_unknown_bind_and_nonfixture_upload_rejected(self):
        with self.assertRaises(ValueError):
            make_server('0.0.0.0', 0, 'send-observer', b'')
        with self.assertRaises(ValueError):
            make_server('127.0.0.1', 0, 'receive-fixture', b'wrong', Path('unused'))


if __name__ == '__main__':
    unittest.main(verbosity=2)
