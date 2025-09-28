#!/usr/bin/env python3

import asyncio
import json
import os
import re
import subprocess
import sys
from pathlib import Path
from typing import Dict, List, Optional

import psutil
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel

# Constants
APP_NAME = "ThinkFan UI"
APP_VERSION = "2.0.0"
PROC_FAN = "/proc/acpi/ibm/fan"

# Pydantic models
class FanControlRequest(BaseModel):
    speed: str  # "auto", "full-speed", or "0"-"7"

class SystemInfo(BaseModel):
    temperatures: Dict[str, str]
    fan_info: Dict[str, str]
    system_stats: Dict[str, str]

class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def broadcast(self, message: str):
        for connection in self.active_connections:
            try:
                await connection.send_text(message)
            except:
                # Remove dead connections
                self.active_connections.remove(connection)

# Initialize FastAPI app
app = FastAPI(title=APP_NAME, version=APP_VERSION)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# WebSocket connection manager
manager = ConnectionManager()

class ThinkFanController:
    """Core controller for ThinkPad fan management"""
    
    @staticmethod
    def get_temperature_info() -> Dict[str, str]:
        """Get CPU and system temperature information"""
        temps = {}
        
        try:
            # Try to get ThinkPad specific sensors first
            proc = subprocess.Popen(
                ["sensors", "thinkpad-isa-0000"], 
                stdout=subprocess.PIPE, 
                stderr=subprocess.PIPE
            )
            sOut, sErr = proc.communicate(timeout=2)
            
            if not sErr:
                lines = sOut.decode().strip().split("\n")
                temp_re = re.compile(r"^(.*?):\s*\+?([^ ]+°C)")
                
                for line in lines:
                    match = temp_re.match(line)
                    if match:
                        label, value = match.groups()
                        clean_label = label.strip()
                        temps[clean_label] = value.strip()
        except (subprocess.TimeoutExpired, FileNotFoundError):
            pass
        
        # Fallback to general sensors if ThinkPad specific failed
        if not temps:
            try:
                proc = subprocess.Popen(
                    ["sensors"], 
                    stdout=subprocess.PIPE, 
                    stderr=subprocess.PIPE
                )
                sOut, sErr = proc.communicate(timeout=2)
                
                if not sErr:
                    lines = sOut.decode().strip().split("\n")
                    temp_re = re.compile(r"^(.*?):\s*\+?([^ ]+°C)")
                    
                    for line in lines:
                        match = temp_re.match(line)
                        if match:
                            label, value = match.groups()
                            # Filter for relevant temperature sensors
                            if any(keyword in label.lower() for keyword in ["cpu", "core", "temp", "die"]):
                                clean_label = label.strip()
                                temps[clean_label] = value.strip()
            except (subprocess.TimeoutExpired, FileNotFoundError):
                temps["Error"] = "sensors command not available"
        
        # Add CPU usage and load average
        try:
            cpu_percent = psutil.cpu_percent(interval=0.1)
            temps["CPU Usage"] = f"{cpu_percent:.1f}%"
            
            load_avg = os.getloadavg()
            temps["Load Average"] = f"{load_avg[0]:.2f}"
        except:
            pass
            
        return temps
    
    @staticmethod
    def get_fan_info() -> Dict[str, str]:
        """Get fan speed and status information"""
        fan_data = {}
        
        # Get status and level from /proc/acpi/ibm/fan
        try:
            with open(PROC_FAN, "r") as f:
                for line in f:
                    if ":" in line:
                        key, value = line.split(":", 1)
                        key = key.strip()
                        if key in ["status", "level"]:
                            fan_data[key] = value.strip()
                        elif key == "speed":
                            fan_data["Fan1"] = f"{value.strip()} RPM"
        except FileNotFoundError:
            fan_data["Error"] = f"{PROC_FAN} not found"
        except Exception as e:
            fan_data["Error"] = str(e)
        
        # Get additional fan info from sensors
        try:
            proc = subprocess.Popen(
                ["sensors", "thinkpad-isa-0000"], 
                stdout=subprocess.PIPE, 
                stderr=subprocess.PIPE
            )
            sOut, sErr = proc.communicate(timeout=2)
            
            if not sErr:
                lines = sOut.decode().strip().split("\n")
                fan_re = re.compile(r"^(fan\d+.*?):\s*(\d+\s*RPM)")
                
                for line in lines:
                    match = fan_re.match(line)
                    if match:
                        label, value = match.groups()
                        fan_data[label.strip()] = value.strip()
        except (subprocess.TimeoutExpired, FileNotFoundError):
            pass
        
        return fan_data
    
    @staticmethod
    def set_fan_speed(speed: str) -> bool:
        """Set fan speed"""
        try:
            with open(PROC_FAN, "w") as f:
                f.write(f"level {speed}")
            return True
        except PermissionError:
            # Try to update permissions
            try:
                subprocess.run(["pkexec", "chmod", "666", PROC_FAN], check=True)
                with open(PROC_FAN, "w") as f:
                    f.write(f"level {speed}")
                return True
            except:
                return False
        except Exception:
            return False
    
    @staticmethod
    def check_permissions() -> bool:
        """Check if we have write permissions to fan control"""
        if not os.path.isfile(PROC_FAN):
            return False
        return os.access(PROC_FAN, os.W_OK)

# Initialize controller
controller = ThinkFanController()

@app.get("/")
async def read_root():
    """Serve the main application"""
    frontend_path = Path(__file__).parent.parent / "frontend" / "dist" / "index.html"
    if frontend_path.exists():
        return FileResponse(frontend_path)
    return {"message": "ThinkFan UI Backend", "version": APP_VERSION}

@app.get("/api/system-info")
async def get_system_info() -> SystemInfo:
    """Get current system information"""
    return SystemInfo(
        temperatures=controller.get_temperature_info(),
        fan_info=controller.get_fan_info(),
        system_stats={
            "permissions": str(controller.check_permissions()),
            "proc_fan_exists": str(os.path.exists(PROC_FAN))
        }
    )

@app.post("/api/fan-control")
async def set_fan_control(request: FanControlRequest):
    """Set fan speed"""
    success = controller.set_fan_speed(request.speed)
    if not success:
        raise HTTPException(status_code=500, detail="Failed to set fan speed")
    
    # Broadcast update to all connected clients
    system_info = SystemInfo(
        temperatures=controller.get_temperature_info(),
        fan_info=controller.get_fan_info(),
        system_stats={
            "permissions": str(controller.check_permissions()),
            "proc_fan_exists": str(os.path.exists(PROC_FAN))
        }
    )
    await manager.broadcast(system_info.model_dump_json())
    
    return {"success": True, "speed": request.speed}

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    """WebSocket endpoint for real-time updates"""
    await manager.connect(websocket)
    try:
        while True:
            # Send system info every second
            system_info = SystemInfo(
                temperatures=controller.get_temperature_info(),
                fan_info=controller.get_fan_info(),
                system_stats={
                    "permissions": str(controller.check_permissions()),
                    "proc_fan_exists": str(os.path.exists(PROC_FAN))
                }
            )
            await websocket.send_text(system_info.model_dump_json())
            await asyncio.sleep(1)
    except WebSocketDisconnect:
        manager.disconnect(websocket)

# Serve static files from frontend build
frontend_dist = Path(__file__).parent.parent / "frontend" / "dist"
if frontend_dist.exists():
    app.mount("/", StaticFiles(directory=str(frontend_dist), html=True), name="static")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app", 
        host="0.0.0.0", 
        port=12000, 
        reload=True,
        log_level="info"
    )