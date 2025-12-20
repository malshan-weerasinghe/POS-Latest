@echo off
echo Setting up POS Backend...
echo.

cd /d "%~dp0"

echo Installing dependencies...
call npm install
if errorlevel 1 (
    echo Error: Failed to install dependencies
    pause
    exit /b 1
)

echo.
echo Initializing database...
call npm run init-db
if errorlevel 1 (
    echo Error: Failed to initialize database
    pause
    exit /b 1
)

echo.
echo Seeding database with sample data...
call npm run seed
if errorlevel 1 (
    echo Error: Failed to seed database
    pause
    exit /b 1
)

echo.
echo ✅ Backend setup completed successfully!
echo.
echo To start the server, run:
echo   npm start     (production)
echo   npm run dev   (development with auto-reload)
echo.
echo Default admin PIN: 123456
echo *** Change this PIN after first login! ***
echo.
pause