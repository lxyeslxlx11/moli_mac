import Foundation

public struct GraphicIndexRecord: Codable, Equatable, Sendable {
    public let id: UInt32
    public let offset: UInt32
    public let byteLength: UInt32
    public var endOffset: UInt64 { UInt64(offset) + UInt64(byteLength) }
}

public struct GraphicIndexSummary: Codable, Equatable, Sendable {
    public let recordCount: Int
    public let minimumOffset: UInt64
    public let maximumEndOffset: UInt64
    public let contiguousInFileOrder: Bool
    public let overlappingAdjacentRanges: Int
    public let zeroLengthRecords: Int
    public let pairedByteCount: UInt64?
}

/// Observed 40-byte index variant only: +0 id, +4 offset, +8 length (LE u32).
/// The remaining 28 bytes are deliberately uninterpreted. No sprite data is decoded.
public enum GraphicIndex40 {
    public static let maximumBytes = 64 * 1_048_576

    public static func inspect(url: URL, pairedByteCount: UInt64? = nil) throws -> GraphicIndexSummary {
        let file = try LocalBinaryFile(url: url)
        defer { try? file.handle.close() }
        guard file.byteCount <= maximumBytes else { throw InspectionError.unsupported("index exceeds 64 MiB budget") }
        return try inspect(data: file.read(at: 0, count: Int(file.byteCount)), pairedByteCount: pairedByteCount)
    }

    public static func inspect(data: Data, pairedByteCount: UInt64? = nil) throws -> GraphicIndexSummary {
        guard !data.isEmpty, data.count % 40 == 0 else { throw InspectionError.invalid("index must contain whole 40-byte records") }
        guard data.count <= maximumBytes else { throw InspectionError.unsupported("index exceeds 64 MiB budget") }
        let reader = ByteReader(data: data)
        var records: [GraphicIndexRecord] = []
        records.reserveCapacity(data.count / 40)
        for start in stride(from: 0, to: data.count, by: 40) {
            let record = GraphicIndexRecord(id: reader.u32(start), offset: reader.u32(start + 4), byteLength: reader.u32(start + 8))
            if let pairedByteCount, record.endOffset > pairedByteCount {
                throw InspectionError.invalid("record at byte \(start) exceeds paired file byte count")
            }
            records.append(record)
        }
        let sorted = records.sorted { $0.offset < $1.offset }
        // Shared storage or format variants may overlap. Report, do not invent a rule.
        let overlapCount = zip(sorted, sorted.dropFirst()).filter { $0.endOffset > UInt64($1.offset) }.count
        let contiguous = zip(records, records.dropFirst()).allSatisfy { $0.endOffset == UInt64($1.offset) }
        return GraphicIndexSummary(recordCount: records.count, minimumOffset: UInt64(sorted[0].offset),
                                   maximumEndOffset: records.map(\.endOffset).max()!,
                                   contiguousInFileOrder: contiguous, overlappingAdjacentRanges: overlapCount,
                                   zeroLengthRecords: records.filter { $0.byteLength == 0 }.count,
                                   pairedByteCount: pairedByteCount)
    }
}
