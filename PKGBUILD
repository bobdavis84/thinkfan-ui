# Maintainer: OpenHands <openhands@all-hands.dev>
# Based on original by zocker_160

pkgname=thinkfan-ui-modern
pkgver=2.0.0
pkgrel=1
pkgdesc="Modern web-based fan control for ThinkPad laptops"
arch=('any')
url="https://github.com/bobdavis84/thinkfan-ui"
license=('GPL3')
depends=('python' 'python-fastapi' 'python-uvicorn' 'python-websockets' 'python-pydantic' 'python-psutil' 'lm_sensors' 'polkit')
optdepends=('nodejs: for development and building frontend')
conflicts=('thinkfan-ui')
provides=('thinkfan-ui')
source=("$pkgname-$pkgver.tar.gz")
sha256sums=('SKIP')

package() {
    cd "$srcdir/$pkgname-$pkgver"
    
    # Install application files
    install -dm755 "$pkgdir/opt/thinkfan-ui"
    cp -r backend "$pkgdir/opt/thinkfan-ui/"
    cp -r frontend/dist "$pkgdir/opt/thinkfan-ui/frontend/"
    install -Dm755 start.py "$pkgdir/opt/thinkfan-ui/start.py"
    
    # Install desktop entry
    install -Dm644 thinkfan-ui-modern.desktop "$pkgdir/usr/share/applications/thinkfan-ui-modern.desktop"
    
    # Install icon
    install -Dm644 linux_packaging/thinkfan-ui.svg "$pkgdir/usr/share/icons/hicolor/scalable/apps/thinkfan-ui.svg"
    
    # Install polkit policy
    install -Dm644 linux_packaging/thinkpad_acpi.conf "$pkgdir/etc/modprobe.d/thinkpad_acpi.conf"
    
    # Create symlink for easy access
    install -dm755 "$pkgdir/usr/bin"
    ln -s "/opt/thinkfan-ui/start.py" "$pkgdir/usr/bin/thinkfan-ui-modern"
    
    # Install documentation
    install -Dm644 README.md "$pkgdir/usr/share/doc/$pkgname/README.md"
    install -Dm644 LICENSE "$pkgdir/usr/share/licenses/$pkgname/LICENSE"
}

post_install() {
    echo "ThinkFan UI Modern has been installed!"
    echo ""
    echo "To use this application:"
    echo "1. Ensure your ThinkPad has the thinkpad_acpi module loaded"
    echo "2. Add 'options thinkpad_acpi fan_control=1' to /etc/modprobe.d/thinkpad_acpi.conf"
    echo "3. Reboot or reload the module"
    echo "4. Run 'thinkfan-ui-modern' or launch from applications menu"
    echo ""
    echo "The application will be available at http://localhost:12000"
}