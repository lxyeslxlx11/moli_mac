@echo off
setlocal EnableExtensions DisableDelayedExpansion
"%SystemRoot%\System32\WindowsPowerShell\v1.0\powershell.exe" -NoLogo -NoProfile -File "%~dp0current.ps1" -Mode Verify
set "MOLI_CURRENT_EXIT89=%ERRORLEVEL%"
echo MOLI_CURRENT_VERIFY_EXIT=%MOLI_CURRENT_EXIT89%
exit /b %MOLI_CURRENT_EXIT89%
