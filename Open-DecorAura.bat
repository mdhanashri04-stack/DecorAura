@echo off
title DecorAura Launcher
echo ===================================================
echo             DecorAura One-Click Launcher          
echo ===================================================
echo Launching DecorAura services...
echo Please wait...
echo.

powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0start-dev.ps1"

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo An error occurred while starting DecorAura.
    pause
)
