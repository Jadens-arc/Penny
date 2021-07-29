const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const dotenv = require("dotenv");
dotenv.config();

function createWindow() {
  let win = new BrowserWindow({
    width: 500,
    height: 700,
    autoHideMenuBar: true,
    frame: false,
    transparent: true,
    logo: __dirname + "/Assets/logo.ico",
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      devTools: true,
    },
  });
  if (process.env.NODE_ENV === "development") {
    win.setAlwaysOnTop(true);
    win.webContents.openDevTools();
  }
  win.loadFile("index.html");
}

function creatInstructionsWindow() {
  let win = new BrowserWindow({
    width: 350,
    height: 600,
    autoHideMenuBar: true,
    frame: false,
    transparent: true,
    logo: __dirname + "/Assets/logo.ico",
  });
  win.setAlwaysOnTop(true);
  if (process.env.NODE_ENV === "development") {
    win.setAlwaysOnTop(true);
    win.webContents.openDevTools();
  }
  win.loadFile("instructions.html");
}

ipcMain.on("openFile", async (event, path) => {
  let newPath = await dialog.showOpenDialog({
    properties: ["openFile"],
  });
  if (newPath["canceled"]) return;
  event.reply("newPath", newPath["filePaths"][0]);
});

ipcMain.on("showInstructions", (event) => {
  creatInstructionsWindow();
});

app.whenReady().then(createWindow);
