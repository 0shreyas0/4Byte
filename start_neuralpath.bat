@echo off
setlocal

echo Starting NeuralPath AI Ecosystem...

set "ROOT_DIR=%~dp0"
if "%ROOT_DIR:~-1%"=="\" set "ROOT_DIR=%ROOT_DIR:~0,-1%"

echo Starting Ollama (llama3)...
start "Ollama - llama3" cmd /k "ollama run llama3"

echo Starting Mentor Backend (uvicorn) on Port 8000...
start "NeuralPath Backend" cmd /k "cd /d "%ROOT_DIR%\RAG" && python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload"

echo Starting Frontend (next dev) on Port 3000...
start "NeuralPath Frontend" cmd /k "cd /d "%ROOT_DIR%\web" && npm run dev"

echo All processes are launching in separate windows.
echo Backend:  http://localhost:8000
echo Frontend: http://localhost:3000
echo ADMIN DASHBOARD: http://localhost:3000/admin
echo --------------------------------------------------------
echo Enjoy your tutoring session!

endlocal
