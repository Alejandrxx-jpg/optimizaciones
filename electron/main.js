const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const { autoUpdater } = require('electron-updater');

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
  if (!isDev) {
    autoUpdater.checkForUpdatesAndNotify();
  }
  // Aquí podría integrarse la verificación de pagos o suscripciones (Stripe)
  // para habilitar funcionalidades Premium en futuras versiones.

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
    log(`Ejecutando ${scriptPath}`);
    return new Promise((resolve, reject) => {
      const child = require('child_process').execFile(scriptPath, { shell: true }, (err, stdout, stderr) => {
        if (err) {
          log(`Error ${stderr}`);
          reject(stderr);
        } else {
          log(`Completado ${scriptPath}`);
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
const usageFile = path.join(userDataPath, '.usage.enc');
const licenseFile = path.join(__dirname, '../license.txt');
const secret = crypto.createHash('sha256').update('mi_secreto_basico').digest();

function encrypt(data) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-ctr', secret, iv);
  const enc = Buffer.concat([cipher.update(JSON.stringify(data)), cipher.final()]);
  return iv.toString('hex') + ':' + enc.toString('hex');
}

function decrypt(str) {
  const [ivHex, dataHex] = str.split(':');
  const iv = Buffer.from(ivHex, 'hex');
  const decipher = crypto.createDecipheriv('aes-256-ctr', secret, iv);
  const dec = Buffer.concat([decipher.update(Buffer.from(dataHex, 'hex')), decipher.final()]);
  return JSON.parse(dec.toString());
}

function log(msg) {
  fs.appendFileSync(path.join(userDataPath, 'log.txt'), `[${new Date().toISOString()}] ${msg}\n`);
}

ipcMain.handle('validate-license', async (event, key) => {
  const licenseKeys = fs.readFileSync(licenseFile, 'utf-8').split(/\r?\n/);
  if (licenseKeys.includes(key.trim())) {
    // initialize usage if not exists
    if (!fs.existsSync(usageFile)) {
      const content = encrypt({ key, uses: 3 });
      fs.writeFileSync(usageFile, content);
    }
    return { valid: true };
  }
  return { valid: false };
});

ipcMain.handle('get-usage', () => {
  if (fs.existsSync(usageFile)) {
    const data = decrypt(fs.readFileSync(usageFile, 'utf-8'));
    return data;
  }
  return null;
});

ipcMain.handle('decrement-usage', () => {
  if (fs.existsSync(usageFile)) {
    const data = decrypt(fs.readFileSync(usageFile, 'utf-8'));
    if (data.uses > 0) {
      data.uses -= 1;
      fs.writeFileSync(usageFile, encrypt(data));
      return data.uses;
    }
    return 0;
  }
  return 0;
});

ipcMain.handle('reset-license', () => {
  if (fs.existsSync(usageFile)) {
    fs.unlinkSync(usageFile);
    log('Licencia reiniciada');
  }
  return true;
});

ipcMain.handle('save-report', (event, script, output) => {
  const file = path.join(userDataPath, `reporte_${Date.now()}.txt`);
  fs.writeFileSync(file, `Script: ${script}\nResultado:\n${output}`);
  return file;
});

ipcMain.handle('get-path', (event, name) => {
  return app.getPath(name);
});
