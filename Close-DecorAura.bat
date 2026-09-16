@echo off
title DecorAura Shutdown
echo ===================================================
echo             DecorAura Shutdown Script            
echo ===================================================
echo Stopping DecorAura background servers...
echo.

powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0stop-dev.ps1"

timeout /t 3 >nul
