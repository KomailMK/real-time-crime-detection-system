# Crime Detection System - Backend Setup Script for PowerShell
# This script installs all Python dependencies

Write-Host ""
Write-Host "========================================"
Write-Host "Crime Detection System - Setup"
Write-Host "========================================"
Write-Host ""

# Check if Python is installed
try {
    $pythonVersion = python --version 2>&1
    Write-Host "Python found: $pythonVersion"
} catch {
    Write-Host "ERROR: Python is not installed or not in PATH" -ForegroundColor Red
    Write-Host "Please install Python 3.8+ from https://www.python.org/" -ForegroundColor Yellow
    Write-Host "Make sure to check 'Add Python to PATH' during installation" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""

# Check if pip is available
try {
    $pipVersion = pip --version 2>&1
    Write-Host "Pip found: $pipVersion"
} catch {
    Write-Host "ERROR: pip is not available" -ForegroundColor Red
    Write-Host "Try: python -m pip --version" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""

# Upgrade pip
Write-Host "Upgrading pip..." -ForegroundColor Cyan
python -m pip install --upgrade pip
Write-Host ""

# Install requirements
Write-Host "Installing dependencies from requirements.txt..." -ForegroundColor Cyan
Write-Host "This may take a few minutes..." -ForegroundColor Yellow
Write-Host ""

pip install -r requirements.txt

if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "ERROR: Failed to install dependencies" -ForegroundColor Red
    Write-Host "Try: python -m pip install -r requirements.txt" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""
Write-Host "========================================"
Write-Host "Setup Complete!" -ForegroundColor Green
Write-Host "========================================"
Write-Host ""
Write-Host "Dependencies installed successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Make sure MySQL is running on localhost:3306"
Write-Host "2. Create/update .env file with your MySQL credentials"
Write-Host "3. Run: python app.py"
Write-Host ""

Read-Host "Press Enter to exit"
