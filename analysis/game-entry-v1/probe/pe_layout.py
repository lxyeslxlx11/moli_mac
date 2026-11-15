"""Narrow build gate for our own page-aligned x86 PE files, not a Windows loader."""
import struct


class PELayoutError(ValueError):
    pass


def validate_own_x86_layout(data):
    def require(ok, code):
        if not ok:
            raise PELayoutError(code)

    def u16(at):
        require(0 <= at <= len(data) - 2, 'TRUNCATED')
        return struct.unpack_from('<H', data, at)[0]

    def u32(at):
        require(0 <= at <= len(data) - 4, 'TRUNCATED')
        return struct.unpack_from('<I', data, at)[0]

    def aligned(value, alignment):
        return (value + alignment - 1) // alignment * alignment

    require(len(data) >= 64 and data[:2] == b'MZ', 'DOS_HEADER')
    at = u32(60)
    require(at >= 64 and data[at:at + 4] == b'PE\0\0', 'PE_HEADER')
    count, optional_size = u16(at + 6), u16(at + 20)
    optional = at + 24
    require(u16(at + 4) == 0x14c and u16(optional) == 0x10b, 'X86_PE32')
    require(1 <= count <= 96 and optional_size >= 224, 'HEADER_SIZE')
    table = optional + optional_size
    require(table + count * 40 <= len(data), 'TRUNCATED')
    section_alignment, file_alignment = u32(optional + 32), u32(optional + 36)
    require(section_alignment >= 4096 and section_alignment & (section_alignment - 1) == 0,
            'SECTION_ALIGNMENT')
    require(512 <= file_alignment <= 65536 and file_alignment & (file_alignment - 1) == 0
            and section_alignment >= file_alignment, 'FILE_ALIGNMENT')
    image, headers = u32(optional + 56), u32(optional + 60)
    require(table + count * 40 <= headers <= len(data) and headers % file_alignment == 0,
            'HEADERS_RANGE')
    require(image > 0 and image % section_alignment == 0, 'IMAGE_ALIGNMENT')
    next_rva, last_raw_end = aligned(headers, section_alignment), headers
    rows = []
    for index in range(count):
        row = table + index * 40
        size, rva, raw, offset = (u32(row + delta) for delta in (8, 12, 16, 20))
        require(rva == next_rva, 'SECTION_GAP_OR_OVERLAP')
        require(max(size, raw) > 0 and rva + max(size, raw) <= image, 'SECTION_RANGE')
        require(raw % file_alignment == 0 and offset % file_alignment == 0, 'RAW_ALIGNMENT')
        if raw:
            require(last_raw_end <= offset and offset + raw <= len(data), 'RAW_RANGE')
            last_raw_end = offset + raw
        else:
            require(offset == 0, 'EMPTY_RAW_POINTER')
        next_rva = aligned(rva + max(size, raw), section_alignment)
        rows.append({'rva': rva, 'virtual_bytes': size, 'raw_bytes': raw, 'file_offset': offset})
    require(next_rva == image, 'IMAGE_SIZE')
    return {'section_alignment': section_alignment, 'file_alignment': file_alignment,
            'contiguous_sections': True, 'section_count': count, 'sections': rows,
            'scope': 'Selected own PE layout rules only; Windows execution remains required.'}
