import Foundation
import CryptoKit

public struct PESection: Codable, Equatable, Sendable {
    public let name: String
    public let virtualAddress: UInt32
    public let rawOffset: UInt32
    public let rawByteCount: UInt32
}

public struct PEIdentity: Codable, Equatable, Sendable {
    public let fileName: String
    public let fileByteCount: UInt64
    public let machine: UInt16
    public let architecture: String
    public let format: String
    public let imageBase: UInt64
    public let entryPointRVA: UInt32
    public let subsystem: UInt16
    public let peHeaderOffset: UInt32
    public let sections: [PESection]
    public let sha256: String?
}

/// Structural header inspection only, not signature verification or a safety verdict.
public enum PEInspector {
    public static let maximumPEHeaderOffset: UInt64 = 1_048_576

    public static func inspect(url: URL, hash: Bool = false) throws -> PEIdentity {
        let file = try LocalBinaryFile(url: url)
        defer { try? file.handle.close() }
        let identity = try parse(fileName: url.lastPathComponent, byteCount: file.byteCount) {
            try file.read(at: $0, count: $1)
        }
        guard hash else { return identity }
        try file.handle.seek(toOffset: 0)
        var hasher = SHA256()
        var readCount: UInt64 = 0
        while readCount < file.byteCount {
            let requested = Int(min(1_048_576, file.byteCount - readCount))
            let chunk = try file.handle.read(upToCount: requested) ?? Data()
            guard !chunk.isEmpty else { throw InspectionError.invalid("file truncated while hashing") }
            readCount += UInt64(chunk.count)
            hasher.update(data: chunk)
        }
        guard try file.handle.seekToEnd() == file.byteCount else { throw InspectionError.invalid("file size changed while hashing") }
        let digest = hasher.finalize().map { String(format: "%02x", $0) }.joined()
        return PEIdentity(fileName: identity.fileName, fileByteCount: identity.fileByteCount,
                          machine: identity.machine, architecture: identity.architecture,
                          format: identity.format, imageBase: identity.imageBase,
                          entryPointRVA: identity.entryPointRVA, subsystem: identity.subsystem,
                          peHeaderOffset: identity.peHeaderOffset, sections: identity.sections, sha256: digest)
    }

    public static func inspect(data: Data, fileName: String = "fixture") throws -> PEIdentity {
        let bytes = Data(data) // Data slices may have a nonzero startIndex.
        return try parse(fileName: fileName, byteCount: UInt64(bytes.count)) { offset, count in
            guard offset <= bytes.count, count <= bytes.count - Int(offset) else {
                throw InspectionError.invalid("truncated byte range")
            }
            return bytes.subdata(in: Int(offset)..<(Int(offset) + count))
        }
    }

    private static func parse(fileName: String, byteCount: UInt64,
                              read: (UInt64, Int) throws -> Data) throws -> PEIdentity {
        let dos = ByteReader(data: try read(0, 64))
        guard dos.u16(0) == 0x5a4d else { throw InspectionError.invalid("missing MZ signature") }
        let peOffset = dos.u32(0x3c)
        guard peOffset >= 64 else { throw InspectionError.invalid("PE header overlaps DOS header") }
        guard peOffset <= maximumPEHeaderOffset else {
            throw InspectionError.unsupported("PE header offset exceeds 1 MiB budget")
        }
        let coff = ByteReader(data: try read(UInt64(peOffset), 24))
        guard coff.u32(0) == 0x4550 else { throw InspectionError.invalid("missing PE signature") }
        let machine = coff.u16(4)
        let count = Int(coff.u16(6))
        guard count > 0, count <= 96 else { throw InspectionError.unsupported("section count must be 1...96") }
        let optionalSize = Int(coff.u16(20))
        guard optionalSize >= 2, optionalSize <= 4096 else {
            throw InspectionError.unsupported("optional header size")
        }
        let optional = ByteReader(data: try read(UInt64(peOffset) + 24, optionalSize))
        let magic = optional.u16(0)
        let is64: Bool
        switch magic {
        case 0x10b: is64 = false
        case 0x20b: is64 = true
        default: throw InspectionError.unsupported(String(format: "optional header magic 0x%04x", magic))
        }
        guard optionalSize >= (is64 ? 112 : 96) else {
            throw InspectionError.invalid("optional header shorter than its format requires")
        }
        let sectionData = ByteReader(data: try read(UInt64(peOffset) + 24 + UInt64(optionalSize), count * 40))
        var sections: [PESection] = []
        for index in 0..<count {
            let offset = index * 40
            let nameBytes = sectionData.data[offset..<(offset + 8)].prefix { $0 != 0 }
            let name = String(decoding: nameBytes, as: UTF8.self)
            let size = sectionData.u32(offset + 16)
            let rawOffset = sectionData.u32(offset + 20)
            if size > 0 {
                guard UInt64(rawOffset) <= byteCount,
                      UInt64(size) <= byteCount - UInt64(rawOffset) else {
                    throw InspectionError.invalid("section \(name) raw range exceeds file")
                }
            }
            sections.append(PESection(name: name, virtualAddress: sectionData.u32(offset + 12),
                                      rawOffset: rawOffset, rawByteCount: size))
        }
        let architecture: String
        switch machine {
        case 0x14c: architecture = "Intel i386"
        case 0x8664: architecture = "AMD64 / x86_64"
        case 0xaa64: architecture = "ARM64"
        case 0x1c4: architecture = "ARM Thumb-2"
        default: architecture = String(format: "Unknown machine 0x%04x", machine)
        }
        return PEIdentity(fileName: fileName, fileByteCount: byteCount, machine: machine,
                          architecture: architecture, format: is64 ? "PE32+" : "PE32",
                          imageBase: is64 ? optional.u64(24) : UInt64(optional.u32(28)),
                          entryPointRVA: optional.u32(16), subsystem: optional.u16(68),
                          peHeaderOffset: peOffset, sections: sections, sha256: nil)
    }
}
