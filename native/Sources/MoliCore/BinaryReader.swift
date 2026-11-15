import Foundation
import Darwin

public enum InspectionError: Error, LocalizedError, Equatable {
    case invalid(String)
    case unsupported(String)
    public var errorDescription: String? {
        switch self {
        case .invalid(let message): return "Invalid data: \(message)"
        case .unsupported(let message): return "Outside inspection limits: \(message)"
        }
    }
}

struct ByteReader {
    let data: Data
    init(data: Data) { self.data = Data(data) }
    func u16(_ offset: Int) -> UInt16 {
        UInt16(data[offset]) | UInt16(data[offset + 1]) << 8
    }
    func u32(_ offset: Int) -> UInt32 {
        UInt32(u16(offset)) | UInt32(u16(offset + 2)) << 16
    }
    func u64(_ offset: Int) -> UInt64 {
        UInt64(u32(offset)) | UInt64(u32(offset + 4)) << 32
    }
}

/// Reads only explicit byte ranges. It never loads or executes PE code.
struct LocalBinaryFile {
    let handle: FileHandle
    let byteCount: UInt64
    init(url: URL) throws {
        let descriptor = open(url.path, O_RDONLY | O_NONBLOCK | O_CLOEXEC)
        guard descriptor >= 0 else { throw POSIXError(POSIXErrorCode(rawValue: errno) ?? .EIO) }
        handle = FileHandle(fileDescriptor: descriptor, closeOnDealloc: true)
        do {
            var metadata = stat()
            guard fstat(handle.fileDescriptor, &metadata) == 0,
                  metadata.st_mode & S_IFMT == S_IFREG else {
                throw InspectionError.unsupported("only regular local files are inspected")
            }
            byteCount = try handle.seekToEnd()
        } catch {
            try? handle.close()
            throw error
        }
    }
    func read(at offset: UInt64, count: Int) throws -> Data {
        guard offset <= byteCount, UInt64(count) <= byteCount - offset else {
            throw InspectionError.invalid("truncated byte range at \(offset), length \(count)")
        }
        try handle.seek(toOffset: offset)
        let data = try handle.read(upToCount: count) ?? Data()
        guard data.count == count else { throw InspectionError.invalid("short read") }
        return data
    }
}
