#!/bin/bash

# ThinkFan UI Modern Installation Script for CachyOS/Arch Linux
# This script installs the modern web-based ThinkFan UI

set -e

echo "🚀 ThinkFan UI Modern Installation Script"
echo "=========================================="

# Check if running as root
if [[ $EUID -eq 0 ]]; then
   echo "❌ This script should not be run as root"
   echo "Please run as a regular user with sudo privileges"
   exit 1
fi

# Check if we're on Arch-based system
if ! command -v pacman &> /dev/null; then
    echo "❌ This script is designed for Arch Linux and derivatives (like CachyOS)"
    echo "Please install manually or adapt for your distribution"
    exit 1
fi

echo "✅ Detected Arch-based system"

# Store the original directory path
ORIGINAL_DIR="$(pwd)"

# Install system dependencies
echo "📦 Installing system dependencies..."
sudo pacman -S --needed python nodejs npm lm_sensors polkit

# Check if uv is available, if not install it
if ! command -v uv &> /dev/null; then
    echo "📦 Installing uv (Python package manager)..."
    if command -v pipx &> /dev/null; then
        pipx install uv
    else
        # Install pipx first, then uv
        sudo pacman -S --needed python-pipx
        pipx install uv
    fi
    # Add pipx bin to PATH for current session
    export PATH="$HOME/.local/bin:$PATH"
    # Verify uv is now available
    if ! command -v uv &> /dev/null; then
        echo "❌ Failed to install uv. Please install manually:"
        echo "   curl -LsSf https://astral.sh/uv/install.sh | sh"
        exit 1
    fi
else
    echo "✅ uv is already installed"
fi

# Create application directory
echo "📁 Creating application directory..."
sudo mkdir -p /opt/thinkfan-ui
sudo chown $USER:$USER /opt/thinkfan-ui

# Copy application files
echo "📋 Copying application files..."
cp -r "$ORIGINAL_DIR/backend" /opt/thinkfan-ui/
cp -r "$ORIGINAL_DIR/frontend/dist" /opt/thinkfan-ui/frontend/
cp "$ORIGINAL_DIR/start.py" /opt/thinkfan-ui/
cp "$ORIGINAL_DIR/start.sh" /opt/thinkfan-ui/

# Create virtual environment and install Python dependencies using uv
echo "🐍 Creating virtual environment and installing Python dependencies with uv..."
cd /opt/thinkfan-ui
uv venv .venv
source .venv/bin/activate
uv pip install fastapi uvicorn websockets pydantic psutil aiofiles python-multipart

# Make start scripts executable
chmod +x /opt/thinkfan-ui/start.py
chmod +x /opt/thinkfan-ui/start.sh

# Install desktop entry
echo "🖥️ Installing desktop entry..."
sudo cp "$ORIGINAL_DIR/thinkfan-ui-modern.desktop" /usr/share/applications/

# Install icon
echo "🎨 Installing icon..."
sudo cp "$ORIGINAL_DIR/linux_packaging/thinkfan-ui.svg" /usr/share/icons/hicolor/scalable/apps/thinkfan-ui.svg

# Create symlinks
echo "🔗 Creating command line shortcuts..."
sudo ln -sf /opt/thinkfan-ui/start.sh /usr/local/bin/thinkfan-ui-modern
sudo ln -sf /opt/thinkfan-ui/start.py /usr/local/bin/thinkfan-ui-modern-py

# Setup thinkpad_acpi module configuration
echo "⚙️ Configuring thinkpad_acpi module..."
if [ ! -f /etc/modprobe.d/thinkpad_acpi.conf ]; then
    echo "options thinkpad_acpi fan_control=1" | sudo tee /etc/modprobe.d/thinkpad_acpi.conf
    echo "✅ Created /etc/modprobe.d/thinkpad_acpi.conf"
else
    if ! grep -q "fan_control=1" /etc/modprobe.d/thinkpad_acpi.conf; then
        echo "options thinkpad_acpi fan_control=1" | sudo tee -a /etc/modprobe.d/thinkpad_acpi.conf
        echo "✅ Updated /etc/modprobe.d/thinkpad_acpi.conf"
    else
        echo "✅ thinkpad_acpi already configured"
    fi
fi

# Update icon cache
echo "🔄 Updating icon cache..."
sudo gtk-update-icon-cache -f -t /usr/share/icons/hicolor/ 2>/dev/null || true

echo ""
echo "🎉 Installation completed successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Reboot your system to load the thinkpad_acpi module with fan control"
echo "2. After reboot, run 'thinkfan-ui-modern' or launch from applications menu"
echo "3. The web interface will be available at http://localhost:12000"
echo ""
echo "🚀 Launch options:"
echo "• Command line: thinkfan-ui-modern"
echo "• Python script: thinkfan-ui-modern-py"
echo "• Direct: /opt/thinkfan-ui/start.sh"
echo "• Applications menu: ThinkFan UI Modern"
echo ""
echo "🔧 Troubleshooting:"
echo "• If fan control doesn't work, ensure you have a ThinkPad with thinkpad_acpi support"
echo "• Check that /proc/acpi/ibm/fan exists after reboot"
echo "• Run with elevated privileges if needed: sudo thinkfan-ui-modern"
echo "• Virtual environment issues: cd /opt/thinkfan-ui && source .venv/bin/activate"
echo ""
echo "📖 For more information, visit: https://github.com/bobdavis84/thinkfan-ui"