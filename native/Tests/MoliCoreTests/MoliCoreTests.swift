import XCTest
import Darwin
@testable import MoliCore

final class MoliCoreTests: XCTestCase {
    func put16(_ value: UInt16, _ offset: Int, in data: inout Data) {
        data[offset] = UInt8(truncatingIfNeeded: value)
        data[offset + 1] = UInt8(truncatingIfNeeded: value >> 8)
    }
    func put32(_ value: UInt32, _ offset: Int, in data: inout Data) {
        put16(UInt16(truncatingIfNeeded: value), offset, in: &data)
        put16(UInt16(truncatingIfNeeded: value >> 16), offset + 2, in: &data)
    }
    func fixture(is64: Bool = false) -> Data {
        var data = Data(repeating: 0, count: 1024)
        put16(0x5a4d, 0, in: &data)
        put32(0x80, 0x3c, in: &data)
        put32(0x4550, 0x80, in: &data)
        put16(is64 ? 0x8664 : 0x14c, 0x84, in: &data)
        put16(1, 0x86, in: &data)
        put16(is64 ? 240 : 224, 0x94, in: &data)
        let opt = 0x98
        put16(is64 ? 0x20b : 0x10b, opt, in: &data)
        put32(0x1000, opt + 16, in: &data)
        put32(0x400000, opt + (is64 ? 24 : 28), in: &data)
        put16(2, opt + 68, in: &data)
        let section = opt + (is64 ? 240 : 224)
        data.replaceSubrange(section..<(section + 5), with: Data(".text".utf8))
        put32(0x1000, section + 12, in: &data)
        put32(512, section + 16, in: &data)
        put32(512, section + 20, in: &data)
        return data
    }
    func index(_ records: [(UInt32, UInt32, UInt32)]) -> Data {
        var data = Data(repeating: 0, count: records.count * 40)
        for (i, record) in records.enumerated() {
            put32(record.0, i * 40, in: &data)
            put32(record.1, i * 40 + 4, in: &data)
            put32(record.2, i * 40 + 8, in: &data)
        }
        return data
    }

    func testPE32AndPE32Plus() throws {
        let pe32 = try PEInspector.inspect(data: fixture())
        XCTAssertEqual(pe32.format, "PE32")
        XCTAssertEqual(pe32.architecture, "Intel i386")
        XCTAssertEqual(pe32.entryPointRVA, 0x1000)
        XCTAssertEqual(pe32.sections[0].name, ".text")
        let pe64 = try PEInspector.inspect(data: fixture(is64: true))
        XCTAssertEqual(pe64.format, "PE32+")
        XCTAssertEqual(pe64.architecture, "AMD64 / x86_64")
        XCTAssertEqual(pe64.imageBase, 0x400000)
    }
    func testTruncationAcrossHeaders() {
        for size in [0, 1, 63, 128, 151, 153, 375, 415] {
            XCTAssertThrowsError(try PEInspector.inspect(data: fixture().prefix(size)), "size \(size)")
        }
    }
    func testBadSignatures() {
        var data = fixture()
        data[0] = 0
        XCTAssertThrowsError(try PEInspector.inspect(data: data))
        data = fixture()
        data[0x80] = 0
        XCTAssertThrowsError(try PEInspector.inspect(data: data))
    }
    func testHeaderOffsetRejectsOverlapAndBudget() {
        for offset: UInt32 in [0, 63, UInt32.max] {
            var data = fixture()
            put32(offset, 0x3c, in: &data)
            XCTAssertThrowsError(try PEInspector.inspect(data: data))
        }
    }
    func testOptionalMagicAndMinimumLength() {
        var data = fixture()
        put16(0x107, 0x98, in: &data)
        XCTAssertThrowsError(try PEInspector.inspect(data: data))
        data = fixture()
        put16(70, 0x94, in: &data)
        XCTAssertThrowsError(try PEInspector.inspect(data: data))
    }
    func testSectionBudgetAndRawBounds() {
        var data = fixture()
        put16(UInt16.max, 0x86, in: &data)
        XCTAssertThrowsError(try PEInspector.inspect(data: data))
        data = fixture()
        put32(UInt32.max, 0x98 + 224 + 20, in: &data)
        XCTAssertThrowsError(try PEInspector.inspect(data: data))
    }
    func testUnknownMachinePreserved() throws {
        var data = fixture()
        put16(0xabcd, 0x84, in: &data)
        let identity = try PEInspector.inspect(data: data)
        XCTAssertEqual(identity.machine, 0xabcd)
        XCTAssertTrue(identity.architecture.contains("abcd"))
    }
    func testNonzeroStartIndexDataSlices() throws {
        let pe = Data([0xff]) + fixture()
        XCTAssertEqual(try PEInspector.inspect(data: pe.dropFirst()), try PEInspector.inspect(data: fixture()))
        let graphics = index([(1, 0, 12)])
        let sliced = (Data([0xff]) + graphics).dropFirst()
        XCTAssertEqual(try GraphicIndex40.inspect(data: sliced), try GraphicIndex40.inspect(data: graphics))
    }
    func testSparseLargeFileUsesHeaderReads() throws {
        let url = FileManager.default.temporaryDirectory.appendingPathComponent(UUID().uuidString)
        try fixture().write(to: url)
        defer { try? FileManager.default.removeItem(at: url) }
        let writer = try FileHandle(forWritingTo: url)
        try writer.truncate(atOffset: 5 * 1024 * 1024 * 1024)
        try writer.close()
        let identity = try PEInspector.inspect(url: url)
        XCTAssertEqual(identity.fileByteCount, 5 * 1024 * 1024 * 1024)
        XCTAssertEqual(identity.sections.count, 1)
    }
    func testFIFOIsRejectedWithoutWaitingForWriter() throws {
        let url = FileManager.default.temporaryDirectory.appendingPathComponent(UUID().uuidString)
        XCTAssertEqual(mkfifo(url.path, 0o600), 0)
        defer { try? FileManager.default.removeItem(at: url) }
        let start = Date()
        XCTAssertThrowsError(try PEInspector.inspect(url: url))
        XCTAssertThrowsError(try GraphicIndex40.inspect(url: url))
        XCTAssertLessThan(Date().timeIntervalSince(start), 1)
    }
    func testFileAndMemoryInspectionAgreeWithStreamingHash() throws {
        let url = FileManager.default.temporaryDirectory.appendingPathComponent(UUID().uuidString)
        try fixture().write(to: url)
        defer { try? FileManager.default.removeItem(at: url) }
        let identity = try PEInspector.inspect(url: url, hash: true)
        XCTAssertEqual(identity.sha256?.count, 64)
        XCTAssertEqual(identity.sections, try PEInspector.inspect(data: fixture()).sections)
    }
    func testGraphicIndexKnownFieldsAndContiguity() throws {
        let summary = try GraphicIndex40.inspect(data: index([(1, 0, 20), (2, 20, 30)]), pairedByteCount: 50)
        XCTAssertEqual(summary.recordCount, 2)
        XCTAssertEqual(summary.maximumEndOffset, 50)
        XCTAssertTrue(summary.contiguousInFileOrder)
    }
    func testGraphicIndexTruncatedRecordRejected() {
        XCTAssertThrowsError(try GraphicIndex40.inspect(data: Data(repeating: 0, count: 39)))
        XCTAssertThrowsError(try GraphicIndex40.inspect(data: Data()))
    }
    func testGraphicIndexRangeArithmeticDoesNotWrap() throws {
        let data = index([(1, UInt32.max - 5, 12)])
        XCTAssertThrowsError(try GraphicIndex40.inspect(data: data, pairedByteCount: UInt64(UInt32.max)))
        let summary = try GraphicIndex40.inspect(data: data)
        XCTAssertEqual(summary.maximumEndOffset, UInt64(UInt32.max) + 7)
    }
    func testGraphicIndexGapsAndOverlapAreObservations() throws {
        let gap = try GraphicIndex40.inspect(data: index([(1, 0, 10), (2, 20, 10)]))
        XCTAssertFalse(gap.contiguousInFileOrder)
        let shared = try GraphicIndex40.inspect(data: index([(1, 0, 20), (2, 5, 10)]))
        XCTAssertEqual(shared.overlappingAdjacentRanges, 1)
        XCTAssertEqual(shared.maximumEndOffset, 20)
        let zero = try GraphicIndex40.inspect(data: index([(1, 0, 0)]))
        XCTAssertEqual(zero.zeroLengthRecords, 1)
    }
    func testMovementCollisionBoundsAndReset() {
        var world = OfflineWorld()
        XCTAssertTrue(world.move(.west))
        XCTAssertTrue(world.move(.west))
        XCTAssertFalse(world.move(.west))
        XCTAssertEqual(world.player, GridPoint(x: 3, y: 5))
        for _ in 0..<20 { world.move(.north) }
        XCTAssertEqual(world.player.y, 0)
        XCTAssertFalse(world.move(.north))
        world.reset()
        XCTAssertEqual(world.player, GridPoint(x: 5, y: 5))
        XCTAssertEqual(world.moves, 0)
    }
}
