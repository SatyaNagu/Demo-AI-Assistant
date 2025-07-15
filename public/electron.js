const { app, BrowserWindow } = require('electron');
const path = require('path');
const { spawn } = require('child_process');

let flaskProcess;

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  win.loadURL('http://localhost:3000');
}

function startFlask() {
  // On Windows, use 'python' or 'python3' as appropriate
  flaskProcess = spawn('python', ['flask_server.py'], {
    cwd: path.join(__dirname, '..'),
    stdio: 'ignore',
    windowsHide: true // Hide the command window on Windows
  });
}

app.whenReady().then(() => {
  startFlask();
  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
  if (flaskProcess) {
    try { process.kill(-flaskProcess.pid); } catch (e) {}
  }
});
