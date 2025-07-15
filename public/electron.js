const { app, BrowserWindow } = require('electron');
const path = require('path');
const { spawn } = require('child_process');

let flaskProcess;
let assistantProcess;

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
  flaskProcess = spawn('python', ['flask_server.py'], {
    cwd: path.join(__dirname, '..'),
    stdio: 'ignore',
    windowsHide: true
  });
}

function startAssistant() {
  assistantProcess = spawn('cmd', ['/c', 'start', 'launch_assistant.bat'], {
    cwd: path.join(__dirname, '..'),
    detached: true
  });
}

app.whenReady().then(() => {
  startFlask();
  startAssistant();
  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();

  if (flaskProcess) {
    try { process.kill(-flaskProcess.pid); } catch (e) {}
  }

  if (assistantProcess) {
    try { process.kill(-assistantProcess.pid); } catch (e) {}
  }
});
