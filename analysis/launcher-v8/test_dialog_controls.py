import struct
import unittest
from inspect_dialog_controls import inspect


def original_template(extended):
    header = (struct.pack('<HHIIIHhhhh', 1, 0xffff, 0, 0, 0x40, 2, 0, 0, 80, 40) if extended else
              struct.pack('<IIHhhhh', 0x40, 0, 2, 0, 0, 80, 40))
    data = header + bytes(6)  # Original empty menu/class/title.
    data += (struct.pack('<HHBB', 9, 400, 0, 1) if extended else struct.pack('<H', 9)) + bytes(2)
    for control_id, style in [(1013, 8), (1014, 32)]:
        data += bytes((-len(data)) % 4)
        data += (struct.pack('<IIIhhhhI', 0, 0, style, 0, 0, 20, 10, control_id) if extended else
                 struct.pack('<IIhhhhH', style, 0, 0, 0, 20, 10, control_id))
        data += struct.pack('<HHHH', 0xffff, 0x81, 0, 0)
    return data


class DialogControlsTests(unittest.TestCase):
    def test_original_standard_and_extended_alignment_and_flags(self):
        for extended in [False, True]:
            result = inspect(original_template(extended))
            self.assertEqual(result['format'], 'DLGTEMPLATEEX' if extended else 'DLGTEMPLATE')
            self.assertEqual(result['controls'], 2)
            self.assertEqual([r['id'] for r in result['selected']], [1013, 1014])
            self.assertEqual([r['class_ordinal'] for r in result['selected']], [0x81, 0x81])
            self.assertTrue(result['selected'][0]['flags']['uppercase'])
            self.assertFalse(result['selected'][0]['flags']['password'])
            self.assertTrue(result['selected'][1]['flags']['password'])
            self.assertFalse(result['selected'][1]['flags']['uppercase'])

    def test_all_original_truncated_prefixes_reject(self):
        for extended in [False, True]:
            data = original_template(extended)
            for length in range(len(data)):
                with self.assertRaises((ValueError, struct.error)):
                    inspect(data[:length])

    def test_nonzero_trailing_data_and_unsupported_creation_data_reject(self):
        data = original_template(True)
        with self.assertRaisesRegex(ValueError, 'trailing'):
            inspect(data + b'\x01')
        with self.assertRaisesRegex(ValueError, 'creation data'):
            inspect(data[:-2] + b'\x01\x00')

    def test_control_budget_rejects_before_parsing_unbounded_items(self):
        data = bytearray(original_template(True))
        struct.pack_into('<H', data, 16, 257)
        with self.assertRaisesRegex(ValueError, 'control count'):
            inspect(data)


if __name__ == '__main__':
    unittest.main()
