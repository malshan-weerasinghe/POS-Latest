# PowerShell script to build Windows EXE installer
# This script kills any processes that might lock files and then builds the installer

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Building Windows EXE Installer" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Kill any running Electron or POS Looper7 processes
Write-Host "Step 1: Stopping any running Electron processes..." -ForegroundColor Yellow
$processes = @("electron", "POS Looper7", "app-builder", "node")

$killed = $false
foreach ($procName in $processes) {
    $procs = Get-Process -Name $procName -ErrorAction SilentlyContinue
    if ($procs) {
        Write-Host "  Found $($procs.Count) instance(s) of $procName" -ForegroundColor Yellow
        $procs | Stop-Process -Force -ErrorAction SilentlyContinue
        $killed = $true
    }
}

# Also try to find processes by command line that might be using the file
Write-Host "  Checking for processes using release directory..." -ForegroundColor Yellow
$allProcs = Get-Process | Where-Object { $_.Path -like "*POS-Latest*" -or $_.Path -like "*electron*" }
if ($allProcs) {
    Write-Host "  Found $($allProcs.Count) process(es) that might be locking files" -ForegroundColor Yellow
    $allProcs | Stop-Process -Force -ErrorAction SilentlyContinue
    $killed = $true
}

if ($killed) {
    Write-Host "  Waiting 5 seconds for processes to fully terminate..." -ForegroundColor Yellow
    Start-Sleep -Seconds 5
} else {
    Write-Host "  No processes found to kill" -ForegroundColor Green
}

# Step 2: Remove locked release directory
Write-Host ""
Write-Host "Step 2: Cleaning release directory..." -ForegroundColor Yellow
$releasePath = "release\win-unpacked"

if (Test-Path $releasePath) {
    Write-Host "  Attempting to remove existing release directory..." -ForegroundColor Yellow
    
    # Try multiple times with delays
    $maxAttempts = 5
    $attempt = 0
    $removed = $false
    
    while ($attempt -lt $maxAttempts -and -not $removed) {
        $attempt++
        try {
            # Use robocopy trick to remove locked directories (Windows hack)
            $emptyDir = "empty_temp_dir_$([System.Guid]::NewGuid().ToString())"
            New-Item -ItemType Directory -Path $emptyDir -Force | Out-Null
            Start-Sleep -Milliseconds 500
            
            # Use robocopy to mirror empty dir to target (effectively deleting it)
            $null = robocopy $emptyDir $releasePath /MIR /R:0 /W:0 /NFL /NDL /NJH /NJS 2>&1
            Remove-Item -Path $emptyDir -Recurse -Force -ErrorAction SilentlyContinue
            
            # Now try normal removal
            Start-Sleep -Milliseconds 500
            if (Test-Path $releasePath) {
                Remove-Item -Path $releasePath -Recurse -Force -ErrorAction Stop
            }
            $removed = $true
            Write-Host "  Release directory cleaned successfully (attempt $attempt)" -ForegroundColor Green
        } catch {
            if ($attempt -lt $maxAttempts) {
                Write-Host "  Attempt $attempt failed, retrying in 2 seconds..." -ForegroundColor Yellow
                Start-Sleep -Seconds 2
            } else {
                Write-Host "  Warning: Could not fully remove release directory after $maxAttempts attempts" -ForegroundColor Red
                Write-Host "  The build will use a different output directory to avoid conflicts" -ForegroundColor Yellow
            }
        }
    }
} else {
    Write-Host "  Release directory does not exist, skipping cleanup" -ForegroundColor Green
}

# Step 3: Run the build
Write-Host ""
Write-Host "Step 3: Starting build process..." -ForegroundColor Yellow
Write-Host "  This may take a few minutes..." -ForegroundColor Yellow
Write-Host ""

try {
    npm run dist
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "========================================" -ForegroundColor Green
        Write-Host "Build Completed Successfully!" -ForegroundColor Green
        Write-Host "========================================" -ForegroundColor Green
        Write-Host ""
        Write-Host "Installer location: release-build\POS_Looper7-0.1.0-Setup.exe" -ForegroundColor Green
        Write-Host ""
        Write-Host "You can now install the application by running the .exe file!" -ForegroundColor Cyan
    } else {
        Write-Host ""
        Write-Host "========================================" -ForegroundColor Red
        Write-Host "Build Failed!" -ForegroundColor Red
        Write-Host "========================================" -ForegroundColor Red
        Write-Host "Exit code: $LASTEXITCODE" -ForegroundColor Red
        exit $LASTEXITCODE
    }
} catch {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Red
    Write-Host "Build Error!" -ForegroundColor Red
    Write-Host "========================================" -ForegroundColor Red
    Write-Host "Error: $_" -ForegroundColor Red
    exit 1
}

