import SwiftUI
import AppKit
import MoliCore

@main
struct MoliOfflineApp: App {
    var body: some Scene {
        WindowGroup("Moli · 离线实验室") {
            LaboratoryView()
                .frame(minWidth: 960, minHeight: 660)
        }
        .windowStyle(.titleBar)
    }
}

struct LaboratoryView: View {
    @State private var world = OfflineWorld()
    @State private var inspection = "选择本地安装包或图形索引，只读取文件结构。"
    @State private var isInspecting = false
    @State private var lastAction = "准备就绪"

    var body: some View {
        HStack(spacing: 0) {
            VStack(alignment: .leading, spacing: 22) {
                VStack(alignment: .leading, spacing: 6) {
                    Text("MOLI NATIVE").font(.caption.weight(.bold)).tracking(3).foregroundStyle(.mint)
                    Text("离线实验室").font(.largeTitle.weight(.semibold))
                    Text("macOS 原生基础 · 01").font(.subheadline).foregroundStyle(.secondary)
                }
                Label("仅离线演示", systemImage: "network.slash").foregroundStyle(.mint)
                Text("官方服务器兼容性尚未验证。此版本没有登录、更新下载或联网能力。")
                    .font(.callout).foregroundStyle(.secondary).fixedSize(horizontal: false, vertical: true)
                Divider()
                Text("本地文件检查").font(.headline)
                Button(action: { chooseFile(index: false) }) {
                    Label("检查 PE 文件…", systemImage: "doc.text.magnifyingglass").frame(maxWidth: .infinity)
                }.disabled(isInspecting)
                Button(action: { chooseFile(index: true) }) {
                    Label("检查图形索引…", systemImage: "square.stack.3d.up").frame(maxWidth: .infinity)
                }.disabled(isInspecting)
                if isInspecting { ProgressView().controlSize(.small) }
                ScrollView {
                    Text(inspection).font(.system(.caption, design: .monospaced))
                        .textSelection(.enabled).frame(maxWidth: .infinity, alignment: .leading)
                }
                Text("不执行所选文件。索引仅解释已观察到的 40 字节记录头，尚未解码官方图像。")
                    .font(.caption).foregroundStyle(.secondary).fixedSize(horizontal: false, vertical: true)
            }
            .padding(28).frame(width: 296).background(Color(red: 0.07, green: 0.11, blue: 0.16))
            VStack(alignment: .leading, spacing: 18) {
                HStack {
                    VStack(alignment: .leading, spacing: 5) {
                        Text("原创场景 · 等距网格").font(.title2.weight(.semibold))
                        Text("方向键 / WASD 移动，蓝色地块不可通行").foregroundStyle(.secondary)
                    }
                    Spacer()
                    Button("重置") { world.reset(); lastAction = "已重置" }
                }
                ZStack {
                    RoundedRectangle(cornerRadius: 20).fill(Color(red: 0.08, green: 0.14, blue: 0.19))
                    WorldCanvas(world: world).padding(20)
                    KeyCapture { direction in move(direction) }
                        .accessibilityLabel("离线地图，使用方向键或 WASD 移动")
                }
                .frame(minHeight: 390)
                HStack(spacing: 16) {
                    Label("\(world.player.x), \(world.player.y)", systemImage: "location.fill")
                    Text("\(world.moves) 步").foregroundStyle(.secondary)
                    Spacer()
                    Text(lastAction).foregroundStyle(.secondary)
                    Button("←") { move(.west) }
                    Button("↑") { move(.north) }
                    Button("↓") { move(.south) }
                    Button("→") { move(.east) }
                }.font(.callout.monospacedDigit())
                Text("场景与角色均为程序生成的原创图形；此处验证渲染、输入和移动状态，不代表官方游戏规则。")
                    .font(.caption).foregroundStyle(.secondary)
            }.padding(30)
        }
        .background(Color(red: 0.04, green: 0.08, blue: 0.12))
        .preferredColorScheme(.dark)
    }

    private func move(_ direction: Direction) {
        lastAction = world.move(direction) ? "已移动" : "前方不可通行"
    }

    private func chooseFile(index: Bool) {
        let panel = NSOpenPanel()
        panel.canChooseDirectories = false
        panel.allowsMultipleSelection = false
        panel.message = index ? "选择 GraphicInfo*.bin；不会打开图像数据或连接服务器。" : "选择本地 PE 文件；仅读取头部，不运行程序。"
        guard panel.runModal() == .OK, let url = panel.url else { return }
        isInspecting = true
        inspection = "正在检查 \(url.lastPathComponent)…"
        Task {
            let text = await Task.detached(priority: .userInitiated) {
                do {
                    if index {
                        let result = try GraphicIndex40.inspect(url: url)
                        return "\(url.lastPathComponent)\n\n40-byte 候选布局\n记录：\(result.recordCount)\n最大结束偏移：\(result.maximumEndOffset)\n顺序连续：\(result.contiguousInFileOrder ? "是" : "否")\n相邻重叠：\(result.overlappingAdjacentRanges)\n\n未选择配对 Graphic 数据；范围尚未与数据文件核对。"
                    }
                    let result = try PEInspector.inspect(url: url)
                    return "\(result.fileName)\n\n\(result.format) · \(result.architecture)\n文件：\(result.fileByteCount) bytes\n节数：\(result.sections.count)\n入口 RVA：\(String(format: "0x%x", result.entryPointRVA))\n\n这是结构识别，不是签名验证或安全结论。"
                } catch { return error.localizedDescription }
            }.value
            inspection = text
            isInspecting = false
        }
    }
}

struct WorldCanvas: View {
    let world: OfflineWorld
    var body: some View {
        Canvas { context, size in
            let tileWidth = min(size.width / 12.8, size.height / 6.8)
            let tileHeight = tileWidth / 2
            let origin = CGPoint(x: size.width / 2, y: (size.height - tileHeight * 12) / 2 + tileHeight / 2)
            func center(_ x: Int, _ y: Int) -> CGPoint {
                CGPoint(x: origin.x + Double(x - y) * tileWidth / 2,
                        y: origin.y + Double(x + y) * tileHeight / 2)
            }
            for depth in 0..<(world.width + world.height - 1) {
                for y in 0..<world.height {
                    let x = depth - y
                    guard (0..<world.width).contains(x) else { continue }
                    let c = center(x, y)
                    var path = Path()
                    path.move(to: CGPoint(x: c.x, y: c.y - tileHeight / 2))
                    path.addLine(to: CGPoint(x: c.x + tileWidth / 2, y: c.y))
                    path.addLine(to: CGPoint(x: c.x, y: c.y + tileHeight / 2))
                    path.addLine(to: CGPoint(x: c.x - tileWidth / 2, y: c.y))
                    path.closeSubpath()
                    let blocked = world.isBlocked(GridPoint(x: x, y: y))
                    let color = blocked ? Color(red: 0.12, green: 0.35, blue: 0.47) :
                        ((x + y).isMultiple(of: 2) ? Color(red: 0.25, green: 0.40, blue: 0.34) : Color(red: 0.29, green: 0.45, blue: 0.38))
                    context.fill(path, with: .color(color))
                    context.stroke(path, with: .color(.black.opacity(0.15)), lineWidth: 1)
                    if world.player == GridPoint(x: x, y: y) {
                        context.fill(Path(ellipseIn: CGRect(x: c.x - 12, y: c.y - 4, width: 24, height: 10)), with: .color(.black.opacity(0.3)))
                        context.fill(Path(roundedRect: CGRect(x: c.x - 8, y: c.y - 27, width: 16, height: 28), cornerRadius: 6), with: .color(.mint))
                        context.fill(Path(ellipseIn: CGRect(x: c.x - 7, y: c.y - 38, width: 14, height: 14)), with: .color(Color(red: 0.96, green: 0.82, blue: 0.61)))
                    }
                }
            }
        }
    }
}

struct KeyCapture: NSViewRepresentable {
    let onMove: (Direction) -> Void
    func makeNSView(context: Context) -> KeyView { KeyView(onMove: onMove) }
    func updateNSView(_ view: KeyView, context: Context) { view.onMove = onMove }
    final class KeyView: NSView {
        var onMove: (Direction) -> Void
        init(onMove: @escaping (Direction) -> Void) { self.onMove = onMove; super.init(frame: .zero) }
        required init?(coder: NSCoder) { nil }
        override var acceptsFirstResponder: Bool { true }
        override func viewDidMoveToWindow() { super.viewDidMoveToWindow(); window?.makeFirstResponder(self) }
        override func mouseDown(with event: NSEvent) { window?.makeFirstResponder(self) }
        override func keyDown(with event: NSEvent) {
            if event.modifierFlags.contains(.command) || event.modifierFlags.contains(.control) || event.modifierFlags.contains(.option) {
                super.keyDown(with: event); return
            }
            switch event.keyCode {
            case 123, 0: onMove(.west)
            case 124, 2: onMove(.east)
            case 125, 1: onMove(.south)
            case 126, 13: onMove(.north)
            default: super.keyDown(with: event)
            }
        }
    }
}
