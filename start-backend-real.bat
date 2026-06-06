@echo off
cd /d "%~dp0backend"
set "PATH=C:\Users\vamsi\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin;%PATH%"

:: Load variables from .env if it exists, without quotes
if exist .env (
    for /f "usebackq tokens=1,* delims==" %%A in (".env") do (
        set "%%A=%%B"
    )
)

:: Ensure critical variables are set
set "MOCK_AI_MODE=false"
set "PORT=4000"

node dist\src\main.js
