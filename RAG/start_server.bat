@echo off
setlocal

:: Move to the RAG directory
cd /d "%~dp0"

echo [1/3] Checking dependencies...
pip install -r requirements.txt

if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Failed to install dependencies. Make sure Python is in your PATH.
    pause
    exit /b %ERRORLEVEL%
)

echo [2/3] Starting RAG Server (ChromaDB + FastAPI)...
echo NOTE: On first run, it will download the 100MB AI model from HuggingFace.
echo If it stays at 0%% for a long time, check your internet connection.

:: Set environment variables if needed (optional since there is a .env file)
:: The app/main.py uses uvicorn to serve the API
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload

if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Server failed to start.
    pause
    exit /b %ERRORLEVEL%
)

endlocal
pause
