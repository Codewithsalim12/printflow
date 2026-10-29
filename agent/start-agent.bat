@echo off
title PrintFlow Windows Agent v2.0
cd /d "%~dp0"

echo ===================================================
echo   PrintFlow Windows Print Spooler (Auto-Starter)
echo ===================================================
echo.

where node >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Node.js is not found on this system.
    echo Please install Node.js (v18+) from https://nodejs.org or run:
    echo   winget install OpenJS.NodeJS.LTS
    echo.
    pause
    exit /b 1
)

echo Starting PrintFlow Hardware Agent...
node printflow-agent.mjs
pause
