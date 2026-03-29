#!/bin/bash

# NeuralPath: The "Launch All" Script for Mac (ZSH)
# 🚀 🚀 🚀 🚀 🚀 🚀 🚀 🚀 🚀 🚀 🚀 🚀 🚀 🚀 🚀 🚀 🚀 🚀

echo "🚀 Starting NeuralPath AI Ecosystem..."

# 1. Start Ollama in a new tab (if it's not already running)
echo "🧠 Starting Ollama (Llama-3)..."
osascript -e 'tell application "Terminal" to do script "ollama run llama3"'

# 2. Start FastAPI Backend in a new tab
echo "🧠 Starting Mentor Backend (uvicorn)..."
osascript -e 'tell application "Terminal" to do script "cd '"$(pwd)"'/RAG && python3 -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload"'

# 3. Start Next.js Frontend in a new tab
echo "🎨 Starting Frontend (next dev)..."
osascript -e 'tell application "Terminal" to do script "cd '"$(pwd)"'/web && npm run dev"'

echo "✅ All processes are launching in separate windows!"
echo "📍 Backend: http://localhost:8000"
echo "📍 Frontend: http://localhost:3000"
echo "📍 AI Model: Llama-3 (Ollama)"
echo "--------------------------------------------------------"
echo "Enjoy your tutoring session! 🧠✨"
