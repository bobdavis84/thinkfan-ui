# ThinkFan UI Modern v2.0.0

A modern, beautiful web-based fan control application for ThinkPad laptops, built with React, TypeScript, and FastAPI. This is a complete rewrite of the original PyQt6 application with a focus on modern design, real-time monitoring, and cross-platform compatibility.

![ThinkFan UI Modern](screenshot.png)

## ✨ Features

### 🎨 Modern Design
- **Beautiful Web Interface**: Clean, modern design with smooth animations
- **Dark/Light Theme**: Automatic theme detection with manual toggle
- **Responsive Layout**: Works perfectly on desktop, tablet, and mobile
- **Real-time Updates**: Live temperature and fan speed monitoring via WebSocket

### 🔧 Fan Control
- **Automatic Mode**: Intelligent fan control based on temperature
- **Manual Levels**: 8 discrete fan speed levels (0-7)
- **Full Speed Mode**: Maximum cooling for intensive tasks
- **Safety Features**: Warnings for manual control and fan disable

### 📊 Monitoring
- **Temperature Sensors**: Real-time CPU and system temperature monitoring
- **Fan Information**: Current speed, status, and level display
- **System Status**: Connection status, permissions, and troubleshooting info
- **Visual Indicators**: Color-coded temperature and fan speed displays

### 🚀 Technical Features
- **Web-based**: No desktop dependencies, runs in any modern browser
- **FastAPI Backend**: High-performance Python backend with async support
- **WebSocket Communication**: Real-time bidirectional communication
- **TypeScript Frontend**: Type-safe React application with modern tooling
- **Tailwind CSS**: Utility-first CSS framework for consistent styling

## 🛠️ Installation

### Quick Install (CachyOS/Arch Linux)

```bash
# Clone the repository
git clone https://github.com/bobdavis84/thinkfan-ui.git
cd thinkfan-ui

# Run the installation script
chmod +x install.sh
./install.sh

# Reboot to load kernel module
sudo reboot

# After reboot, launch the application
thinkfan-ui-modern
```

### Manual Installation

#### Prerequisites
- Python 3.8+
- Node.js 16+ (for building frontend)
- ThinkPad laptop with thinkpad_acpi module support

#### Backend Setup
```bash
cd backend
pip install -r requirements.txt
```

#### Frontend Setup
```bash
cd frontend
npm install
npm run build
```

#### System Configuration
```bash
# Enable fan control in thinkpad_acpi module
echo "options thinkpad_acpi fan_control=1" | sudo tee /etc/modprobe.d/thinkpad_acpi.conf

# Reboot or reload the module
sudo modprobe -r thinkpad_acpi
sudo modprobe thinkpad_acpi
```

## 🚀 Usage

### Starting the Application

#### Option 1: Using the startup script
```bash
python3 start.py
```

#### Option 2: Direct backend start
```bash
cd backend
uvicorn main:app --host 0.0.0.0 --port 12000
```

### Accessing the Interface

Open your web browser and navigate to:
- **Local**: http://localhost:12000
- **Network**: http://your-ip:12000

### Fan Control Modes

1. **Auto Mode** (Recommended): Automatic fan control based on temperature
2. **Manual Levels**: Choose from 8 discrete levels (0-7)
   - Level 0: Fan disabled (use with caution)
   - Levels 1-7: Increasing fan speeds
3. **Full Speed**: Maximum fan speed for intensive cooling

## 🏗️ Architecture

### Backend (FastAPI)
- **main.py**: FastAPI application with REST API and WebSocket endpoints
- **System Integration**: Direct interface with `/proc/acpi/ibm/fan` and sensors
- **Real-time Monitoring**: Continuous temperature and fan monitoring
- **CORS Support**: Configured for web frontend communication

### Frontend (React + TypeScript)
- **Modern React**: Functional components with hooks
- **TypeScript**: Full type safety and better development experience
- **Tailwind CSS**: Utility-first styling with custom design system
- **Responsive Design**: Mobile-first approach with desktop optimization
- **Real-time Updates**: WebSocket client for live data

### Communication
- **REST API**: Fan control commands and system information
- **WebSocket**: Real-time temperature and fan status updates
- **Error Handling**: Comprehensive error handling and user feedback

## 🔧 Development

### Frontend Development
```bash
cd frontend
npm run dev  # Start development server
npm run build  # Build for production
npm run preview  # Preview production build
```

### Backend Development
```bash
cd backend
uvicorn main:app --reload --host 0.0.0.0 --port 12000
```

### Building for Production
```bash
# Build frontend
cd frontend && npm run build

# The built files will be in frontend/dist/
# The backend serves these files automatically
```

## 📦 Packaging

### Arch Linux Package
```bash
# Create package
makepkg -si

# Install from AUR (when available)
yay -S thinkfan-ui-modern
```

### Manual Packaging
```bash
# Create distribution archive
tar -czf thinkfan-ui-modern-2.0.0.tar.gz \
  backend/ frontend/dist/ start.py \
  thinkfan-ui-modern.desktop \
  linux_packaging/ README-MODERN.md LICENSE
```

## 🔍 Troubleshooting

### Fan Control Not Working
1. **Check ThinkPad Support**: Ensure you have a supported ThinkPad model
2. **Verify Module**: Check if `/proc/acpi/ibm/fan` exists
3. **Module Configuration**: Ensure `fan_control=1` is set in module options
4. **Permissions**: Run with appropriate permissions if needed

### Connection Issues
1. **Port Conflicts**: Ensure port 12000 is available
2. **Firewall**: Check firewall settings for local connections
3. **Browser**: Try a different browser or clear cache

### Performance Issues
1. **System Resources**: Check CPU and memory usage
2. **WebSocket**: Verify WebSocket connection in browser dev tools
3. **Backend Logs**: Check backend logs for errors

## 🆚 Comparison with Original

| Feature | Original (PyQt6) | Modern (Web) |
|---------|------------------|--------------|
| **Interface** | Desktop GUI | Web-based |
| **Design** | Basic Qt styling | Modern, responsive |
| **Real-time Updates** | Polling | WebSocket |
| **Cross-platform** | Linux only | Any OS with browser |
| **Mobile Support** | No | Yes |
| **Theme Support** | Limited | Dark/Light with auto-detection |
| **Dependencies** | PyQt6, Qt libraries | Python + Web browser |
| **Development** | Qt Designer | Modern web stack |
| **Deployment** | Desktop app | Web application |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices for frontend
- Use Python type hints for backend
- Maintain responsive design principles
- Test on multiple browsers and screen sizes
- Update documentation for new features

## 📄 License

This project is licensed under the GNU General Public License v3.0 - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Original ThinkFan UI by bobdavis84
- ThinkPad ACPI module developers
- React, FastAPI, and Tailwind CSS communities
- All contributors and testers

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/bobdavis84/thinkfan-ui/issues)
- **Discussions**: [GitHub Discussions](https://github.com/bobdavis84/thinkfan-ui/discussions)
- **Wiki**: [Project Wiki](https://github.com/bobdavis84/thinkfan-ui/wiki)

---

**Made with ❤️ for the ThinkPad community**