@echo off
title Install PrintFlow Auto-Start on Windows Boot
cd /d "%~dp0"

echo =======================================================
echo   PrintFlow - Auto-Start Setup for Cyber Cafe PC
echo =======================================================
echo.
echo Setting up silent background launch every time Windows starts...

set SCRIPT_DIR=%~dp0
set VBS_TARGET=%SCRIPT_DIR%run-silent.vbs
set SHORTCUT_PATH=%APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup\PrintFlow-Agent.lnk

powershell -NoProfile -Command "$ws = New-Object -ComObject WScript.Shell; $s = $ws.CreateShortcut('%SHORTCUT_PATH%'); $s.TargetPath = 'wscript.exe'; $s.Arguments = '\"%VBS_TARGET%\"'; $s.WorkingDirectory = '%SCRIPT_DIR%'; $s.Save()"

if %ERRORLEVEL% equ 0 (
    echo.
    echo [SUCCESS] PrintFlow Agent will now start automatically whenever this PC turns on!
    echo Zero manual clicks needed by shopkeeper in the morning.
) else (
    echo [ERROR] Failed to create startup shortcut.
)

echo.
pause
