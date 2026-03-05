@echo off
setlocal

echo Starting backend and frontend servers...
start "Portfolio Backend" cmd /k "cd /d "%~dp0backend" && php artisan serve --host=127.0.0.1 --port=8000"
start "Portfolio Frontend" cmd /k "cd /d "%~dp0frontend" && python -m http.server 8080"

echo Backend  : http://127.0.0.1:8000
echo Frontend : http://127.0.0.1:8080
echo.
echo Use admin login: admin@portfolio.local / Admin!2026Strong

endlocal
