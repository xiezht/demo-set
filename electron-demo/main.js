const { app, globalShortcut, ipcMain, BrowserWindow, Menu } = require('electron')
const isMac = process.platform === 'darwin'

const menuTemplate = require('./menu-template.js')

let mainWin = null

function createWindow() {
  mainWin = new BrowserWindow({
    width: 800,
    height: 600,
    // frame: false,
    webPreferences: {
      nodeIntegration: true,
    }
  })
  mainWin.loadFile('index.html')
  mainWin.setMenu(Menu.buildFromTemplate(menuTemplate))
  // mainWin.excludedFromShownWindowsMenu = true
  // Menu.setApplicationMenu(Menu.buildFromTemplate(menuTemplate))
  // mainWin.webContents.openDevTools()
  mainWin.on('closed', () => {
    mainWin = null
  })
}


function listenMsg() {
 ipcMain.on('async-msg', (event, arg) => {
   console.log('async-comming', arg)
   event.sender.send('async-reply', 'aysnc-pong')
 })
 ipcMain.on('sync-msg', (event, arg) => {
   console.log('sync-comming', arg)
   event.returnValue = "pong"
 })
}

app.on('ready', () => {
  createWindow()
  // listenMsg()
  // globalShortcut.register('Control+R', () =>{
  //   mainWin.reload()
  // })
})

app.on('window-all-closed', () => {
  app.quit()
})
