#!/bin/bash

# ThinkFan UI Modern Launcher Script
# This script activates the virtual environment and starts the application

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
VENV_DIR="$SCRIPT_DIR/.venv"

echo "🚀 Starting ThinkFan UI v2.0.0"
echo "=========================================="

# Check if virtual environment exists
if [ -d "$VENV_DIR" ]; then
    echo "✅ Activating virtual environment..."
    source "$VENV_DIR/bin/activate"
else
    echo "⚠️ No virtual environment found at $VENV_DIR"
    echo "Please run the installation script first"
    exit 1
fi

# Check if we can import required modules
if ! python -c "import fastapi, uvicorn" 2>/dev/null; then
    echo "❌ Missing Python dependencies"
    echo "Please reinstall with: cd $SCRIPT_DIR && source .venv/bin/activate && uv pip install -r backend/requirements.txt"
    exit 1
fi

echo "✅ Dependencies found"

# Change to backend directory and start the server
cd "$SCRIPT_DIR/backend"

echo ""
echo "🌐 Starting web server..."
echo "📱 Access the application at:"
echo "   • Local: http://localhost:12000"
echo "   • Network: http://0.0.0.0:12000"
echo ""
echo "💡 Press Ctrl+C to stop the server"
echo "=========================================="

# Start the FastAPI server
uvicorn main:app --host 0.0.0.0 --port 12000 --log-level info