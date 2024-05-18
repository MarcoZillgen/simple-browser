const { app, BrowserWindow, Menu } = require("electron");
const path = require("path");

let mainWindow;
app.disableHardwareAcceleration();

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1920,
    height: 1080,
    frame: false,
    webPreferences: {
      nodeIntegration: true,
      webviewTag: true,
      contextIsolation: false,
      fullscreen: true,
      autoHideMenuBar: true,
    },
  });

  mainWindow.webContents.openDevTools();

  Menu.setApplicationMenu(null);

  mainWindow.loadFile(path.join(__dirname, "index.html"));

  mainWindow.on("closed", () => (mainWindow = null));
}

app.on("ready", createWindow);

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", function () {
  if (mainWindow === null) createWindow();
});
