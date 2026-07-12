#!/usr/bin/env bash
set -e

cd "$(dirname "$0")"

# Backend
if [ ! -d "backend/venv" ]; then
  echo "→ Creating backend venv..."
  cd backend
  python3.13 -m venv venv
  source venv/bin/activate
  pip install -r requirements.txt
  cd ..
fi

# Frontend
if [ ! -d "frontend/node_modules" ]; then
  echo "→ Installing frontend deps..."
  cd frontend
  npm install --legacy-peer-deps
  cd ..
fi

echo "→ Starting backend..."
cd backend
source venv/bin/activate
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000 &
BACKEND_PID=$!
cd ..

echo "→ Starting frontend..."
cd frontend
npm run dev &
FRONTEND_PID=$!

trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null" EXIT
echo "✓ Running:"
echo "   Backend → http://localhost:8000/docs"
echo "   Frontend → http://localhost:5173"
wait
