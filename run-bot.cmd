@echo off
title Emvasi Bot Watchdog
echo ========================================
echo    Emvasi Alumni Club Bot - Watchdog
echo ========================================
echo.
echo Bot will auto-restart if it crashes.
echo.
:loop
echo [%date% %time%] Starting Emvasi Bot...
node src/enhanced-bot.js
echo.
echo [%date% %time%] Bot stopped. Restarting in 5 seconds...
timeout /t 5 /nobreak >nul
goto loop
