// swift-tools-version: 6.0
import PackageDescription

let package = Package(
    name: "MoliNative",
    platforms: [.macOS(.v13)],
    products: [
        .library(name: "MoliCore", targets: ["MoliCore"]),
        .executable(name: "moli-inspect", targets: ["MoliInspect"]),
        .executable(name: "MoliOffline", targets: ["MoliOffline"])
    ],
    targets: [
        .target(name: "MoliCore"),
        .executableTarget(name: "MoliInspect", dependencies: ["MoliCore"]),
        .executableTarget(name: "MoliOffline", dependencies: ["MoliCore"]),
        .testTarget(name: "MoliCoreTests", dependencies: ["MoliCore"])
    ]
)
