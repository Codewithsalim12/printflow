@echo off
title Remove PrintFlow Auto-Start
set SHORTCUT_PATH=%APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup\PrintFlow-Agent.lnk

if exist "%SHORTCUT_PATH%" (
    del "%SHORTCUT_PATH%"
    echo [SUCCESS] PrintFlow Agent removed from Windows Auto-Start.
) else (
    echo PrintFlow was not in Auto-Start.
)

pause
