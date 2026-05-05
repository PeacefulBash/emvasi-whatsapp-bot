@echo off
title Emvasi Bot
echo Emvasi Bot Watchdog
echo.
:loop
echo [%date% %time%] Starting...
node src/clean-bot.js
echo [%date% %time%] Restarting in 5 seconds...
timeout /t 5 /nobreak >nul
goto loop
