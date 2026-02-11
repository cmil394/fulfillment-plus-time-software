@echo off

REM Save the script's directory
set SCRIPT_DIR=%~dp0

REM Change to the script's directory
cd /d "%SCRIPT_DIR%"

REM Start backend and frontend in separate windows silently
start "Backend Server" cmd /k "cd /d "%SCRIPT_DIR%backend" && npm run dev"
start "Frontend Server" cmd /k "cd /d "%SCRIPT_DIR%frontend" && npm run dev"

REM Exit immediately without waiting or showing messages
exit