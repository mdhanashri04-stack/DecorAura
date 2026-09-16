# DecorAura PowerShell Startup Script
$ErrorActionPreference = "Continue"
$ProjectDir = $PSScriptRoot

Write-Host "===================================================" -ForegroundColor Yellow
Write-Host "             DecorAura 3D Launcher                 " -ForegroundColor Yellow
Write-Host "===================================================" -ForegroundColor Yellow
Write-Host ""

# Helper to test HTTP responsiveness
function Test-HttpEndpoint([string]$url) {
    try {
        $req = [System.Net.WebRequest]::Create($url)
        $req.Timeout = 1500
        $res = $req.GetResponse()
        $res.Close()
        return $true
    } catch {
        return $false
    }
}

# 1. Check Node.js
$nodeCmd = Get-Command node -ErrorAction SilentlyContinue
if (-not $nodeCmd) {
    Write-Host "[ERROR] Node.js is not found in PATH! Please install Node.js." -ForegroundColor Red
    Read-Host -Prompt "Press Enter to exit..."
    exit 1
}

# 2. Locate System Python
$sysPython = $null
if (Get-Command py -ErrorAction SilentlyContinue) {
    $sysPython = "py"
} elseif (Get-Command python -ErrorAction SilentlyContinue) {
    $sysPython = "python"
} else {
    Write-Host "[ERROR] Python is not found in PATH! Please install Python 3.10+." -ForegroundColor Red
    Read-Host -Prompt "Press Enter to exit..."
    exit 1
}

# 3. Check if DecorAura is ALREADY running
$frontendRunning = Test-HttpEndpoint "http://127.0.0.1:5173"
$backendRunning  = Test-HttpEndpoint "http://127.0.0.1:8000/docs"

if ($frontendRunning -and $backendRunning) {
    Write-Host "[INFO] DecorAura server is ALREADY running!" -ForegroundColor Green
    Write-Host "[INFO] Opening http://localhost:5173 in browser..." -ForegroundColor Cyan
    Start-Process "http://localhost:5173"
    Write-Host "DecorAura launched successfully." -ForegroundColor Green
    exit 0
}

# 4. Virtual Environment & Backend Setup
$venvPath = Join-Path $ProjectDir "venv"
$venvPython = Join-Path $venvPath "Scripts\python.exe"
$uvicornExe = Join-Path $venvPath "Scripts\uvicorn.exe"

if (-not (Test-Path $venvPython)) {
    Write-Host "[SETUP] Creating Python Virtual Environment in $venvPath..." -ForegroundColor Cyan
    & $sysPython -m venv $venvPath
}

# Install requirements if uvicorn is missing in venv
if (-not (Test-Path $uvicornExe)) {
    Write-Host "[SETUP] Installing Python backend dependencies from requirements.txt..." -ForegroundColor Cyan
    & $venvPython -m pip install -r (Join-Path $ProjectDir "requirements.txt")
}

# Seed database if missing
$dbPath = Join-Path $ProjectDir "decoraura.db"
if (-not (Test-Path $dbPath)) {
    Write-Host "[SETUP] Initializing DecorAura SQLite Database..." -ForegroundColor Cyan
    Set-Location $ProjectDir
    & $venvPython -m backend.seed
}

# 5. Frontend Setup
$nodeModulesPath = Join-Path $ProjectDir "frontend\node_modules"
if (-not (Test-Path $nodeModulesPath)) {
    Write-Host "[SETUP] Installing frontend npm packages..." -ForegroundColor Cyan
    Set-Location (Join-Path $ProjectDir "frontend")
    & npm.cmd install
}

# 6. Start Backend Server if not running
if (-not $backendRunning) {
    Write-Host "[START] Starting FastAPI Backend on http://localhost:8000..." -ForegroundColor Yellow
    Start-Process -FilePath $venvPython -ArgumentList "-m uvicorn backend.main:app --host 127.0.0.1 --port 8000" -WorkingDirectory $ProjectDir -WindowStyle Minimized
} else {
    Write-Host "[INFO] Backend is already running on port 8000." -ForegroundColor Green
}

# 7. Start Frontend Dev Server if not running
if (-not $frontendRunning) {
    Write-Host "[START] Starting Vite Frontend Server on http://localhost:5173..." -ForegroundColor Yellow
    $frontendDir = Join-Path $ProjectDir "frontend"
    Start-Process -FilePath "cmd.exe" -ArgumentList "/c npm.cmd run dev" -WorkingDirectory $frontendDir -WindowStyle Minimized
} else {
    Write-Host "[INFO] Frontend is already running on port 5173." -ForegroundColor Green
}

# 8. Wait for Frontend server readiness
Write-Host "[WAIT] Waiting for DecorAura frontend to become ready..." -ForegroundColor Cyan
$maxAttempts = 25
$attempt = 0
$ready = $false

while ($attempt -lt $maxAttempts) {
    Start-Sleep -Seconds 1
    $attempt++
    if (Test-HttpEndpoint "http://127.0.0.1:5173") {
        $ready = $true
        break
    }
    Write-Host "." -NoNewline -ForegroundColor Gray
}
Write-Host ""

if ($ready) {
    Write-Host "[SUCCESS] DecorAura is ready!" -ForegroundColor Green
    Write-Host "[LAUNCH] Opening browser at http://localhost:5173..." -ForegroundColor Yellow
    Start-Process "http://localhost:5173"
} else {
    Write-Host "[WARN] Frontend launch timed out, but opening browser anyway..." -ForegroundColor Yellow
    Start-Process "http://localhost:5173"
}

Write-Host "===================================================" -ForegroundColor Yellow
Write-Host " DecorAura background processes are active.        " -ForegroundColor Green
Write-Host " To stop all servers, run Close-DecorAura.bat.     " -ForegroundColor Cyan
Write-Host "===================================================" -ForegroundColor Yellow
