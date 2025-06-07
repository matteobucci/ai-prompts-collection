@echo off
setlocal enabledelayedexpansion

REM AI Coding Prompts Web Viewer Startup Script for Windows

echo 🚀 Starting AI Coding Prompts Web Viewer...
echo ========================================

REM Check if Node.js is installed
node -v >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is not installed. Please install Node.js 16.0 or higher.
    echo 📥 Download from: https://nodejs.org/
    pause
    exit /b 1
)

REM Get Node.js version and check if it's 16 or higher
for /f "tokens=1 delims=." %%a in ('node -v ^| findstr /R "v[0-9]*\.[0-9]*\.[0-9]*"') do (
    set NODE_MAJOR=%%a
    set NODE_MAJOR=!NODE_MAJOR:~1!
)

if !NODE_MAJOR! LSS 16 (
    echo ❌ Node.js version !NODE_MAJOR! is too old. Please upgrade to Node.js 16.0 or higher.
    pause
    exit /b 1
)

REM Navigate to web-viewer directory
cd /d "%~dp0web-viewer"
if errorlevel 1 (
    echo ❌ Could not find web-viewer directory
    pause
    exit /b 1
)

REM Check if dependencies are installed
if not exist "node_modules" (
    echo 📦 Installing dependencies...
    npm install
    
    if errorlevel 1 (
        echo ❌ Failed to install dependencies
        pause
        exit /b 1
    )
    echo ✅ Dependencies installed successfully
) else (
    echo ✅ Dependencies already installed
)

REM Check if package.json exists
if not exist "package.json" (
    echo ❌ package.json not found in web-viewer directory
    pause
    exit /b 1
)

REM Set default port
if not defined PORT set PORT=3001

REM Check if port is available (simplified check for Windows)
netstat -an | findstr ":%PORT% " >nul 2>&1
if not errorlevel 1 (
    echo ⚠️  Port %PORT% appears to be in use. The server will try to use it anyway.
    echo    If you encounter issues, try setting a different port: set PORT=3002
)

echo.
echo 🌐 Starting web server on port %PORT%...
echo 📚 Your prompts will be available at: http://localhost:%PORT%
echo.
echo 💡 Features:
echo    • Browse all prompts and setup guides
echo    • Full-text search across all content
echo    • Dark/light theme toggle
echo    • Mobile-responsive design
echo    • Copy code blocks and entire documents
echo.
echo 🔧 Controls:
echo    • Press Ctrl+C to stop the server
echo    • Press Ctrl+K to open search (when in browser)
echo.

REM Start the server
echo ⏳ Loading content and starting server...
node src/server.js

echo.
echo 👋 Web viewer stopped. Thanks for using AI Coding Prompts!
pause