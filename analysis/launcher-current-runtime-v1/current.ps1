# Original project tooling. No policy changes, credentials, game launch or forced termination.
[CmdletBinding()]
param([ValidateSet('Verify','Install','Observe','Restore')][string]$Mode = 'Verify')
$ErrorActionPreference = 'Stop'
Set-StrictMode -Version 2.0

function Assert-PlainPath {
    param([string]$Path, [switch]$AllowMissingLeaf)
    $full = [IO.Path]::GetFullPath($Path)
    $cursor = $full
    $leaf = $true
    while ($cursor) {
        if (Test-Path -LiteralPath $cursor) {
            $item = Get-Item -LiteralPath $cursor -Force
            if (($item.Attributes -band [IO.FileAttributes]::ReparsePoint) -ne 0) { throw 'MOLI_REPARSE_PATH' }
            if ((-not $leaf) -and (-not $item.PSIsContainer)) { throw 'MOLI_PARENT_TYPE' }
        } elseif ((-not $leaf) -or (-not $AllowMissingLeaf)) { throw 'MOLI_MISSING_PATH' }
        $parent = [IO.Directory]::GetParent($cursor)
        if ($null -eq $parent) { break }
        $cursor = $parent.FullName
        $leaf = $false
    }
}

function Get-FileRecord {
    param([string]$Path, [string]$ExpectedSha = '')
    Assert-PlainPath $Path
    $item = Get-Item -LiteralPath $Path -Force
    if ($item.PSIsContainer -or $item.Length -gt 33554432) { throw 'MOLI_FILE_TYPE_OR_BUDGET' }
    $stream = [IO.File]::Open($item.FullName, [IO.FileMode]::Open, [IO.FileAccess]::Read, [IO.FileShare]::Read)
    $algorithm = [Security.Cryptography.SHA256]::Create()
    try { $sha = [BitConverter]::ToString($algorithm.ComputeHash($stream)).Replace('-','').ToLowerInvariant() }
    finally { $algorithm.Dispose(); $stream.Dispose() }
    if ($ExpectedSha -and $sha -cne $ExpectedSha) { throw 'MOLI_HASH_MISMATCH' }
    [pscustomobject]@{ Path=$item.FullName; Bytes=$item.Length; Sha256=$sha; Attributes=[int]$item.Attributes }
}

function Copy-VerifiedFile {
    param([string]$Source, [string]$Destination, [string]$ExpectedSha)
    $null = Get-FileRecord $Source $ExpectedSha
    Assert-PlainPath $Destination -AllowMissingLeaf
    if (Test-Path -LiteralPath $Destination) { throw 'MOLI_DESTINATION_EXISTS' }
    $inputStream = [IO.File]::Open($Source, [IO.FileMode]::Open, [IO.FileAccess]::Read, [IO.FileShare]::Read)
    try {
        $outputStream = [IO.File]::Open($Destination, [IO.FileMode]::CreateNew, [IO.FileAccess]::Write, [IO.FileShare]::None)
        try { $inputStream.CopyTo($outputStream); $outputStream.Flush($true) }
        finally { $outputStream.Dispose() }
    } finally { $inputStream.Dispose() }
    Get-FileRecord $Destination $ExpectedSha
}

function Save-NewJson {
    param([string]$Path, $Value)
    Assert-PlainPath $Path -AllowMissingLeaf
    $text = ConvertTo-Json -InputObject $Value -Depth 8
    $stream = [IO.File]::Open($Path, [IO.FileMode]::CreateNew, [IO.FileAccess]::Write, [IO.FileShare]::None)
    try {
        $encoding = [Text.UTF8Encoding]::new($false)
        $data = $encoding.GetBytes($text + "`n")
        $stream.Write($data, 0, $data.Length)
        $stream.Flush($true)
    } finally { $stream.Dispose() }
}

function Replace-VerifiedFile {
    param([string]$Staged, [string]$Target, [string]$BeforeSha, [string]$AfterSha)
    $before = Get-FileRecord $Target $BeforeSha
    $null = Get-FileRecord $Staged $AfterSha
    $item = Get-Item -LiteralPath $Target -Force
    $item.Attributes = [IO.FileAttributes]($before.Attributes -band (-bnot [int][IO.FileAttributes]::ReadOnly))
    # A typed null avoids PowerShell coercing an untyped $null backup string to empty.
    try { [IO.File]::Replace($Staged, $Target, [NullString]::Value) }
    catch {
        if ((Get-FileRecord $Target).Sha256 -ceq $BeforeSha) {
            (Get-Item -LiteralPath $Target -Force).Attributes = [IO.FileAttributes]$before.Attributes
        }
        throw 'MOLI_REPLACE_FAILED'
    }
    Get-FileRecord $Target $AfterSha
}

function Observe-ProcessHandle {
    param([Diagnostics.Process]$Process, [ValidateRange(1,90000)][int]$LimitMs = 90000)
    $watch = [Diagnostics.Stopwatch]::StartNew()
    $startUtc = $null
    try { $startUtc = $Process.StartTime.ToUniversalTime().ToString('o') } catch {}
    $exited = $false
    while ($watch.ElapsedMilliseconds -lt $LimitMs) {
        $remaining = $LimitMs - [int]$watch.ElapsedMilliseconds
        if ($remaining -le 0) { break }
        if ($Process.WaitForExit([Math]::Min(100, $remaining))) { $exited = $true; break }
    }
    $elapsed = $watch.ElapsedMilliseconds
    $exitCode = $null; $exitUtc = $null; $readStatus = 'not-exited'
    if ($exited) {
        $readStatus = 'complete'
        try { $exitCode = $Process.ExitCode; $exitUtc = $Process.ExitTime.ToUniversalTime().ToString('o') }
        catch { $readStatus = 'exit-metadata-unavailable' }
    }
    [pscustomobject]@{ Pid=$Process.Id; StartUtc=$startUtc; Exited=$exited; ExitCode=$exitCode; ExitUtc=$exitUtc;
        ObservationLimitMs=$LimitMs; ElapsedMs=$elapsed; RunningAtLimit=(-not $exited); ExitMetadata=$readStatus;
        ChildLifecycle='not-tracked'; ForcedTermination=$false }
}

function Assert-NoLauncherProcesses {
    $present = @(Get-Process -Name 'POLCN_Launcher','LauncherUpdater' -ErrorAction SilentlyContinue)
    if ($present.Count -ne 0) { throw 'MOLI_MATCHING_PROCESS_PRESENT' }
}

function Get-KnownFileSnapshot {
    param([string]$BaseRoot, $Specs)
    foreach ($spec in $Specs) {
        try { Get-FileRecord (Join-Path $BaseRoot $spec.Name) }
        catch { [pscustomobject]@{ Name=$spec.Name; Status='unavailable'; ErrorType=$_.Exception.GetType().FullName } }
    }
}

try {
    if ([Environment]::OSVersion.Platform -ne [PlatformID]::Win32NT) { throw 'MOLI_WINDOWS_REQUIRED' }
    $root = 'C:\MoliOffline\launcher-probe'
    $backup = 'C:\MoliOffline\current-stage89'
    $target = Join-Path $root 'POLCN_Launcher.exe'
    $candidate = Join-Path $PSScriptRoot 'CURRENT.EXE'
    $currentSha = '71180e5bdda771e7d57dd27d2b879beddee55d61b957dadf7a2da60c907cb69a'
    $oldSha = '109b13382e7fbd96759f52e8cdb4bc269c379a613dbbf1ddd04a69a4a5c8ef0e'
    $specs = @(
        [pscustomobject]@{Name='POLCN_Launcher.exe'; Sha=$oldSha; Bytes=599040},
        [pscustomobject]@{Name='LauncherUpdater.exe'; Sha='4c46fced55e7734ddc7c7ac15f2a56d20ba4cfefce43920b7f5e79b529284976'; Bytes=46080},
        [pscustomobject]@{Name='XML\GameList.xml'; Sha='be8f1213d77bd294fbb79b2fb51a5e7fecdc9aa3c0854db7a6d821fad20ef85a'; Bytes=4377},
        [pscustomobject]@{Name='XML\RegionList.xml'; Sha='0c94ca78c40c1940f241940a97aabef7849e9ad3285310046f346b69128a8438'; Bytes=6205}
    )
    Assert-PlainPath $root
    Assert-NoLauncherProcesses
    if ($Mode -in @('Verify','Install')) {
        $candidateRecord = Get-FileRecord $candidate $currentSha
        if ($candidateRecord.Bytes -ne 1496576) { throw 'MOLI_CANDIDATE_SIZE' }
        if (Test-Path -LiteralPath $backup) { throw 'MOLI_STAGE_ALREADY_EXISTS' }
        $records = @()
        foreach ($spec in $specs) {
            $record = Get-FileRecord (Join-Path $root $spec.Name) $spec.Sha
            if ($record.Bytes -ne $spec.Bytes) { throw 'MOLI_BASELINE_SIZE' }
            $records += [pscustomobject]@{Name=$spec.Name; Record=$record}
        }
        if ($Mode -eq 'Verify') {
            [pscustomobject]@{Status='verified-only'; Baseline=$records; Candidate=$candidateRecord; Mutations=0} | ConvertTo-Json -Depth 6
        } else {
            Assert-PlainPath (Split-Path $backup -Parent)
            $null = New-Item -ItemType Directory -Path $backup
            $null = New-Item -ItemType Directory -Path (Join-Path $backup 'XML')
            foreach ($spec in $specs) { $null = Copy-VerifiedFile (Join-Path $root $spec.Name) (Join-Path $backup $spec.Name) $spec.Sha }
            Save-NewJson (Join-Path $backup 'original.json') ([pscustomobject]@{Schema='moli.stage89.original.v1'; Root=$root; Files=$records})
            $staged = Join-Path $root 'POLCN_Launcher.stage89'
            $null = Copy-VerifiedFile $candidate $staged $currentSha
            Assert-NoLauncherProcesses
            $installed = Replace-VerifiedFile $staged $target $oldSha $currentSha
            Save-NewJson (Join-Path $backup 'installed.json') ([pscustomobject]@{Schema='moli.stage89.installed.v1'; Utc=[DateTime]::UtcNow.ToString('o'); Target=$installed; Execution='not-performed'})
            Write-Output 'MOLI_STAGE89_INSTALLED_NOT_EXECUTED'
        }
    } elseif ($Mode -eq 'Observe') {
        $null = Get-FileRecord $target $currentSha
        Assert-PlainPath (Join-Path $backup 'installed.json')
        $attemptPath = Join-Path $backup 'observe-attempt.json'
        $submitted = [DateTime]::UtcNow.ToString('o')
        Save-NewJson $attemptPath ([pscustomobject]@{Schema='moli.stage89.attempt.v1'; SubmissionUtc=$submitted; ExeSha256=$currentSha; Attempts=1})
        $wall = [Diagnostics.Stopwatch]::StartNew()
        $process = Start-Process -FilePath $target -WorkingDirectory $root -Verb RunAs -PassThru
        $returned = [DateTime]::UtcNow.ToString('o')
        $uacAndStartMs = $wall.ElapsedMilliseconds
        $lifecycle = Observe-ProcessHandle $process 90000
        $named = @(Get-Process -Name 'POLCN_Launcher','LauncherUpdater' -ErrorAction SilentlyContinue | Select-Object Id,ProcessName)
        Save-NewJson (Join-Path $backup 'observation.json') ([pscustomobject]@{
            Schema='moli.stage89.observation.v1'; SubmissionUtc=$submitted; StartProcessReturnedUtc=$returned;
            UacAndStartMs=$uacAndStartMs; TotalElapsedMs=$wall.ElapsedMilliseconds; Parent=$lifecycle;
            MatchingNamesAtReadback=$named; Files=@(Get-KnownFileSnapshot $root $specs);
            StableWindow='requires-fresh-UI'; ChildLifecycle='not-tracked'; CredentialsCollected=$false
        })
        $process.Dispose()
        Write-Output 'MOLI_STAGE89_OBSERVATION_RECORDED_NO_FORCED_CLOSE'
    } else {
        Assert-PlainPath (Join-Path $backup 'original.json')
        $original = Get-Content -Raw -LiteralPath (Join-Path $backup 'original.json') | ConvertFrom-Json
        if ($original.Schema -cne 'moli.stage89.original.v1' -or $original.Root -cne $root) { throw 'MOLI_RECEIPT_BINDING' }
        $saved = @($original.Files | Where-Object {$_.Name -ceq 'POLCN_Launcher.exe'})
        if ($saved.Count -ne 1 -or $saved[0].Record.Sha256 -cne $oldSha -or $saved[0].Record.Bytes -ne 599040) { throw 'MOLI_RECEIPT_SOURCE' }
        $attributes = [int]$saved[0].Record.Attributes
        if ($attributes -lt 0 -or ($attributes -band (-bnot 8353)) -ne 0) { throw 'MOLI_RECEIPT_ATTRIBUTES' }
        $oldCopy = Join-Path $backup 'POLCN_Launcher.exe'
        $null = Get-FileRecord $oldCopy $oldSha
        $now = Get-FileRecord $target
        if ($now.Sha256 -ceq $currentSha) {
            $staged = Join-Path $root 'POLCN_Launcher.restore89'
            $null = Copy-VerifiedFile $oldCopy $staged $oldSha
            $null = Replace-VerifiedFile $staged $target $currentSha $oldSha
        } elseif ($now.Sha256 -cne $oldSha) { throw 'MOLI_UNRECOGNIZED_CURRENT_EXE' }
        (Get-Item -LiteralPath $target -Force).Attributes = [IO.FileAttributes]$attributes
        $restored = Get-FileRecord $target $oldSha
        Save-NewJson (Join-Path $backup 'restored.json') ([pscustomobject]@{Schema='moli.stage89.restored.v1'; Target=$restored; OtherFiles='backed-up-only-not-restored'; VmRollback='not-performed'})
        Write-Output 'MOLI_STAGE89_EXE_RESTORED'
    }
    exit 0
} catch {
    [pscustomobject]@{Status='stopped'; Mode=$Mode; ErrorType=$_.Exception.GetType().FullName; HResult=$_.Exception.HResult; ControlledCode=$_.FullyQualifiedErrorId} | ConvertTo-Json -Compress
    exit 1
}
