#!/bin/bash

# 🛡️ LUMINOUS FLOW - Production Installation Script

set -e

echo "🛡️  Installing LUMINOUS FLOW Vulnerability Scanner..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if running as root
if [[ $EUID -eq 0 ]]; then
   print_error "This script should not be run as root"
   exit 1
fi

# Detect OS
if [[ "$OSTYPE" == "linux-gnu"* ]]; then
    OS="linux"
elif [[ "$OSTYPE" == "darwin"* ]]; then
    OS="macos"
else
    print_error "Unsupported operating system: $OSTYPE"
    exit 1
fi

print_status "Detected OS: $OS"

# Check system requirements
check_requirements() {
    print_status "Checking system requirements..."
    
    # Check Node.js
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js 18 or later."
        exit 1
    fi
    
    NODE_VERSION=$(node --version | cut -d 'v' -f 2 | cut -d '.' -f 1)
    if [ "$NODE_VERSION" -lt 18 ]; then
        print_error "Node.js version 18 or later is required. Current version: $(node --version)"
        exit 1
    fi
    
    # Check npm
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed"
        exit 1
    fi
    
    # Check Go (for Nuclei)
    if ! command -v go &> /dev/null; then
        print_warning "Go is not installed. Installing Go for Nuclei..."
        install_go
    fi
    
    print_success "System requirements satisfied"
}

# Install Go
install_go() {
    if [[ "$OS" == "linux" ]]; then
        if command -v apt &> /dev/null; then
            sudo apt update
            sudo apt install -y golang-go
        elif command -v yum &> /dev/null; then
            sudo yum install -y golang
        else
            print_error "Package manager not supported. Please install Go manually."
            exit 1
        fi
    elif [[ "$OS" == "macos" ]]; then
        if command -v brew &> /dev/null; then
            brew install go
        else
            print_error "Homebrew not found. Please install Go manually."
            exit 1
        fi
    fi
}

# Install Nuclei
install_nuclei() {
    print_status "Installing Nuclei scanner..."
    
    if command -v nuclei &> /dev/null; then
        print_warning "Nuclei is already installed. Updating..."
        nuclei -update
        return
    fi
    
    # Install Nuclei using Go
    go install -v github.com/projectdiscovery/nuclei/v3/cmd/nuclei@latest
    
    # Add Go bin to PATH if not already there
    if [[ ":$PATH:" != *":$(go env GOPATH)/bin:"* ]]; then
        if [[ "$OS" == "macos" ]]; then
            # For macOS with zsh
            echo 'export PATH=$PATH:$(go env GOPATH)/bin' >> ~/.zshrc
        else
            # For Linux with bash
            echo 'export PATH=$PATH:$(go env GOPATH)/bin' >> ~/.bashrc
        fi
        export PATH=$PATH:$(go env GOPATH)/bin
    fi
    
    # Verify installation
    if command -v nuclei &> /dev/null; then
        print_success "Nuclei installed successfully: $(nuclei -version)"
    else
        print_error "Failed to install Nuclei"
        exit 1
    fi
    
    # Update templates
    print_status "Downloading Nuclei templates..."
    nuclei -update-templates
    print_success "Nuclei templates updated"
}

# Setup application
setup_app() {
    print_status "Setting up LUMINOUS FLOW application..."
    
    # Install dependencies
    print_status "Installing dependencies..."
    npm install
    
    # Create necessary directories
    mkdir -p data logs
    
    # Copy environment configuration
    if [ ! -f .env ]; then
        cp .env.example .env
        print_warning "Environment file created. Please edit .env with your configuration."
    fi
    
    # macOS-specific optimizations
    if [[ "$OS" == "macos" ]]; then
        print_status "Applying macOS optimizations..."
        
        # Add to macOS Firewall exceptions if needed
        if command -v /usr/libexec/ApplicationFirewall/socketfilterfw &> /dev/null; then
            print_status "Configuring firewall settings for Node.js..."
            sudo /usr/libexec/ApplicationFirewall/socketfilterfw --add $(which node)
            sudo /usr/libexec/ApplicationFirewall/socketfilterfw --unblockapp $(which node)
        fi
        
        # Check for Rosetta if using Apple Silicon
        if [[ $(uname -m) == "arm64" ]]; then
            if ! pgrep oahd > /dev/null 2>&1; then
                print_warning "Running on Apple Silicon. Some dependencies might require Rosetta."
                print_status "You can install Rosetta with: softwareupdate --install-rosetta --agree-to-license"
            fi
        fi
    fi
    
    # Build application
    print_status "Building application..."
    npm run build
    
    print_success "Application setup completed"
}

# Detect package manager
detect_package_manager() {
    print_status "Detecting package manager..."
    
    if [[ "$OS" == "macos" ]]; then
        if command -v brew &> /dev/null; then
            print_success "Homebrew detected"
            return 0
        else
            print_warning "Homebrew not found. It's recommended for installing dependencies."
            print_status "You can install Homebrew with: /bin/bash -c \"$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)\""
            read -p "Do you want to continue anyway? (y/N): " -n 1 -r
            echo
            if [[ ! $REPLY =~ ^[Yy]$ ]]; then
                exit 1
            fi
        fi
    fi
    
    return 0
}

# Check for macOS-specific tools
check_macos_tools() {
    if [[ "$OS" != "macos" ]]; then
        return
    fi
    
    print_status "Checking macOS specific tools..."
    
    # Check for XCode Command Line Tools
    if ! xcode-select -p &> /dev/null; then
        print_warning "XCode Command Line Tools not found. These are required for some dependencies."
        print_status "Installing XCode Command Line Tools..."
        xcode-select --install
        print_status "After installation completes, please run this script again."
        exit 0
    fi
    
    # Check for Homebrew packages that might be useful
    if command -v brew &> /dev/null; then
        RECOMMENDED_PACKAGES=("git" "nmap" "openssl" "jq")
        MISSING_PACKAGES=()
        
        for package in "${RECOMMENDED_PACKAGES[@]}"; do
            if ! brew list "$package" &> /dev/null; then
                MISSING_PACKAGES+=("$package")
            fi
        done
        
        if [[ ${#MISSING_PACKAGES[@]} -gt 0 ]]; then
            print_warning "Some recommended packages are not installed: ${MISSING_PACKAGES[*]}"
            read -p "Do you want to install them now? (y/N): " -n 1 -r
            echo
            if [[ $REPLY =~ ^[Yy]$ ]]; then
                brew install "${MISSING_PACKAGES[@]}"
            fi
        fi
    fi
    
    print_success "macOS tools check completed"
}

# Setup systemd service (Linux only)
setup_service() {
    if [[ "$OS" != "linux" ]]; then
        return
    fi
    
    read -p "Do you want to create a systemd service? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        return
    fi
    
    print_status "Creating systemd service..."
    
    SERVICE_FILE="/etc/systemd/system/luminous-flow.service"
    APP_DIR=$(pwd)
    USER=$(whoami)
    
    sudo tee $SERVICE_FILE > /dev/null <<EOF
[Unit]
Description=LUMINOUS FLOW Vulnerability Scanner
After=network.target

[Service]
Type=simple
User=$USER
WorkingDirectory=$APP_DIR
Environment=NODE_ENV=production
ExecStart=/usr/bin/npm start
Restart=always
RestartSec=10

# Security settings
NoNewPrivileges=true
ProtectSystem=strict
ProtectHome=true
ReadWritePaths=$APP_DIR/data $APP_DIR/logs

[Install]
WantedBy=multi-user.target
EOF

    sudo systemctl daemon-reload
    sudo systemctl enable luminous-flow
    
    print_success "Systemd service created. Use 'sudo systemctl start luminous-flow' to start the service."
}

# Setup macOS launchd service
setup_launchd() {
    if [[ "$OS" != "macos" ]]; then
        return
    fi
    
    read -p "Do you want to create a macOS LaunchAgent? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        return
    fi
    
    print_status "Creating macOS LaunchAgent..."
    
    LAUNCH_AGENT_DIR="$HOME/Library/LaunchAgents"
    LAUNCH_AGENT_FILE="$LAUNCH_AGENT_DIR/com.luminousflow.scanner.plist"
    APP_DIR=$(pwd)
    
    # Create LaunchAgents directory if it doesn't exist
    mkdir -p "$LAUNCH_AGENT_DIR"
    
    # Create the plist file
    cat > "$LAUNCH_AGENT_FILE" <<EOF
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.luminousflow.scanner</string>
    <key>ProgramArguments</key>
    <array>
        <string>$(which npm)</string>
        <string>start</string>
    </array>
    <key>RunAtLoad</key>
    <true/>
    <key>KeepAlive</key>
    <true/>
    <key>WorkingDirectory</key>
    <string>$APP_DIR</string>
    <key>StandardOutPath</key>
    <string>$APP_DIR/logs/luminousflow.log</string>
    <key>StandardErrorPath</key>
    <string>$APP_DIR/logs/luminousflow.error.log</string>
    <key>EnvironmentVariables</key>
    <dict>
        <key>NODE_ENV</key>
        <string>production</string>
        <key>PATH</key>
        <string>$(echo $PATH)</string>
    </dict>
</dict>
</plist>
EOF

    # Load the LaunchAgent
    launchctl load "$LAUNCH_AGENT_FILE"
    
    print_success "LaunchAgent created. The service will start automatically on login."
    print_status "Use 'launchctl start com.luminousflow.scanner' to start now."
    print_status "Use 'launchctl stop com.luminousflow.scanner' to stop the service."
}

# Main installation
main() {
    echo "🛡️  LUMINOUS FLOW Vulnerability Scanner Installation"
    echo "=================================================="
    
    detect_package_manager
    check_requirements
    
    # Run macOS-specific checks
    if [[ "$OS" == "macos" ]]; then
        check_macos_tools
    fi
    
    install_nuclei
    setup_app
    
    # Setup service based on OS
    if [[ "$OS" == "linux" ]]; then
        setup_service
    elif [[ "$OS" == "macos" ]]; then
        setup_launchd
    fi
    
    echo ""
    echo "🎉 Installation completed successfully!"
    echo ""
    echo "Next steps:"
    echo "1. Edit the .env file with your configuration"
    echo "2. Start the application:"
    
    if [[ "$OS" == "macos" ]]; then
        echo "   npm start"
        echo "   or"
        echo "   launchctl start com.luminousflow.scanner"
    else
        echo "   npm start"
        echo "   or"
        echo "   sudo systemctl start luminous-flow"
    fi
    
    echo ""
    echo "3. Access the scanner at: http://localhost:8080"
    echo ""
    echo "For production deployment, see DEPLOYMENT.md"
    echo ""
}

# Run installation
main "$@"
