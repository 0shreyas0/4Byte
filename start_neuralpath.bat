@echo off
setlocal

echo Starting NeuralPath AI Ecosystem...

set "ROOT_DIR=%~dp0"
if "%ROOT_DIR:~-1%"=="\" set "ROOT_DIR=%ROOT_DIR:~0,-1%"

echo Starting Ollama (llama3)...
start "Ollama - llama3" cmd /k "ollama run llama3"

echo Starting Mentor Backend (uvicorn)...
start "NeuralPath Backend" cmd /k "cd /d "%ROOT_DIR%\RAG" && python -m uvicorn app.main:app --reload"

echo Starting Frontend (next dev)...
start "NeuralPath Frontend" cmd /k "cd /d "%ROOT_DIR%\web" && npm run dev"

echo All processes are launching in separate windows.
echo Backend:  http://localhost:8000
echo Frontend: http://localhost:3000
echo AI Model: llama3 (Ollama)
echo --------------------------------------------------------
echo Enjoy your tutoring session!

endlocal
