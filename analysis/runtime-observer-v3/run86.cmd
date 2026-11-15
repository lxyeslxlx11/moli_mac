@echo off
setlocal EnableExtensions DisableDelayedExpansion
powershell.exe -NoLogo -NoProfile -NonInteractive -Command "$ErrorActionPreference='Stop'; $p='C:\Program Files (x86)\Windows Kits\10\Debuggers\x86\cdb.exe'; $h=(Get-FileHash -LiteralPath $p -Algorithm SHA256).Hash; $s=(Get-AuthenticodeSignature -LiteralPath $p).Status; Write-Output ('MOLI_X86_HASH='+$h); Write-Output ('MOLI_X86_SIGNATURE='+$s); if($h -ne '6ca9dd8ee2d764087c4a561ecfee05cdf17751dfd9c2f21700211a897cd68129' -or $s -ne 'Valid'){exit 1}; $f=(Get-FileHash -LiteralPath '%~dp0moli-diagnostic-fixture.exe' -Algorithm SHA256).Hash; Write-Output ('MOLI_FIXTURE_HASH='+$f); if($f -ne '01588841278dcb7360c91333f0f7c5ec81aec84625ca274be54ad9011aaf10eb'){exit 1}"
if errorlevel 1 exit /b 1
"C:\Program Files (x86)\Windows Kits\10\Debuggers\x86\cdb.exe" -version
if errorlevel 1 exit /b 1
"C:\Program Files (x86)\Windows Kits\10\Debuggers\x86\cdb.exe" -nosqm -noshell -sins -G -y "%~dp0." -cf "%~dp0fixture-return-sites-x86.cdb" "%~dp0moli-diagnostic-fixture.exe"
set "MOLI_CDB_X86_EXIT83=%ERRORLEVEL%"
echo MOLI_CDB_X86_EXIT83=%MOLI_CDB_X86_EXIT83%
exit /b %MOLI_CDB_X86_EXIT83%
