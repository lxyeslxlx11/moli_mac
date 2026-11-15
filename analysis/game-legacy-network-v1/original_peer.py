#!/usr/bin/env python3
"""One original loopback exchange, independent Python framing; never official traffic."""
import json
import socket
import struct

payloads = [b'', b'Q', b'original-python-payload\x00\xaf\xef\xef\xaf']
wire = b''.join(b'\xaf\xef'+struct.pack('<H',len(value))+value+b'\xef\xaf' for value in payloads)
with socket.socket() as server:
    server.settimeout(5)
    server.bind(('127.0.0.1',0))
    server.listen(1)
    print(json.dumps(dict(port=server.getsockname()[1])),flush=True)
    connection, _ = server.accept()
    with connection:
        connection.settimeout(5)
        at = 0
        for length in [1,2,4,3,1,6,2,len(wire)]:
            connection.sendall(wire[at:at+length]); at += length
            if at >= len(wire): break
        expected = b'original-response'
        wanted = b'\xaf\xef'+struct.pack('<H',len(expected))+expected+b'\xef\xaf'
        received = b''
        while len(received) < len(wanted):
            chunk = connection.recv(len(wanted)-len(received))
            if not chunk: raise ValueError('Short original response')
            received += chunk
        assert received == wanted
        connection.shutdown(socket.SHUT_WR)
print(json.dumps(dict(response_verified=True,original_loopback_only=True)),flush=True)
