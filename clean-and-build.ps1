# PowerShell script to clean locked files and rebuild
Write-Host "Cleaning and rebuilding POS Looper7..." -ForegroundColor Cyan

# Step 1: Kill all Electron and POS processes
Write-Host "`nStep 1: Stopping all Electron and POS processes..." -ForegroundColor Yellow
$processes = Get-Process -Name "electron","POS Looper7" -ErrorAction SilentlyContinue
if ($processes) {
    Write-Host "Found $($processes.Count) process(es). Stopping them..." -ForegroundColor Yellow
    $processes | Stop-Process -Force
    Start-Sleep -Seconds 2
    Write-Host "Processes stopped." -ForegroundColor Green
} else {
    Write-Host "No processes found." -ForegroundColor Green
}

# Step 2: Find and kill processes using the release directory
Write-Host "`nStep 2: Finding processes locking release directory..." -ForegroundColor Yellow
$releasePath = Resolve-Path "release" -ErrorAction SilentlyContinue
if ($releasePath) {
    try {
        # Use handle.exe if available, or try to find processes
        $lockedFiles = Get-ChildItem -Path "release" -Recurse -File -ErrorAction SilentlyContinue | Where-Object {
            try {
                $file = [System.IO.File]::Open($_.FullName, 'Open', 'ReadWrite', 'None')
                $file.Close()
                $false
            } catch {
                $true
            }
        }
        
        if ($lockedFiles) {
            Write-Host "Found locked files. Attempting to unlock..." -ForegroundColor Yellow
        }
    } catch {
        Write-Host "Could not check for locked files: $_" -ForegroundColor Yellow
    }
}

# Step 3: Remove release directory with retries
Write-Host "`nStep 3: Removing release directory..." -ForegroundColor Yellow
$maxRetries = 5
$retryCount = 0
$removed = $false

while ($retryCount -lt $maxRetries -and -not $removed) {
    try {
        if (Test-Path "release") {
            Remove-Item -Path "release" -Recurse -Force -ErrorAction Stop
            Write-Host "Release directory removed successfully." -ForegroundColor Green
            $removed = $true
        } else {
            Write-Host "Release directory does not exist." -ForegroundColor Green
            $removed = $true
        }
    } catch {
        $retryCount++
        if ($retryCount -lt $maxRetries) {
            Write-Host "Attempt $retryCount failed. Waiting 2 seconds before retry..." -ForegroundColor Yellow
            Start-Sleep -Seconds 2
            
            # Try to kill any processes again
            Get-Process -Name "electron","POS Looper7" -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
            Start-Sleep -Seconds 1
        } else {
            Write-Host "Failed to remove release directory after $maxRetries attempts." -ForegroundColor Red
            Write-Host "Please manually close:" -ForegroundColor Yellow
            Write-Host "  1. Any File Explorer windows with the release folder open" -ForegroundColor Yellow
            Write-Host "  2. Any running POS Looper7 applications" -ForegroundColor Yellow
            Write-Host "  3. Any antivirus software that might be scanning the folder" -ForegroundColor Yellow
            exit 1
        }
    }
}

# Step 4: Rebuild
Write-Host "`nStep 4: Rebuilding application..." -ForegroundColor Yellow
npm run dist
$buildExitCode = $LASTEXITCODE

if ($buildExitCode -eq 0) {
    Write-Host "`n[SUCCESS] Build completed successfully!" -ForegroundColor Green
    Write-Host "Installer location: release\POS_Looper7-0.1.0-Setup.exe" -ForegroundColor Cyan
} else {
    Write-Host "`n[FAILED] Build failed with exit code $buildExitCode" -ForegroundColor Red
    exit $buildExitCode
}


