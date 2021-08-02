const fs = require("fs");
const crypto = require("crypto");
const { Buffer } = require("buffer");
const notesEle = document.getElementById("notes");
const navEle = document.getElementById("nav");
const loginInput = document.getElementById("login");
const selectWallet = document.getElementById("selectWallet");
const { ipcRenderer } = require("electron");
const Path = require("path");
const closeBtn = document.getElementById("closeBtn");

closeBtn.addEventListener("click", () => {
  window.close();
});

let tabData;
let tabs;
let currentTab;
let key;
let isDevelopment = process.env.NODE_ENV === "development";

let configPath = isDevelopment
  ? Path.join(__dirname, "config.json")
  : Path.join(process.resourcesPath, "config.json");

let config = JSON.parse(fs.readFileSync(configPath));

if (config.firstStart) {
  config.firstStart = false;
  fs.writeFileSync(configPath, JSON.stringify(config, 2, 2));
  window.location = "help.html";
}

let path = config.path;
if (path == "starter") {
  if (isDevelopment) {
    path = Path.join(__dirname, "starter.json");
  } else {
    path = Path.join(process.resourcesPath, "starter.json");
  }
}

// read tabs and parse tabs
(function () {
  let file = fs.readFileSync(path);
  tabData = JSON.parse(file);
  tabs = Object.keys(tabData);
  if (tabs.length == 0) {
    loginInput.placeholder =
      "Type Password Here, this will be your new password";
  }
})();

ipcRenderer.on("newPath", (event, newPath) => {
  path = newPath;
  config.path = path;
  fs.writeFileSync(configPath, JSON.stringify(config, 2, 2));
  let file = fs.readFileSync(path);
  tabData = JSON.parse(file);
  tabs = Object.keys(tabData);
  if (tabs.length == 0) {
    loginInput.placeholder =
      "Type Password Here, this will be your new password";
  } else {
    loginInput.placeholder = "Type Password Here";
  }
});

loginInput.addEventListener("keypress", (e) => {
  if (e.key == "Enter") {
    let hash = crypto.createHash("md5").update(loginInput.value).digest("hex");
    key = hash;
    try {
      if (tabs.length == 0) {
        ipcRenderer.send("showInstructions");
      }
      // look for first tab with something in it
      for (tab of tabs) {
        // get first item in tab to try to decrypt it to see if key works
        if (tabData[tab].length > 0) {
          decryptData(tabData[tab][0]); // will throw error if key invalid
          break;
        }
      }
      // remove blur from  blurred elements and delete login input
      document.getElementById("nav").classList.remove("blur");
      document.getElementById("addNoteBtnContainer").classList.remove("blur");
      document.getElementById("notes").classList.remove("blur");
      document.body.removeChild(document.getElementById("loginWindow"));
      loadTabs();
      loadNotesFromTab(tabs[0]);
      currentTab = tabs[0];
    } catch (e) {
      console.warn(e);
      // if decryption was unsuccessful and error was throw display to user
      loginInput.value = null;
    }
  }
});

loginInput.focus();

selectWallet.addEventListener("click", (e) => {
  ipcRenderer.send("openFile");
});

function decryptData(data = "") {
  let [iv, text] = data.split(".");
  iv = Buffer.from(iv, "hex");
  let decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);
  let decrypted = decipher.update(text, "hex", "utf-8");
  return decrypted + decipher.final("utf-8");
}

function encryptData(data) {
  let iv = crypto.randomBytes(16);
  let cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
  let encrypted = cipher.update(data, "utf-8", "hex");
  return iv.toString("hex") + "." + encrypted + cipher.final("hex");
}

function deleteNote(tab, index) {
  tabData[tab].splice(index, 1);
  fs.writeFileSync(path, JSON.stringify(tabData, 2, 2));
  loadNotesFromTab(currentTab);
}

function updateNote(tab, index, value) {
  tabData[tab][index] = encryptData(value);
  fs.writeFileSync(path, JSON.stringify(tabData, 2, 2));
}

function loadNotesFromTab(tab) {
  notesEle.innerHTML = "";
  let title = document.createElement("h1");
  title.classList.add("title");
  title.innerText = decryptData(tab);
  notesEle.appendChild(title);
  currentTab = tab;
  let notesData = tabData[tab];
  notesData.forEach((note, index) => {
    let newNote = document.createElement("div");
    newNote.classList.add("note");
    let newNoteText = document.createElement("p");
    newNoteText.innerText = decryptData(note);
    newNoteText.contentEditable = true;
    newNoteText.addEventListener("input", (e) => {
      updateNote(tab, index, newNoteText.innerText);
    });
    let newNoteDeleteBtn = document.createElement("i");
    newNoteDeleteBtn.classList = "fa fa-times-circle";
    newNoteDeleteBtn.addEventListener("click", () =>
      deleteNote(currentTab, index)
    );
    newNote.appendChild(newNoteText);
    newNote.appendChild(newNoteDeleteBtn);
    notesEle.appendChild(newNote);
  });
  notesEle.scroll({ left: 0, top: notesEle.scrollHeight, behavior: "smooth" });
}

function addTab(name) {
  let decName = decryptData(name);
  let newTab = document.createElement("li");
  newTab.classList.add("tab");
  newTab.innerText = decName;
  newTab.addEventListener("click", () => loadNotesFromTab(name));
  window.addEventListener("click", (e) => {
    if (menuVisible) toggleMenu("hide");
  });

  newTab.addEventListener("contextmenu", (e) => {
    e.preventDefault();
    const origin = {
      left: e.pageX,
      top: e.pageY,
    };
    setPosition(origin, name);
    return false;
  });
  navEle.appendChild(newTab);
}

function loadTabs() {
  document.querySelectorAll(".tab").forEach((child) => {
    child.remove();
  });
  tabs.forEach((tab) => addTab(tab, tabData[tab]));
}

function addNote(tab, content) {
  tabData[tab].push(encryptData(content));
  fs.writeFileSync(path, JSON.stringify(tabData, 2, 2));
}

function insertDate() {
  if (tabs.length == 0) {
    alert("Make a new list first");
    return;
  }

  let d = new Date();
  let dayOfTheWeek = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
  }).format(d);
  let dateString = `${
    d.getMonth() + 1
  }/${d.getDate()}/${d.getFullYear()} - ${dayOfTheWeek}`;

  addNote(currentTab, dateString);
  loadNotesFromTab(currentTab);
}

const addNoteBtn = document.getElementById("addNoteBtnContainer");
const menuDeleteBtn = document.getElementById("menuDeleteBtn");
const menuRenameBtn = document.getElementById("menuRenameBtn");
const addTabBtn = document.getElementById("addTab");
const menu = document.querySelector(".menu");

function displayAddNote() {
  if (tabs.length == 0) {
    alert("Make a new list first");
    return;
  }

  let newNoteInput = document.createElement("textarea");
  newNoteInput.classList.add("note");
  newNoteInput.id = "newNote";
  newNoteInput.placeholder = "Type Here";
  newNoteInput.rows = 1;
  newNoteInput.addEventListener("keyup", (e) => {
    if (e.key == "Enter" && !e.shiftKey) {
      addNote(currentTab, newNoteInput.value);
      notesEle.removeChild(newNoteInput);
      loadNotesFromTab(currentTab);
    }
    if (e.key == "Escape") newNoteInput.remove();
    newNoteInput.style.height = "";
    newNoteInput.style.height = newNoteInput.scrollHeight + "px";
  });
  notesEle.appendChild(newNoteInput);
  newNoteInput.focus();
}

function displayAddTab() {
  let newTab = document.createElement("li");
  let newTabEnt = document.createElement("input");
  newTabEnt.placeholder = "Type Here";
  newTab.appendChild(newTabEnt);
  navEle.appendChild(newTab);
  newTabEnt.addEventListener("keydown", (e) => {
    if (e.key == "Escape") {
      navEle.removeChild(newTab);
    } else if (e.key == "Enter") {
      let name = encryptData(newTabEnt.value);
      tabData[name] = [];
      tabs.push(name);
      fs.writeFileSync(path, JSON.stringify(tabData, 2, 2));
      loadNotesFromTab(name);
      newTab.remove();
      loadTabs();
    }
  });
  newTabEnt.focus();
}

addNoteBtn.addEventListener("click", () => {
  displayAddNote();
});

// handle keyboard shortcuts
document.addEventListener("keydown", (e) => {
  if (!e.ctrlKey) return;
  switch ([e.key, e.shiftKey].toString()) {
    // Add Tab //
    case "N,true":
      displayAddTab();
      break;
    // Add note //
    case "n,false":
      // check if new note input already exists
      if (document.getElementById("newNote")) {
        // if so then save the value of the existing one and remove it
        let newNoteInput = document.getElementById("newNote");
        addNote(currentTab, newNoteInput.value);
        notesEle.removeChild(newNoteInput);
        loadNotesFromTab(currentTab);
      }

      displayAddNote();
      break;
    // Toggle Always on Top //
    case "A,true":
      ipcRenderer.send("toggleAlwaysOnTop");
      break;
    // Show Instructions //
    case "h,false":
      ipcRenderer.send("showInstructions");
      break;
    // Insert Date //
    case "d,false":
      insertDate();
      break;
    // Open File //
    case "o,false":
      ipcRenderer.send("openFile");
      location.reload();
      break;
  }
});

addTabBtn.addEventListener("click", () => {
  displayAddTab();
});

let menuVisible = false;

function toggleMenu(command) {
  menu.style.display = command === "show" ? "block" : "none";
  menuVisible = !menuVisible;
}

function setPosition({ top, left }, name) {
  menu.style.left = `${left}px`;
  menu.style.top = `${top}px`;
  menuDeleteBtn.addEventListener("click", () => {
    delete tabData[name];
    tabs = Object.keys(tabData);
    fs.writeFileSync(path, JSON.stringify(tabData, 2, 2));
    loadTabs();
  });
  toggleMenu("show");
}
