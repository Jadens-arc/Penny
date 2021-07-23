const {
  app,
  BrowserWindow,
  screen,
  NodeEventEmitter,
  Menu,
  ipcMain,
  dialog,
} = require("electron");
const fs = require("fs");
function createWindow() {
  let win = new BrowserWindow({
    width: 500,
    height: 700,
    autoHideMenuBar: true,
    frame: false,
    transparent: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      devTools: true,
    },
  });
  win.setAlwaysOnTop(true);
  // win.webContents.openDevTools(); dev option
  win.loadFile("index.html");
}

ipcMain.on("openFile", async (event, path) => {
  let newPath = await dialog.showOpenDialog({
    properties: ["openFile"],
  });
  if (newPath["canceled"]) return;
  event.reply("newPath", newPath["filePaths"][0]);
});

app.whenReady().then(createWindow);
