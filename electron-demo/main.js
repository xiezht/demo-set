const { app, BrowserWindow } = require('electron')
let mainWin
function createWindow() {
  mainWin = new BrowserWindow({
    width: 800,
    height: 600,
    frame: false,
    webPreferences: {
      nodeIntegration: true,
    }
  })
  mainWin.loadURL('https://baidu.com')
  // mainWin.webContents.openDevTools()
  mainWin.on('closed', () => {
    mainWin = null
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  app.quit()
})

app.on('activate', () => {
  createWindow()
})

