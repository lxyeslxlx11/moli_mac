"""Original minimal PE fixtures, no official bytes. Audit helper, not product parser."""
from pathlib import Path
import struct
import tempfile
import unittest
from scan_network_static import PE

def fixture():
    b = bytearray(0x800)
    b[:2] = b'MZ'
    struct.pack_into('<I', b, 0x3c, 0x80)
    b[0x80:0x84] = b'PE\0\0'
    struct.pack_into('<HHIIIHH', b, 0x84, 0x14c, 3, 0, 0, 0, 224, 0x102)
    optional = 0x98
    struct.pack_into('<H', b, optional, 0x10b)
    struct.pack_into('<I', b, optional+16, 0x1000)
    struct.pack_into('<I', b, optional+28, 0x400000)
    struct.pack_into('<II', b, optional+104, 0x2000, 40)
    for i,(name,vs,rva,rs,ro) in enumerate([(b'.text',0x500,0x1000,0x200,0x200),(b'.rdata',0x400,0x2000,0x400,0x400),(b'.bss',0x100,0x3000,0,0)]):
        o=optional+224+40*i
        b[o:o+8] = name.ljust(8,b'\0')
        struct.pack_into('<IIII',b,o+8,vs,rva,rs,ro)
    struct.pack_into('<IIIII', b, 0x400, 0x2100, 0, 0, 0x2080, 0x2120)
    b[0x480:0x48c] = b'WININET.dll\0'
    struct.pack_into('<III',b,0x500,0x2140,0x80000007,0)
    struct.pack_into('<III',b,0x520,0x2140,0x80000007,0)
    b[0x540:0x549] = b'\0\0MyHttp\0'
    return bytes(b)

class PEHelperTests(unittest.TestCase):
    def load(self,data):
        with tempfile.TemporaryDirectory() as folder:
            path=Path(folder)/'synthetic.exe'
            path.write_bytes(data)
            return PE(path)

    def test_section_address_mapping(self):
        pe=self.load(fixture())
        self.assertEqual(pe.entry,0x401000)
        self.assertEqual(pe.file(0x401010),0x210)
        self.assertEqual(pe.file(0x402020),0x420)

    def test_unbacked_virtual_tail_and_section(self):
        pe=self.load(fixture())
        self.assertIsNone(pe.file(0x401250))
        self.assertIsNone(pe.file(0x403010))
        self.assertIsNone(pe.file(0x402400))

    def test_named_and_ordinal_iat(self):
        pe=self.load(fixture())
        self.assertEqual([x['symbol'] for x in pe.imports],['MyHttp','ordinal:7'])
        self.assertEqual(pe.imports[0]['dll'],'WININET.dll')
        self.assertEqual(pe.imports[0]['iat_va'],0x402120)
        self.assertEqual(pe.imports[0]['iat_file_offset'],0x520)
        self.assertEqual(pe.imports[1]['lookup_offset'],0x504)

    def test_truncated_input_is_not_accepted(self):
        for size in (0,63,128,0x180,0x403):
            with self.subTest(size=size):
                with self.assertRaises((ValueError,AssertionError,struct.error)):
                    self.load(fixture()[:size])

    def test_direct_operand_syntax(self):
        import re
        expression=r'^(?:0x)?([0-9a-f]+)(?:\s|$)'
        self.assertEqual(int(re.match(expression,'0x4462a0').group(1),16),0x4462a0)
        self.assertEqual(int(re.match(expression,'4462a0 <label>').group(1),16),0x4462a0)
        self.assertIsNone(re.match(expression,'DWORD PTR ds:0x469264'))

if __name__=='__main__': unittest.main()
