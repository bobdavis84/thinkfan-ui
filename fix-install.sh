#!/bin/bash

# Quick fix script to complete the installation
# Run this if the main install.sh failed partway through

echo "🔧 Completing ThinkFan UI installation..."

# Get current directory
ORIGINAL_DIR="$(pwd)"

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