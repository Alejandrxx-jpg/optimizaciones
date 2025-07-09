const { contextBridge, ipcRenderer } = require('electron');
contextBridge.exposeInMainWorld('api', {
  runScript: (scriptPath) => ipcRenderer.invoke('run-script', scriptPath),
  validateLicense: (key) => ipcRenderer.invoke('validate-license', key),
  getUsage: () => ipcRenderer.invoke('get-usage'),
  decrementUsage: () => ipcRenderer.invoke('decrement-usage'),
  saveReport: (script, output) => ipcRenderer.invoke('save-report', script, output),
  resetLicense: () => ipcRenderer.invoke('reset-license'),
  getPath: (name) => ipcRenderer.invoke('get-path', name),
});
