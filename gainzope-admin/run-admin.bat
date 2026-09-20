@echo off
title GAINZOPE Admin Console
echo Starting GAINZOPE Admin Console on http://localhost:5174...
start "" "http://localhost:5174"
npx -y serve . -p 5174
pause
