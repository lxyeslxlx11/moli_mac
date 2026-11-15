#!/usr/bin/env python3
"""Independent loopback oracle for the merchant and exchange entry menus."""
import importlib.util
import json
from pathlib import Path
import socket
import struct
import sys

ANALYSIS = Path(__file__).resolve().parents[1]


def read(directory, name='original-vectors.json'):
    return json.loads((ANALYSIS / directory / name).read_text())


spec = importlib.util.spec_from_file_location(
    'wire', ANALYSIS / 'game-legacy-message-v1/generate_vectors.py')
wire = importlib.util.module_from_spec(spec)
spec.loader.exec_module(wire)
catalog = read('game-legacy-message-v1', 'dispatch-catalog.json')
incoming = {row['consumer']: row for row in catalog['incoming']}
outgoing = {row['producer']: row for row in catalog['outgoing']}
post = read('game-post-login-v1')
options = read('game-character-options-v1')
scene = read('game-input-runtime-v1')['protocol']
key = bytes.fromhex(post['bootstrap']['keyHex'])


def stage(name):
    print(json.dumps(dict(stage=name)), flush=True)


def wait(name):
    assert sys.stdin.readline().strip() == name


with socket.socket() as server:
    server.settimeout(25)
    server.bind(('127.0.0.1', 0))
    server.listen(1)
    print(json.dumps(dict(port=server.getsockname()[1])), flush=True)
    connection, _ = server.accept()
    with connection:
        connection.settimeout(25)

        def exact(size):
            data = bytearray()
            while len(data) < size:
                block = connection.recv(size - len(data))
                assert block, 'unexpected EOF'
                data.extend(block)
            return bytes(data)

        def request(expected):
            header = exact(4)
            assert header[:2] == b'\xaf\xef'
            size = struct.unpack_from('<H', header, 2)[0]
            assert 0 < size <= 32767
            payload = exact(size)
            assert exact(2) == b'\xef\xaf'
            actual = wire.payload_decode(payload, key)
            assert actual == expected, (actual, expected)

        def send(consumer, *values):
            plain = wire.message(incoming[consumer], values)
            connection.sendall(wire.frame(wire.payload_encode(plain, key)))

        def send_hex(hex_value):
            connection.sendall(bytes.fromhex(hex_value))

        def dialog(mode, sequence, text):
            send('0x4f4410', mode, 0, sequence, 200, text)

        def expect(producer, *values):
            request(wire.message(outgoing[producer], values))

        def answer(sequence, button, text):
            expect('0x4f8240', 2, 3, sequence, 200, button, text)

        connection.sendall(wire.frame(bytes.fromhex(post['bootstrap']['payloadHex'])))
        request(wire.payload_decode(bytes.fromhex(post['authFrameHex'])[4:-2], key))
        send_hex(post['authReplyFrameHex'])
        list_request = post['flow']['requests']['list']['plainHex']
        request(bytes.fromhex(list_request))
        initial = options['flows'][1]['initial']['frameHex']
        send_hex(options['wire']['category5']['frameHex'] + initial)
        request(bytes.fromhex(options['wire']['request']['plainHex']))
        send_hex(options['wire']['accepted']['frameHex'])
        request(bytes.fromhex(list_request))
        send_hex(options['wire']['category8']['frameHex'] + initial)
        request(bytes.fromhex(options['flows'][1]['entry']['plainHex']))
        send_hex(post['flow']['replies']['entered']['frameHex'])
        for plain in scene['beforePlainHex']:
            connection.sendall(wire.frame(wire.payload_encode(bytes.fromhex(plain), key)))
        send('0x4f16d0', b'1|3e|5|3|4|100001|77|8|OriginalGuide||1')
        stage('initial-sent')

        expect('0x4f6470', 2, 3, b'C', 99)
        expect('0x4f74e0', 3, 200)
        stage('commerce-actor-verified')
        wait('merchant')
        dialog(5, 101, b'87000|Harbor Merchant|Choose a service|3')
        stage('merchant-opened')
        answer(101, 0, b'1')
        send('0x4efad0', wire.integer(1 << 27) + b'|100')
        dialog(6, 102, b'3|Harbor Supply|Choose|||Herb|500|8|For travel|1|3')
        stage('merchant-offer-opened')
        answer(102, 0, rb'0\z1')
        stage('merchant-order-verified')
        wait('exchange-menu')
        dialog(27, 103, b'87000|Token Trader|Exchange tokens')
        stage('exchange-menu-opened')
        answer(103, 0, b'1')
        dialog(28, 104, b'3|Token Exchange||||753|Market Token')
        stage('exchange-offer-opened')
        answer(104, 2, b'')
        stage('exchange-cancel-verified')
        wait('move')
        for plain in scene['requestPlainHex']:
            request(bytes.fromhex(plain))
        stage('moves-verified')
        wait('release')
        stage('released')
        assert connection.recv(1) == b'', 'unexpected extra request'
        print(json.dumps(dict(
            mode='commerce-entry', normal_startup_requests_verified=5,
            commerce_actions_verified=4, movement_requests_verified=2,
            no_duplicate_or_invented_actions=True, official_session=False,
        )), flush=True)
