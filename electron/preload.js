const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  getBackendURL: () => ipcRenderer.invoke('get-backend-url'),
  getBackendPort: () => ipcRenderer.invoke('get-backend-port'),
  getDatabasePath: () => ipcRenderer.invoke('get-database-path'),
  // Listen for backend URL ready event
  onBackendURLReady: (callback) => {
    ipcRenderer.on('backend-url-ready', (event, url) => callback(url));
  },
  // Remove listener
  removeBackendURLListener: () => {
    ipcRenderer.removeAllListeners('backend-url-ready');
  }
});

