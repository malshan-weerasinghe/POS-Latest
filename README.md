# 🏪 POS Looper7 - Easy Desktop POS

A modern, all-in-one Point of Sale system for retail shops. Run it in your browser during setup or install it as a permanent Windows application for your business.

---

## 🚀 How to Run the Application

You don't need to be a coder to start the system. Follow these simple steps:

### 1️⃣ Open your "Command Prompt"

In your project folder, hold the **Shift** key and **Right-Click** on any empty space, then select **"Open PowerShell window here"** or **"Open Command Prompt here."**

---

### 2️⃣ Run Everything (Easiest Way)

Type this command and press **Enter**:

```bash
npm run start:all
```

**What this does:** It starts the "brain" (backend) and the "screen" (frontend) at the same time.

**How to see it:** Your web browser will automatically open to `http://localhost:5173`.

**How to stop:** Click on the black terminal window and press **Ctrl + C** on your keyboard.

---

## ⚙️ Running Parts Separately

If you only want to test specific parts, use these commands:

### To run ONLY the "Screen" (Frontend):

```bash
npm start
```

### To run ONLY the "Brain" (Backend):

```bash
cd backend
npm start
```

---

## 📦 How to Create your Windows App (.EXE)

If you want to use this as a real desktop application (like Word or Excel) instead of a website, follow these steps to build your own installer.

### Step 1: Build the Windows Installer

**Option 1: Simple Build (Recommended)**
```bash
npm run dist
```

**Option 2: Safe Build (Use if you get "file is locked" errors)**
```bash
npm run dist:safe
```

This command will:
- Stop any running processes that might interfere
- Rebuild all necessary components
- Create a Windows installer file

**Note:** The build process may take 1-2 minutes. Be patient!

### Step 2: Find your Application

Once the command finishes, go to your project folder and look for a new folder called **`release-build`**. Inside, you will find:

**Two ways to use your app:**

#### Option A: Installer (Recommended for Distribution)
- **`POS_Looper7-0.1.0-Setup.exe`** - This is the installer file
  - Double-click it to install the app on any Windows computer
  - Creates shortcuts and installs to Program Files
  - Best for distributing to customers/users

#### Option B: Portable Version (No Installation Needed)
- **`win-unpacked`** folder - This is the unpacked application
  - Contains **`POS Looper7.exe`** - You can run this directly!
  - No installation required - just double-click the `.exe` file
  - Perfect for testing or portable use
  - You can copy this entire folder to a USB drive and run it anywhere

### Step 3: Run the Application

**If you used the installer:**
1. Double-click **`POS_Looper7-0.1.0-Setup.exe`**
2. Follow the Windows installation prompts
3. A shortcut named **"POS Looper7"** will appear on your Desktop
4. Open it like any other app!

**If you want to run without installing:**
1. Go to **`release-build\win-unpacked`** folder
2. Double-click **`POS Looper7.exe`**
3. The app will start immediately (no installation needed!)

---

## 🛠️ Quick Reference Guide

| Goal | What to type |
|------|--------------|
| **First time setup** | `npm install` then `cd backend && npm install` |
| **Start the Shop System** | `npm run start:all` |
| **Create Windows App** | `npm run dist` or `npm run dist:safe` |
| **Run without installing** | Go to `release-build\win-unpacked` and double-click `POS Looper7.exe` |
| **Default Login PIN** | `123456` |

---
