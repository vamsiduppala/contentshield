@echo off
cd /d "%~dp0"
start "ContentShield AI Frontend" cmd /k start-frontend-real.bat
start "ContentShield AI Auth API" cmd /k start-auth-real.bat
start "ContentShield AI Backend" cmd /k start-backend-real.bat
echo Frontend: http://127.0.0.1:4173
echo Auth API: http://127.0.0.1:4000/api/v1/health
echo Backend:  http://127.0.0.1:4000/api/v1/health
echo Swagger:  http://127.0.0.1:4000/docs
