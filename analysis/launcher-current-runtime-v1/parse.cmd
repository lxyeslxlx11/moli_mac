@echo off
setlocal EnableExtensions DisableDelayedExpansion
"%SystemRoot%\System32\WindowsPowerShell\v1.0\powershell.exe" -NoLogo -NoProfile -Command "$t=$null;$e=$null;$null=[Management.Automation.Language.Parser]::ParseFile('%~dp0current.ps1',[ref]$t,[ref]$e);if($e.Count){Write-Output 'MOLI_PARSE_FAILED';exit 1};Write-Output 'MOLI_PARSE_OK';Get-FileHash -LiteralPath '%~dp0current.ps1','%~dp0CURRENT.EXE' | Select-Object Path,Hash | Format-List"
set "MOLI_CURRENT_PARSE_EXIT89=%ERRORLEVEL%"
exit /b %MOLI_CURRENT_PARSE_EXIT89%
