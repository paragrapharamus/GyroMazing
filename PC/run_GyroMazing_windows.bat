@echo off
title Unsafe Chrome Session
echo Launching unsafe session of Google Chrome...
start chrome.exe --user-data-dir="C:/Chrome dev session" --disable-web-security C:\Users\Andrei\Desktop\Extension\gyro_mazing\index.html
exit