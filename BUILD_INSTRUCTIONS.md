# Building POS Looper7 Desktop Application

This guide explains how to build the POS Looper7 application as a Windows desktop executable (.exe installer).

## Prerequisites

1. **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
2. **npm** (comes with Node.js)
3. **Windows OS** (for building Windows installer)

## Build Steps

### 1. Install Dependencies

First, install all dependencies for both frontend and backend:

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..
```

### 2. Build Frontend

Build the React frontend application:

```bash
npm run build
```

This creates the `dist` folder with the production-ready frontend files.

### 3. Build Desktop Application

Create the Windows installer:

```bash
npm run dist
```

This will:
- Build the frontend (if not already built)
- Package everything with Electron
- Create a Windows installer (.exe) in the `dist` folder
- The installer will be named: `POS_Looper7-0.1.0-Setup.exe`

## Installation

1. Run the generated `POS_Looper7-0.1.0-Setup.exe` installer
2. Follow the installation wizard
3. Choose installation directory (optional)
4. The installer will create:
   - Desktop shortcut: "POS Looper7"
   - Start Menu shortcut
   - Application files in the chosen directory

## Running the Application

After installation, you can launch the application by:
- Double-clicking the desktop shortcut
- Finding "POS Looper7" in the Start Menu
- Running the executable directly from the installation directory

The application will automatically:
- Start the backend server
- Load the frontend interface
- Initialize the database (if first run)
- Everything works seamlessly without any manual commands

## Development Mode

To run the app in development mode with hot-reload:

```bash
# Terminal 1: Start frontend dev server
npm run dev

# Terminal 2: Start Electron (in another terminal)
npm run electron:dev
```

Or start backend separately:

```bash
# Terminal 1: Start backend
cd backend
npm start

# Terminal 2: Start frontend
npm run dev

# Terminal 3: Start Electron
npm run electron
```

## Application Data

The application stores its data in:
- **Windows**: `%APPDATA%\pos-looper7\`
- Database location: `%APPDATA%\pos-looper7\database\pos.db`

This ensures data persists across app updates and is stored in the user's data directory.

## Troubleshooting

### Backend fails to start
- Ensure backend dependencies are installed: `cd backend && npm install`
- Check that port 5000 is not in use by another application

### Frontend doesn't load
- Ensure frontend is built: `npm run build`
- Check Electron console for errors (DevTools)

### Database errors
- The database is automatically created on first run
- Check write permissions in the user data directory
- Database location: `%APPDATA%\pos-looper7\database\`

## Build Configuration

The build configuration is in `package.json` under the `build` section:
- **App Name**: POS Looper7
- **Executable Name**: POS_Looper7
- **Icon**: looper7_logo.ico
- **Installer**: NSIS (Windows)

## Notes

- The backend server runs automatically when the app starts
- The database is stored in the user's AppData directory
- All backend and frontend code is bundled into the executable
- No external dependencies required after installation







