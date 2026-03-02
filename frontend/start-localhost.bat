@echo off
set PORT=8080
echo Menjalankan server frontend di http://localhost:%PORT%/
python -m http.server %PORT%
