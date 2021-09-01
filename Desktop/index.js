const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const fs = require("fs");
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

  ipcMain.on("closeSettings", () => {
    win.loadFile("index.html");
  });
  ipcMain.on("showSettings", (event) => {
    win.loadFile("pages/settings/settings.html");
  });

  ipcMain.on("toggleAlwaysOnTop", (event, msg) => {
    win.setAlwaysOnTop(!win.isAlwaysOnTop());
  });

  ipcMain.on("openFile", async (event, path) => {
    let newPath = await dialog.showOpenDialog({
      properties: ["openFile"],
      filters: [{ name: "Wallets", extensions: ["json"] }],
      buttonLabel: "Use",
    });
    if (newPath["canceled"]) return;
    console.log("path opened");
    event.reply("newPath", newPath["filePaths"][0]);
  });

  ipcMain.on("newWallet", async (event) => {
    let newWalletPath = await dialog.showSaveDialog({
      title: "Where do you want to keep your secrets",
      filters: [{ name: "Wallets", extensions: ["json"] }],
    });
    // check if file doesn't exist
    if (!fs.existsSync(newWalletPath["filePath"])) {
      // if it doesn't then write boilerplate data to it
      fs.writeFileSync(newWalletPath["filePath"], "{}");
    }
    event.reply("newPath", newWalletPath["filePath"]); // reply with new file path
  });

  win.loadFile("index.html");
}

function createInstructionsWindow() {
  let win = new BrowserWindow({
    width: 350,
    height: 600,
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
  }

  ipcMain.on("closeInstructions", () => {
    win.destroy();
  });
  win.loadFile("pages/instructions/instructions.html");
}

function createSettingsWindow() {
  let win = new BrowserWindow({
    width: 350,
    height: 600,
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
  }

  ipcMain.on("closeSettings", () => {
    win.destroy();
  });
  win.loadFile("pages/settings/settings.html");
}

ipcMain.on("showInstructions", (event) => {
  createInstructionsWindow();
});

ipcMain.on("log", (event, msg) => {
  console.log(msg);
});

app.whenReady().then(createWindow);
