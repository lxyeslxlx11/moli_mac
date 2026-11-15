#!/bin/sh
set -eu
cd "$(dirname "$0")/.."
swift build "$@"
app_dir=".build/MoliOffline.app"
mkdir -p "$app_dir/Contents/MacOS"
cp .build/debug/MoliOffline "$app_dir/Contents/MacOS/MoliOffline"
cat > "$app_dir/Contents/Info.plist" <<'PLIST'
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0"><dict>
<key>CFBundleExecutable</key><string>MoliOffline</string>
<key>CFBundleIdentifier</key><string>local.moli.offline</string>
<key>CFBundleName</key><string>MoliOffline</string>
<key>CFBundlePackageType</key><string>APPL</string>
<key>CFBundleShortVersionString</key><string>0.1.0</string>
<key>LSMinimumSystemVersion</key><string>13.0</string>
<key>NSHighResolutionCapable</key><true/>
</dict></plist>
PLIST
printf '%s\n' "Development app: $PWD/$app_dir"
