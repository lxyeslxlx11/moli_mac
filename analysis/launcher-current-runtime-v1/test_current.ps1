[CmdletBinding()]
param([Parameter(Mandatory=$true)][string]$Sandbox, [Parameter(Mandatory=$true)][string]$Pwsh)
$ErrorActionPreference = 'Stop'
Set-StrictMode -Version 2.0
$source = Join-Path $PSScriptRoot 'current.ps1'
$tokens = $null; $errors = $null
$ast = [Management.Automation.Language.Parser]::ParseFile($source, [ref]$tokens, [ref]$errors)
if ($errors.Count) { throw 'Original tooling has parse errors' }
$definitions = @($ast.FindAll({param($node) $node -is [Management.Automation.Language.FunctionDefinitionAst]}, $true))
foreach ($definition in $definitions) { . ([scriptblock]::Create($definition.Extent.Text)) }
if (Test-Path -LiteralPath $Sandbox) { throw 'Sandbox must be new' }
$null = New-Item -ItemType Directory -Path $Sandbox
$script:passed = @()
function Check {
    param([string]$Name, [scriptblock]$Action)
    & $Action
    $script:passed += $Name
}
function Must-Reject {
    param([scriptblock]$Action)
    $rejected = $false
    try { $null = & $Action } catch { $rejected = $true }
    if (-not $rejected) { throw 'Expected rejection' }
}
function Need {
    param([bool]$Value)
    if (-not $Value) { throw 'Original fixture assertion failed' }
}
$old = Join-Path $Sandbox 'old.txt'; $new = Join-Path $Sandbox 'new.txt'
[IO.File]::WriteAllText($old, 'Original old fixture bytes')
[IO.File]::WriteAllText($new, 'Original replacement fixture bytes')
$oldHash = (Get-FileRecord $old).Sha256; $newHash = (Get-FileRecord $new).Sha256

Check 'parser-and-fixed-launch-scope' {
    Need ($definitions.Count -eq 8)
    $commands = @($ast.FindAll({param($n) $n -is [Management.Automation.Language.CommandAst]}, $true))
    Need (@($commands | Where-Object {$_.GetCommandName() -eq 'Start-Process'}).Count -eq 1)
    foreach ($command in $commands) {
        Need ($command.GetCommandName() -notin @('Set-ExecutionPolicy','Invoke-Expression','Set-ItemProperty','Remove-Item','Stop-Process'))
    }
    $launch = @($commands | Where-Object {$_.GetCommandName() -eq 'Start-Process'})[0]
    Need ($launch.Extent.Text -ceq 'Start-Process -FilePath $target -WorkingDirectory $root -Verb RunAs -PassThru')
    $text = [IO.File]::ReadAllText($source)
    Need (-not ($text -match 'EncodedCommand|TerminateProcess|\.Kill\(|Get-Credential|Get-CommandLine|CloseMainWindow'))
    Need ($text.Contains('[IO.File]::Replace($Staged, $Target, [NullString]::Value)'))
}
Check 'file-hash-and-budget' {
    Need ((Get-FileRecord $old $oldHash).Bytes -eq 26)
    Must-Reject { Get-FileRecord $old ('0' * 64) }
    Must-Reject { Get-FileRecord $Sandbox }
    $big = Join-Path $Sandbox 'sparse-original.dat'
    $file = [IO.File]::Open($big, [IO.FileMode]::CreateNew)
    try { $file.SetLength(33554433) } finally { $file.Dispose() }
    Must-Reject { Get-FileRecord $big }
}
Check 'copy-verifies-both-and-preserves-original' {
    $destination = Join-Path $Sandbox 'copy.txt'
    $copy = Copy-VerifiedFile $old $destination $oldHash
    Need ($copy.Sha256 -ceq $oldHash)
    Need ((Get-FileRecord $old).Sha256 -ceq $oldHash)
    Must-Reject { Copy-VerifiedFile $new $destination $newHash }
    Need ((Get-FileRecord $destination).Sha256 -ceq $oldHash)
}
Check 'wrong-source-hash-leaves-no-destination' {
    $destination = Join-Path $Sandbox 'must-not-exist.txt'
    Must-Reject { Copy-VerifiedFile $old $destination ('0' * 64) }
    Need (-not (Test-Path -LiteralPath $destination))
}
Check 'reject-reparse-leaf-and-parent' {
    $leaf = Join-Path $Sandbox 'leaf-link'
    $null = New-Item -ItemType SymbolicLink -Path $leaf -Target $old
    Must-Reject { Get-FileRecord $leaf }
    $folder = Join-Path $Sandbox 'real-folder'; $null = New-Item -ItemType Directory -Path $folder
    [IO.File]::WriteAllText((Join-Path $folder 'value.txt'), 'Original linked directory fixture')
    $link = Join-Path $Sandbox 'parent-link'; $null = New-Item -ItemType SymbolicLink -Path $link -Target $folder
    Must-Reject { Get-FileRecord (Join-Path $link 'value.txt') }
}
Check 'create-new-json-cannot-overwrite' {
    $path = Join-Path $Sandbox 'receipt.json'
    Save-NewJson $path ([pscustomobject]@{Schema='original'; Value=17})
    $first = [IO.File]::ReadAllText($path)
    Must-Reject { Save-NewJson $path ([pscustomobject]@{Schema='changed'}) }
    Need ([IO.File]::ReadAllText($path) -ceq $first)
    Need (($first | ConvertFrom-Json).Value -eq 17)
}
Check 'atomic-replace-checks-preimage-and-postimage' {
    $target = Join-Path $Sandbox 'target.txt'; $staged = Join-Path $Sandbox 'staged.txt'
    $null = Copy-VerifiedFile $old $target $oldHash
    $null = Copy-VerifiedFile $new $staged $newHash
    Must-Reject { Replace-VerifiedFile $staged $target ('0' * 64) $newHash }
    Need ((Get-FileRecord $target).Sha256 -ceq $oldHash)
    Must-Reject { Replace-VerifiedFile $staged $target $oldHash ('0' * 64) }
    Need ((Get-FileRecord $target).Sha256 -ceq $oldHash)
    $null = Replace-VerifiedFile $staged $target $oldHash $newHash
    Need ((Get-FileRecord $target).Sha256 -ceq $newHash)
    Need ((Get-FileRecord $old).Sha256 -ceq $oldHash)
}
Check 'restore-original-through-verified-backup' {
    $target = Join-Path $Sandbox 'target.txt'; $staged = Join-Path $Sandbox 'restore.txt'
    $null = Copy-VerifiedFile $old $staged $oldHash
    $null = Replace-VerifiedFile $staged $target $newHash $oldHash
    Need ((Get-FileRecord $target).Sha256 -ceq $oldHash)
}
Check 'readonly-clear-and-original-attribute-restore' {
    $target = Join-Path $Sandbox 'readonly-target.txt'; $staged = Join-Path $Sandbox 'readonly-staged.txt'
    $null = Copy-VerifiedFile $old $target $oldHash
    $null = Copy-VerifiedFile $new $staged $newHash
    (Get-Item -LiteralPath $target).Attributes = [IO.FileAttributes]::ReadOnly
    $attributes = (Get-FileRecord $target).Attributes
    Need (($attributes -band [int][IO.FileAttributes]::ReadOnly) -ne 0)
    $null = Replace-VerifiedFile $staged $target $oldHash $newHash
    Need (((Get-FileRecord $target).Attributes -band [int][IO.FileAttributes]::ReadOnly) -eq 0)
    $restore = Join-Path $Sandbox 'readonly-restore.txt'
    $null = Copy-VerifiedFile $old $restore $oldHash
    $null = Replace-VerifiedFile $restore $target $newHash $oldHash
    (Get-Item -LiteralPath $target).Attributes = [IO.FileAttributes]$attributes
    Need (((Get-FileRecord $target $oldHash).Attributes -band [int][IO.FileAttributes]::ReadOnly) -ne 0)
}
Check 'actual-original-process-exit-and-no-argument-capture' {
    $fixture = Join-Path $Sandbox 'exit7.ps1'
    [IO.File]::WriteAllText($fixture, 'Start-Sleep -Milliseconds 100; exit 7')
    $p = Start-Process -FilePath $Pwsh -ArgumentList @('-NoLogo','-NoProfile','-NonInteractive','-File',('"' + $fixture + '"')) -PassThru
    $observed = Observe-ProcessHandle $p 10000
    Need ($observed.Exited -and $observed.ExitCode -eq 7 -and -not $observed.RunningAtLimit)
    Need ($observed.ElapsedMs -lt 10000 -and $observed.ForcedTermination -eq $false)
    Need ($observed.ChildLifecycle -ceq 'not-tracked')
    Need ($null -eq $observed.PSObject.Properties['Arguments'])
    $p.Dispose()
}
Check 'actual-original-process-timeout-keeps-it-running' {
    $fixture = Join-Path $Sandbox 'short-sleep.ps1'
    [IO.File]::WriteAllText($fixture, 'Start-Sleep -Milliseconds 500; exit 0')
    $p = Start-Process -FilePath $Pwsh -ArgumentList @('-NoLogo','-NoProfile','-NonInteractive','-File',('"' + $fixture + '"')) -PassThru
    $observed = Observe-ProcessHandle $p 25
    Need (-not $observed.Exited -and $observed.RunningAtLimit -and -not $p.HasExited)
    Need ($null -eq $observed.ExitCode -and $observed.ElapsedMs -ge 25)
    Need ($p.WaitForExit(10000))
    $p.Dispose()
}
Check 'main-script-refuses-mac-before-windows-access' {
    $output = & $Pwsh -NoLogo -NoProfile -NonInteractive -File $source -Mode Verify
    Need ($LASTEXITCODE -eq 1)
    $status = $output | ConvertFrom-Json
    Need ($status.ControlledCode -ceq 'MOLI_WINDOWS_REQUIRED' -and $status.Status -ceq 'stopped')
}
[pscustomobject]@{Schema='moli.stage89.original-host-tests.v1'; Passed=$script:passed.Count; Cases=$script:passed; ParserErrors=$errors.Count;
    HostPowerShell=$PSVersionTable.PSVersion.ToString(); WindowsValidated=$false; VendorProgramExecuted=$false; NoForcedTermination=$true} | ConvertTo-Json -Depth 5
