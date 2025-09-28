#!/usr/bin/env python3

import os
import sys
import subprocess
import signal
import time
from pathlib import Path

def main():
    """Start the ThinkFan UI application"""
    
    # Get the directory where this script is located
    app_dir = Path(__file__).parent.absolute()
    backend_dir = app_dir / "backend"
    venv_dir = app_dir / ".venv"
    
    print("🚀 Starting ThinkFan UI v2.0.0")
    print("=" * 50)
    
    # Check if we're in the right directory
    if not backend_dir.exists():
        print("❌ Error: Backend directory not found!")
        print(f"Expected: {backend_dir}")
        sys.exit(1)
    
    # Check if virtual environment exists
    if venv_dir.exists():
        # Activate virtual environment by updating Python path
        venv_python = venv_dir / "bin" / "python"
        if venv_python.exists():
            print("✅ Using virtual environment")
            # Re-execute with virtual environment Python
            if sys.executable != str(venv_python):
                os.execv(str(venv_python), [str(venv_python)] + sys.argv)
        else:
            print("⚠️ Virtual environment found but Python executable missing")
    else:
        print("⚠️ No virtual environment found, using system Python")
    
    # Change to backend directory
    os.chdir(backend_dir)
    
    # Check if dependencies are installed
    try:
        import fastapi
        import uvicorn
        print("✅ Backend dependencies found")
    except ImportError as e:
        print(f"❌ Missing backend dependencies: {e}")
        if venv_dir.exists():
            print("Please reinstall with: cd /opt/thinkfan-ui && source .venv/bin/activate && uv pip install -r backend/requirements.txt")
        else:
            print("Please install with: uv pip install -r backend/requirements.txt")
        sys.exit(1)
    
    # Check if frontend is built
    frontend_dist = app_dir / "frontend" / "dist"
    if not frontend_dist.exists():
        print("❌ Frontend not built!")
        print("Please build with: cd frontend && npm run build")
        sys.exit(1)
    
    print("✅ Frontend build found")
    
    # Start the server
    print("\n🌐 Starting web server...")
    print("📱 Access the application at:")
    print("   • Local: http://localhost:12000")
    print("   • Network: http://0.0.0.0:12000")
    print("\n💡 Press Ctrl+C to stop the server")
    print("=" * 50)
    
    try:
        # Import and run the FastAPI app
        import uvicorn
        
        uvicorn.run(
            "main:app",
            host="0.0.0.0",
            port=12000,
            log_level="info",
            access_log=True,
            reload=False
        )
    except KeyboardInterrupt:
        print("\n\n👋 Shutting down ThinkFan UI...")
        print("Thank you for using ThinkFan UI!")
    except Exception as e:
        print(f"\n❌ Error starting server: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()