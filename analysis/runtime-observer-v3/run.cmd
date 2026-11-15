@echo off
setlocal EnableExtensions DisableDelayedExpansion
"C:\Program Files (x86)\Windows Kits\10\Debuggers\arm64\cdb.exe" -nosqm -noshell -sins -G -y "%~dp0." -cf "%~dp0fixture-return-sites.cdb" "%~dp0moli-diagnostic-fixture.exe"
set "MOLI_CDB_EXIT83=%ERRORLEVEL%"
echo MOLI_CDB_EXIT83=%MOLI_CDB_EXIT83%
exit /b %MOLI_CDB_EXIT83%
