#!/usr/bin/env python3
"""Independent feed-box scenario over OS loopback using the fixed wire vectors."""
import importlib.util
import json
from pathlib import Path
import select
import socket
import struct
import sys

ANALYSIS = Path(__file__).resolve().parents[1]


def load(directory, name='original-vectors.json'):
    return json.loads((ANALYSIS / directory / name).read_text())


spec = importlib.util.spec_from_file_location('wire', ANALYSIS / 'game-legacy-message-v1/generate_vectors.py')
wire = importlib.util.module_from_spec(spec)
spec.loader.exec_module(wire)
catalog = load('game-legacy-message-v1', 'dispatch-catalog.json')
incoming = {row['consumer']: row for row in catalog['incoming']}
outgoing = {row['producer']: row for row in catalog['outgoing']}
post = load('game-post-login-v1')
options = load('game-character-options-v1')
scene = load('game-input-runtime-v1')['protocol']
key = bytes.fromhex(post['bootstrap']['keyHex'])


def stage(name):
    print(json.dumps({'stage': name}), flush=True)


def wait(name):
    assert sys.stdin.readline().strip() == name


def item(slot, name, category, quantity, qualification=1):
    return '|'.join(map(str, [slot, name, 0, '', 2, 1, 0, 0, 0, qualification, 0, category, quantity, '']))


def run(connection):
    connection.settimeout(25)

    def exact(size):
        data = bytearray()
        while len(data) < size:
            part = connection.recv(size - len(data))
            assert part, 'unexpected EOF'
            data.extend(part)
        return bytes(data)

    def request(expected):
        header = exact(4)
        size = struct.unpack_from('<H', header, 2)[0]
        assert header[:2] == b'\xaf\xef' and 0 < size <= 32767
        actual = wire.payload_decode(exact(size), key)
        assert exact(2) == b'\xef\xaf' and actual == expected, (actual, expected)

    def send_plain(plain):
        connection.sendall(wire.frame(wire.payload_encode(plain, key)))

    def send(consumer, *args):
        send_plain(wire.message(incoming[consumer], args))

    def expect(producer, *args):
        request(wire.message(outgoing[producer], args))

    def dialog(sequence, value=b'', mask=0):
        send('0x4f4410', 34, mask, sequence, 200, value)

    def idle():
        assert not select.select([connection], [], [], .15)[0], 'unexpected feed-box request'

    initial = options['flows'][1]['initial']['frameHex']
    list_request = bytes.fromhex(post['flow']['requests']['list']['plainHex'])
    connection.sendall(wire.frame(bytes.fromhex(post['bootstrap']['payloadHex'])))
    request(wire.payload_decode(bytes.fromhex(post['authFrameHex'])[4:-2], key))
    connection.sendall(bytes.fromhex(post['authReplyFrameHex']))
    request(list_request)
    connection.sendall(bytes.fromhex(options['wire']['category5']['frameHex'] + initial))
    request(bytes.fromhex(options['wire']['request']['plainHex']))
    connection.sendall(bytes.fromhex(options['wire']['accepted']['frameHex']))
    request(list_request)
    connection.sendall(bytes.fromhex(options['wire']['category8']['frameHex'] + initial))
    request(bytes.fromhex(options['flows'][1]['entry']['plainHex']))
    connection.sendall(bytes.fromhex(post['flow']['replies']['entered']['frameHex']))
    for raw in scene['beforePlainHex']:
        send_plain(bytes.fromhex(raw))
    send('0x4f25a0', '|'.join([
        item(8, 'Oat Cake', 23, 2), item(9, 'Family Seed', 0x35, 2), item(10, 'Restricted', 0x26, 1),
        item(11, 'Bound', 23, 1, 96), item(12, 'Also Restricted', 0x34, 1),
    ]).encode('ascii'))
    send('0x4f16d0', b'1|3e|5|3|4|100001|77|8|OriginalGuide||1')
    stage('initial-sent')
    expect('0x4f6470', 2, 3, b'C', 99)
    expect('0x4f74e0', 3, 200)
    stage('feed-box-actor')
    fields = [''] * 287
    fields[0], fields[286] = 'A', '0'
    fields[19:25] = ['87000', '7', '1', 'Bank Tonic', '', 'Keep sealed']
    snapshot = '|'.join(fields).encode('ascii')
    wait('feed-box-open')
    dialog(202, snapshot)
    stage('feed-box-opened')
    wait('feed-box-invalid')
    idle()
    stage('feed-box-invalid-local')
    expect('0x4f8240', 2, 3, 202, 200, 0, rb'I\z8\z101\z1')
    stage('feed-box-storing')
    wait('feed-box-settle')
    idle()
    dialog(208, b'I|1|87000|1|0|Oat Cake||')
    send('0x4f25a0', item(8, 'Oat Cake', 23, 1).encode('ascii'))
    stage('feed-box-stored')
    expect('0x4f8240', 2, 3, 202, 200, 0, rb'I\z103\z13\z-1')
    dialog(208, b'I|3|0')
    send('0x4f25a0', item(13, 'Bank Tonic', 23, 7).encode('ascii'))
    stage('feed-box-taken')
    wait('feed-box-local-close')
    idle()
    stage('feed-box-local-closed')
    wait('feed-box-reopen')
    dialog(203, snapshot)
    stage('feed-box-reopened')
    wait('feed-box-server-close')
    dialog(0, mask=-1)
    idle()
    stage('feed-box-server-closed')
    wait('move')
    for raw in scene['requestPlainHex']:
        request(bytes.fromhex(raw))
    stage('moves-verified')
    wait('release')
    stage('released')
    assert connection.recv(1) == b'', 'unexpected extra request'
    print(json.dumps(dict(
        mode='feed-box', normal_startup_requests_verified=5, movement_requests_verified=2,
        storage_requests_verified=2, silent_closes_verified=2, no_duplicate_or_invented_actions=True,
        official_session=False, original_execution=False,
    )), flush=True)


with socket.socket() as server:
    server.settimeout(25)
    server.bind(('127.0.0.1', 0))
    server.listen(1)
    print(json.dumps(dict(port=server.getsockname()[1])), flush=True)
    connection, _ = server.accept()
    with connection:
        run(connection)
