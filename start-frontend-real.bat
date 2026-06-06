@echo off
cd /d "%~dp0"
set "PATH=C:\Users\vamsi\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin;%PATH%"
.\node_modules\.bin\vite.CMD preview --config vite.config.mjs --configLoader native --host 127.0.0.1 --port 4173 --strictPort
