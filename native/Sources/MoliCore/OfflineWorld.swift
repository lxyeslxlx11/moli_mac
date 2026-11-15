public struct GridPoint: Equatable, Sendable {
    public var x: Int
    public var y: Int
    public init(x: Int, y: Int) { self.x = x; self.y = y }
}

public enum Direction: CaseIterable, Sendable { case north, east, south, west }

/// Original demonstration geometry. It is unrelated to official maps or collision rules.
public struct OfflineWorld: Sendable {
    public let width = 12
    public let height = 12
    public private(set) var player = GridPoint(x: 5, y: 5)
    public private(set) var moves = 0
    public init() {}
    public func isBlocked(_ point: GridPoint) -> Bool {
        point.x < 0 || point.y < 0 || point.x >= width || point.y >= height ||
        (point.x == 2 && (2...8).contains(point.y)) ||
        (point.y == 9 && (5...10).contains(point.x))
    }
    @discardableResult public mutating func move(_ direction: Direction) -> Bool {
        var next = player
        switch direction {
        case .north: next.y -= 1
        case .south: next.y += 1
        case .east: next.x += 1
        case .west: next.x -= 1
        }
        guard !isBlocked(next) else { return false }
        player = next
        moves += 1
        return true
    }
    public mutating func reset() { self = OfflineWorld() }
}
