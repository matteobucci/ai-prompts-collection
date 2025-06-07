#!/bin/bash

# AI Coding Prompts Web Viewer Startup Script

echo "🚀 Starting AI Coding Prompts Web Viewer..."
echo "========================================"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16.0 or higher."
    echo "📥 Download from: https://nodejs.org/"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 16 ]; then
    echo "❌ Node.js version $NODE_VERSION is too old. Please upgrade to Node.js 16.0 or higher."
    exit 1
fi

# Navigate to web-viewer directory
cd "$(dirname "$0")/web-viewer" || {
    echo "❌ Could not find web-viewer directory"
    exit 1
}

# Check if dependencies are installed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    
    if [ $? -ne 0 ]; then
        echo "❌ Failed to install dependencies"
        exit 1
    fi
    echo "✅ Dependencies installed successfully"
else
    echo "✅ Dependencies already installed"
fi

# Check if package.json exists
if [ ! -f "package.json" ]; then
    echo "❌ package.json not found in web-viewer directory"
    exit 1
fi

# Get available port
PORT=${PORT:-3001}

# Check if port is available
if lsof -Pi :$PORT -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo "⚠️  Port $PORT is already in use. Trying port $((PORT + 1))..."
    PORT=$((PORT + 1))
    
    if lsof -Pi :$PORT -sTCP:LISTEN -t >/dev/null 2>&1; then
        echo "⚠️  Port $PORT is also in use. Trying port $((PORT + 1))..."
        PORT=$((PORT + 1))
    fi
fi

# Export port for the application
export PORT=$PORT

echo ""
echo "🌐 Starting web server on port $PORT..."
echo "📚 Your prompts will be available at: http://localhost:$PORT"
echo ""
echo "💡 Features:"
echo "   • Browse all prompts and setup guides"
echo "   • Full-text search across all content"
echo "   • Dark/light theme toggle"
echo "   • Mobile-responsive design"
echo "   • Copy code blocks and entire documents"
echo ""
echo "🔧 Controls:"
echo "   • Press Ctrl+C to stop the server"
echo "   • Press Ctrl+K to open search (when in browser)"
echo ""

# Start the server
echo "⏳ Loading content and starting server..."
node src/server.js

echo ""
echo "👋 Web viewer stopped. Thanks for using AI Coding Prompts!"