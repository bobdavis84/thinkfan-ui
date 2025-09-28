# ThinkFan UI Installation Guide for UV Users

This guide is specifically for users who prefer to use `uv` for Python package management on CachyOS/Arch Linux systems.

## Quick Installation

The installation script has been updated to automatically detect and use `uv` for Python package management:

```bash
# Clone the repository
git clone -b modern-web-ui-react-fastapi https://github.com/bobdavis84/thinkfan-ui.git
cd thinkfan-ui

# Run the installation script
chmod +x install.sh
./install.sh
```

## What the Script Does

1. **Installs system dependencies** via pacman:
   - `python` - Python interpreter
   - `nodejs npm` - Node.js and npm for frontend
   - `lm_sensors` - Hardware monitoring
   - `polkit` - Permission management

2. **Installs uv** if not already available:
   - First tries to install via `pipx` if available
   - Falls back to installing `python-pipx` then `uv`
   - Provides manual installation instructions if automatic installation fails

3. **Creates virtual environment** using uv:
   - Creates `.venv` in `/opt/thinkfan-ui/`
   - Installs Python dependencies: `fastapi`, `uvicorn`, `websockets`, `pydantic`, `psutil`, `aiofiles`, `python-multipart`

4. **Sets up application**:
   - Copies all application files to `/opt/thinkfan-ui/`
   - Creates desktop entry and command-line shortcuts
   - Configures ThinkPad ACPI module for fan control

## Launch Options

After installation, you can start the application using any of these methods:

### Command Line
```bash
# Primary launcher (uses virtual environment)
thinkfan-ui-modern

# Python script launcher
thinkfan-ui-modern-py

# Direct shell script
/opt/thinkfan-ui/start.sh
```

### Desktop
- Launch from applications menu: "ThinkFan UI Modern"

## Manual Installation (Advanced Users)

If you prefer to install manually with uv:

```bash
# 1. Install system dependencies
sudo pacman -S --needed python nodejs npm lm_sensors polkit

# 2. Ensure uv is installed
# If not installed: curl -LsSf https://astral.sh/uv/install.sh | sh

# 3. Create application directory
sudo mkdir -p /opt/thinkfan-ui
sudo chown $USER:$USER /opt/thinkfan-ui

# 4. Copy application files
cp -r backend frontend/dist start.py start.sh /opt/thinkfan-ui/

# 5. Create virtual environment and install dependencies
cd /opt/thinkfan-ui
uv venv .venv
source .venv/bin/activate
uv pip install fastapi uvicorn websockets pydantic psutil aiofiles python-multipart

# 6. Make scripts executable
chmod +x start.py start.sh

# 7. Create command-line shortcuts
sudo ln -sf /opt/thinkfan-ui/start.sh /usr/local/bin/thinkfan-ui-modern

# 8. Configure ThinkPad ACPI (if needed)
echo "options thinkpad_acpi fan_control=1" | sudo tee /etc/modprobe.d/thinkpad_acpi.conf

# 9. Reboot to load kernel module
sudo reboot
```

## Troubleshooting

### UV Not Found
If the script can't find `uv`, install it manually:
```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
source ~/.bashrc  # or restart terminal
```

### Virtual Environment Issues
If you encounter virtual environment problems:
```bash
cd /opt/thinkfan-ui
rm -rf .venv
uv venv .venv
source .venv/bin/activate
uv pip install fastapi uvicorn websockets pydantic psutil aiofiles python-multipart
```

### Permission Issues
If you get permission errors:
```bash
sudo chown -R $USER:$USER /opt/thinkfan-ui
```

### Dependencies Not Found
If the application can't find dependencies:
```bash
cd /opt/thinkfan-ui
source .venv/bin/activate
uv pip list  # Check installed packages
uv pip install --upgrade fastapi uvicorn websockets pydantic psutil aiofiles python-multipart
```

## Verification

After installation, verify everything works:

```bash
# Check if uv is available
uv --version

# Check virtual environment
ls -la /opt/thinkfan-ui/.venv/

# Test the application
thinkfan-ui-modern
# Should start the web server at http://localhost:12000
```

## Uninstallation

To remove the application:

```bash
# Remove application files
sudo rm -rf /opt/thinkfan-ui

# Remove desktop entry
sudo rm /usr/share/applications/thinkfan-ui-modern.desktop

# Remove command-line shortcuts
sudo rm /usr/local/bin/thinkfan-ui-modern
sudo rm /usr/local/bin/thinkfan-ui-modern-py

# Remove icon
sudo rm /usr/share/icons/hicolor/scalable/apps/thinkfan-ui.svg

# Update icon cache
sudo gtk-update-icon-cache -f -t /usr/share/icons/hicolor/
```

## Benefits of UV

Using `uv` provides several advantages:

- **Fast**: Much faster than pip for package installation and resolution
- **Reliable**: Better dependency resolution and conflict detection
- **Modern**: Built with Rust, following modern Python packaging standards
- **Compatible**: Works with existing pip workflows and requirements.txt files
- **Isolated**: Proper virtual environment management

The ThinkFan UI installation script is designed to work seamlessly with `uv` while maintaining compatibility with traditional Python package management approaches.