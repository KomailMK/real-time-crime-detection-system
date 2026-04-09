@echo off
REM Crime Detection System - Backend Setup Script for Windows
REM This script installs all Python dependencies

echo.
echo ========================================
echo Crime Detection System - Setup
echo ========================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python is not installed or not in PATH
    echo Please install Python 3.8+ from https://www.python.org/
    echo Make sure to check "Add Python to PATH" during installation
    pause
    exit /b 1
)

echo Python found:
python --version
echo.

REM Check if pip is available
pip --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: pip is not available
    echo Try: python -m pip --version
    pause
    exit /b 1
)

echo Pip found:
pip --version
echo.

REM Upgrade pip
echo Upgrading pip...
python -m pip install --upgrade pip
echo.

REM Install requirements
echo Installing dependencies from requirements.txt...
echo This may take a few minutes...
echo.

pip install -r requirements.txt

if errorlevel 1 (
    echo.
    echo ERROR: Failed to install dependencies
    echo Try: python -m pip install -r requirements.txt
    pause
    exit /b 1
)

echo.
echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo Dependencies installed successfully!
echo.
echo Next steps:
echo 1. Make sure MySQL is running on localhost:3306
echo 2. Create/update .env file with your MySQL credentials
echo 3. Run: python app.py
echo.
pause
