import hashlib
import struct
import unittest
from verify_launch import PE32, EvidenceError, inspect_anchor, verify

def fixture():
    b=bytearray(0x600)
    b[:2]=b'MZ';struct.pack_into('<I',b,0x3c,0x80)
    b[0x80:0x84]=b'PE\0\0'
    struct.pack_into('<H',b,0x86,1);struct.pack_into('<H',b,0x94,224)
    op=0x98;struct.pack_into('<H',b,op,0x10b);struct.pack_into('<I',b,op+28,0x400000)
    struct.pack_into('<II',b,op+104,0x1100,40)
    sec=op+224;b[sec:sec+5]=b'.text';struct.pack_into('<IIII',b,sec+8,0x500,0x1000,0x400,0x200)
    # Synthetic import descriptor, thunk, DLL and import-by-name.
    struct.pack_into('<IIIII',b,0x300,0x1140,0,0,0x1180,0x1160)
    struct.pack_into('<I',b,0x340,0x1190);struct.pack_into('<I',b,0x360,0x1190)
    b[0x380:0x38d]=b'fixture.dll\0\0';b[0x392:0x39b]=b'FakeCall\0'
    b[0x200:0x206]=b'\xff\x15'+struct.pack('<I',0x401160)
    b[0x210:0x215]=b'\xe8'+struct.pack('<i',-0x15)
    b[0x220:0x225]=b'\x68'+struct.pack('<I',0x4011a0)
    b[0x3a0:0x3a6]=b'hello\0'
    return bytes(b)

class LaunchEvidenceTests(unittest.TestCase):
    def test_valid_mapping_and_import_identity(self):
        p=PE32(fixture());self.assertEqual(p.offset(0x401000),0x200)
        row={'id':'x','kind':'iat_call','va':'0x401000','target':'0x401160','api':'FakeCall'}
        self.assertTrue(inspect_anchor(p,row,p.imports())['passed'])
    def test_truncated_and_bad_headers(self):
        for cut in [0,63,0x82,0x100,0x180,0x5ff]:
            with self.assertRaises(EvidenceError):PE32(fixture()[:cut])
        b=bytearray(fixture());b[0x98]=0x0b;b[0x99]=0x02
        with self.assertRaises(EvidenceError):PE32(bytes(b))
    def test_virtual_only_and_end_crossing_rejected(self):
        p=PE32(fixture())
        for va,n in [(0x401400,1),(0x4013ff,2),(0x400fff,1)]:
            with self.assertRaises(EvidenceError):p.offset(va,n)
    def test_relative_call_sign_and_target_mismatch(self):
        p=PE32(fixture());row={'id':'x','kind':'direct_call','va':'0x401010','target':'0x401000'}
        self.assertTrue(inspect_anchor(p,row,{})['passed'])
        row['target']='0x401001'
        with self.assertRaises(EvidenceError):inspect_anchor(p,row,{})
    def test_iat_name_and_opcode_mismatch(self):
        p=PE32(fixture());row={'id':'x','kind':'iat_call','va':'0x401000','target':'0x401160','api':'Other'}
        with self.assertRaises(EvidenceError):inspect_anchor(p,row,p.imports())
        row.update(va='0x401010',api='FakeCall')
        with self.assertRaises(EvidenceError):inspect_anchor(p,row,p.imports())
    def test_literal_reference_and_bounded_string(self):
        p=PE32(fixture());row={'id':'x','kind':'literal_reference','va':'0x401020','target':'0x4011a0','literal':'hello'}
        self.assertTrue(inspect_anchor(p,row,{})['passed'])
        with self.assertRaises(EvidenceError):p.cstring(0x4011a0,5)
        row['literal']='different'
        with self.assertRaises(EvidenceError):inspect_anchor(p,row,{})
    def test_changed_sample_and_duplicate_ids_rejected(self):
        b=fixture();m={'sample':{'sha256':hashlib.sha256(b).hexdigest()},'anchors':[]}
        self.assertTrue(verify(b,m)['all_passed'])
        changed=bytearray(b);changed[-1]=1
        with self.assertRaises(EvidenceError):verify(bytes(changed),m)
        m['anchors']=[{'id':'duplicate'},{'id':'duplicate'}]
        with self.assertRaises(EvidenceError):verify(b,m)

if __name__=='__main__':unittest.main()
