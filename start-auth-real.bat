@echo off
cd /d "%~dp0"
set "PATH=C:\Users\vamsi\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin;%PATH%"
node scripts\local-auth-api.mjs
