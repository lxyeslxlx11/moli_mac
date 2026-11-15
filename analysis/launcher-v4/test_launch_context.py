"""Original synthetic verifier tests; no game bytes or runtime values."""
import hashlib
import importlib.util
import struct
import sys
import unittest
from pathlib import Path
HERE=Path(__file__).resolve().parent

def load(name,path):
    spec=importlib.util.spec_from_file_location(name,path);m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m);return m
V=load('context_verifier',HERE/'verify-launch-context.py')
sys.modules['verify_launch']=V.PRIOR
F=load('prior_fixture',HERE.parent/'protocol-v3/launch/test_verify_launch.py')

def sample_manifest():
    b=bytearray(F.fixture());b[0x230:0x232]=b'\x74\xfe';b=bytes(b)
    return b,{'sample':{'sha256':hashlib.sha256(b).hexdigest()},'anchors':[
      {'id':'api','va':'0x401000','expected_hex':'ff1560114000','api':'FakeCall'},
      {'id':'backwards','va':'0x401030','expected_hex':'74fe','branch_target':'0x401030'}]}

class ContextVerifierTests(unittest.TestCase):
    def test_signed_short_near_and_jump_targets(self):
        self.assertEqual(V.branch_target(0x100,b'\x74\xfe'),0x100)
        self.assertEqual(V.branch_target(0x100,b'\x0f\x85'+struct.pack('<i',-6)),0x100)
        self.assertEqual(V.branch_target(0x100,b'\xe9'+struct.pack('<i',7)),0x10c)
    def test_truncated_or_unrelated_opcode_rejected(self):
        for b in [b'',b'\x74',b'\x74\x00\x00',b'\x0f\x85',b'\xe8'+bytes(4)]:
            with self.assertRaises(ValueError):V.branch_target(0x100,b)
    def test_synthetic_api_and_branch(self):
        b,m=sample_manifest();r=V.verify(b,m);self.assertEqual(r['count'],2);self.assertTrue(r['all_passed'])
    def test_changed_sample_rejected(self):
        b,m=sample_manifest();bad=bytearray(b);bad[-1]=1
        with self.assertRaises(ValueError):V.verify(bytes(bad),m)
    def test_wrong_api_branch_or_instruction_rejected(self):
        for key,value in [('api','OtherCall'),('expected_hex','ff1564114000')]:
            b,m=sample_manifest();m['anchors'][0][key]=value
            with self.assertRaises(ValueError):V.verify(b,m)
        b,m=sample_manifest();m['anchors'][1]['branch_target']='0x401032'
        with self.assertRaises(ValueError):V.verify(b,m)
    def test_duplicate_anchor_id_rejected(self):
        b,m=sample_manifest();m['anchors'][1]['id']='api'
        with self.assertRaises(ValueError):V.verify(b,m)
if __name__=='__main__':unittest.main()
