# PowerShell script to fix sqlite3 rebuild permission issues on Windows
Write-Host "Fixing sqlite3 rebuild permission issues..." -ForegroundColor Cyan

# Step 1: Kill any running Electron processes
Write-Host "`nStep 1: Checking for running Electron processes..." -ForegroundColor Yellow
$electronProcesses = Get-Process -Name "electron" -ErrorAction SilentlyContinue
if ($electronProcesses) {
    Write-Host "Found $($electronProcesses.Count) Electron process(es). Stopping them..." -ForegroundColor Yellow
    $electronProcesses | Stop-Process -Force
    Start-Sleep -Seconds 2
    Write-Host "Electron processes stopped." -ForegroundColor Green
} else {
    Write-Host "No Electron processes found." -ForegroundColor Green
}

# Step 2: Remove the locked sqlite3 build directory
Write-Host "`nStep 2: Removing sqlite3 build directory..." -ForegroundColor Yellow
$buildPath = "backend\node_modules\sqlite3\build"
if (Test-Path $buildPath) {
    try {
        Remove-Item -Path $buildPath -Recurse -Force -ErrorAction Stop
        Write-Host "Build directory removed successfully." -ForegroundColor Green
    } catch {
        Write-Host "Warning: Could not remove build directory: $_" -ForegroundColor Yellow
        Write-Host "You may need to close any applications using this file and run as Administrator." -ForegroundColor Yellow
    }
} else {
    Write-Host "Build directory does not exist." -ForegroundColor Green
}

# Step 3: Rebuild sqlite3
Write-Host "`nStep 3: Rebuilding sqlite3 for Electron..." -ForegroundColor Yellow
npm run rebuild:backend
$rebuildExitCode = $LASTEXITCODE

if ($rebuildExitCode -eq 0) {
    Write-Host "`n[SUCCESS] Rebuild completed successfully!" -ForegroundColor Green
} else {
    Write-Host "`n[FAILED] Rebuild failed. Try running this script as Administrator." -ForegroundColor Red
    exit $rebuildExitCode
}

