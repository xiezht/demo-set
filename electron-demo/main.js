const fs = require('fs')
const path = require('path')
const { app, dialog, BrowserWindow } = require('electron')
const isMac = process.platform === 'darwin'

const windows = new Set()
const openFiles = new Map()


// 创建新窗口
const createWindow = exports.createWindow = () => {
  let x = 0
  let y = 0
  const currentWindow = BrowserWindow.getFocusedWindow()
  if (currentWindow) {
    const { currentWindowX, currentWindowY } = currentWindow.getPosition()
    x = currentWindowX + 10
    y = currentWindowY + 10
  }

  let newWindow = new BrowserWindow({
    show: false, x, y,
    // fullscreen: true,
    webPreferences: {
      nodeIntegration: true
    }
  })
  newWindow.loadFile('./index.html')
  // window加载完成后再显示窗口
  newWindow.once('ready-to-show', () => {
    newWindow.show()
    // newWindow.webContents.openDevTools()
  })
  newWindow.on('close', event => {
    // 仅macOS有效
    if (newWindow.isDocumentEdited()) {
      event.preventDefault();
      const result = dialog.showMessageBoxSync(newWindow, {
        type: 'warning',
        title: 'Quit With Unsaved Changes',
        message: 'Changes will be lost',
        buttons: ['Quit Anyway', 'Cancel'],
        defaultId: 0,
        cancelId: 1
      })
      if (result === 0) newWindow.destroy()
    }
  })
  newWindow.on('closed', () => {
    stopWatchingFile(newWindow)
    windows.delete(newWindow)
    newWindow = null
  })
  windows.add(newWindow)
  return newWindow
}

// 弹窗，选择文件，获取文件名
const getFileFromUser = exports.getFileFromUser = (targetWindow) => {
  const files = dialog.showOpenDialogSync(targetWindow, {
    properties: ['openFile'],
    filters: [
      // { name: 'Text Files', extensions: ['txt']},
      { name: 'Markdown Files', extensions: ['md', 'markdown'] }
    ]
  })
  if (files) openFile(targetWindow, files[0])
}

// 打开文件，并将文件内容回传回渲染进程
const openFile = exports.openFile = (targetWindow, file) => {
  console.log('OPENING', file)
  fs.readFile(file, (err, data) => {
    if (err) {
      console.error('READ_FAIL', err)
      return
    }
    app.addRecentDocument(file)
    startWatchingFile(targetWindow, file)
    targetWindow.webContents.send('file-opened', file, data.toString('utf8'))
  })
}

const saveHtml = exports.saveHtml = (targetWindow, content, filePath) => {
  const newFile = dialog.showSaveDialogSync(targetWindow, {
    title: 'Save HTML',
    defaultPath: path.dirname(filePath) || app.getPath('documents'),
    filters: [
      { name: 'HTML Files', extensions: ['html', 'htm'] }
    ]
  })
  if (!newFile) return
  fs.writeFile(newFile, content, (err) => {
    if (err) console.error(err)
  })
}

const saveMarkdown = exports.saveMarkdown = (targetWindow, content, filePath) => {
  if (filePath) {
    fs.writeFile(filePath, content, (err) => {
      if (err) console.error('UPDATE_FAIL', err)
    })
    return
  }
  const newFile = dialog.showSaveDialogSync(targetWindow, {
    title: 'Sava Markdown',
    defaultPath: app.getPath('documents'),
    filters: [
      { extensions: ['md', 'markdown'] }
    ]
  })
  if (newFile) {
    fs.writeFile(newFile, content, (err) => {
      if (err)  {
        console.error('CREATE_FAIL', err)
        return
      }
      openFile(targetWindow, newFile)
    })
  }
}

// 监听文件变动
const startWatchingFile = (targetWindow, file) => {
  stopWatchingFile(targetWindow)
  const watcher = fs.watch(file, (event) => {
    console.log('FILE_EVENT', event)
    if (event === 'change') {
      const content = fs.readFileSync(file, { encoding: 'utf8' })
      targetWindow.webContents.send('file-changed', file, content)
    }
  })
  console.log('WATCHING', file)
  openFiles.set(targetWindow, watcher)
}
const stopWatchingFile = (targetWindow) => {
  if (openFiles.has(targetWindow)) {
    console.log('STOP_WATCHING')
    openFiles.get(targetWindow).close()
    openFiles.delete(targetWindow)
  }
}

// app启动成功
app.on('ready', () => {
  createWindow()
})


app.on('window-all-closed', () => {
  if(isMac) return false
})

app.on('activate', (event, hasVisibleWindows) => {
  if (!hasVisibleWindows) createWindow()
})

app.on('will-finish-launching', () => {
  app.on('open-file', (event, file) => {
    const win = createWindow()
    win.once('ready-to-show', () => {
      openFile(win, file)
    })
  })
})

