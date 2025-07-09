const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');

const isDev = process.env.NODE_ENV !== 'production';
let mainWindow;

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 700,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  if (isDev) {
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }
};

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// IPC to run scripts
ipcMain.handle('run-script', async (event, scriptPath) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  const { response } = await dialog.showMessageBox(win, {
    type: 'question',
    buttons: ['Cancelar', 'Ejecutar'],
    defaultId: 1,
    message: '¿Desea ejecutar el script?',
  });
  if (response === 1) {
    return new Promise((resolve, reject) => {
      const child = require('child_process').execFile(scriptPath, { shell: true }, (err, stdout, stderr) => {
        if (err) {
          reject(stderr);
        } else {
          resolve(stdout);
        }
      });
    });
  } else {
    return 'cancelado';
  }
});

// IPC for license management
const userDataPath = app.getPath('userData');
const usageFile = path.join(userDataPath, '.usage.json');
const licenseFile = path.join(__dirname, '../license.txt');

ipcMain.handle('validate-license', async (event, key) => {
  const licenseKeys = fs.readFileSync(licenseFile, 'utf-8').split(/\r?\n/);
  if (licenseKeys.includes(key.trim())) {
    // initialize usage if not exists
    if (!fs.existsSync(usageFile)) {
      fs.writeFileSync(usageFile, JSON.stringify({ key, uses: 3 }));
    }
    return { valid: true };
  }
  return { valid: false };
});

ipcMain.handle('get-usage', () => {
  if (fs.existsSync(usageFile)) {
    const data = JSON.parse(fs.readFileSync(usageFile, 'utf-8'));
    return data;
  }
  return null;
});

ipcMain.handle('decrement-usage', () => {
  if (fs.existsSync(usageFile)) {
    const data = JSON.parse(fs.readFileSync(usageFile, 'utf-8'));
    if (data.uses > 0) {
      data.uses -= 1;
      fs.writeFileSync(usageFile, JSON.stringify(data));
      return data.uses;
    }
    return 0;
  }
  return 0;
});
