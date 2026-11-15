import Foundation
import MoliCore

let usage = """
Usage:
  moli-inspect [--sha256] <file.exe> [file.exe ...]
  moli-inspect --graphic-index <index.bin> [--paired-bytes <count>]
Output is JSON. Only explicit local paths are read. Nothing is executed or fetched.
"""

do {
    var args = Array(CommandLine.arguments.dropFirst())
    guard !args.isEmpty, !args.contains("--help") else {
        print(usage)
        exit(args.isEmpty ? 2 : 0)
    }
    let encoder = JSONEncoder()
    encoder.outputFormatting = [.prettyPrinted, .sortedKeys]
    if args.first == "--graphic-index" {
        args.removeFirst()
        guard let path = args.first else { throw InspectionError.invalid(usage) }
        args.removeFirst()
        var pair: UInt64?
        if !args.isEmpty {
            guard args.count == 2, args[0] == "--paired-bytes", let count = UInt64(args[1]) else {
                throw InspectionError.invalid(usage)
            }
            pair = count
        }
        let result = try GraphicIndex40.inspect(url: URL(fileURLWithPath: path), pairedByteCount: pair)
        print(String(decoding: try encoder.encode(result), as: UTF8.self))
    } else {
        let hash = args.first == "--sha256"
        if hash { args.removeFirst() }
        guard !args.isEmpty, !args.contains(where: { $0.hasPrefix("--") }) else { throw InspectionError.invalid(usage) }
        let results = try args.map { try PEInspector.inspect(url: URL(fileURLWithPath: $0), hash: hash) }
        print(String(decoding: try encoder.encode(results), as: UTF8.self))
    }
} catch {
    FileHandle.standardError.write(Data((error.localizedDescription + "\n").utf8))
    exit(1)
}
