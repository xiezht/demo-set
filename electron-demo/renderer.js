const { remote, ipcRenderer } = require('electron')
const path = require('path')
const marked = require('marked')
// 获取主进程模块的引用，通过该应用调用主进程暴露给外部的方法
const mainProgress = remote.require('./main.js')
const resetDragEvent = require('./reset-drag-event')

// 获取当前窗口的自身引用
const currentWindow = remote.getCurrentWindow()
const isMac = process.platform === 'darwin'

const markdownView = document.getElementById('markdown')
const htmlView = document.getElementById('html')

// buttons
const newFileButton = document.getElementById('new-file')
const openFileButton = document.getElementById('open-file')
const saveMarkdownButton = document.getElementById('save-markdown')
const revertButton = document.getElementById('revert')
const saveHtmlButton = document.getElementById('save-html')
const showFileButton = document.getElementById('show-file')
const openInDefaultButton = document.getElementById('open-in-default')

// 文件路径
let filePath = null
// 文件初始内容
let originalContent = ''

const updaterUserInterface = (isEdited) => {
  let title = 'Markdown Editor'
  if (filePath) {
    title = `${path.basename(filePath)} - ${title}`
  }
  if (isEdited) {
    title = `${title} (Edited)`
  }
  currentWindow.setTitle(title)
  if (isMac) {
    currentWindow.setDocumentEdited(isEdited)
  }
  // console.log(saveMarkdownButton.disabled)
  saveMarkdownButton.disabled = !isEdited
  revertButton.disabled = !isEdited
}

const renderMarkdownToHtml = (markdown) => {
  htmlView.innerHTML = marked(markdown, { sanitize: true })
}

// 获取Drag文件的元数据信息
const getDraggedFile = (event) => {
  return event.dataTransfer.items[0]
}

// Drag文件释放后，可以获取到文件信息
const getDroppedFile = (event) => {
  return event.dataTransfer.files[0]
}

const validateFileSupported = (file) => {
  if (!file || !file.name || !file.name) return false;
  return ['text/markdown'].includes(file.type) || /.md$/.test(file.name)
}

markdownView.addEventListener('keyup', (event) => {
  const currentContent = event.target.value
  renderMarkdownToHtml(currentContent)
  const isEdited = (currentContent !== originalContent)
  updaterUserInterface(isEdited)
})

// markdownView.addEventListener('dragover', (event) => {
//   const file = getDraggedFile(event)
//   // debugger
//   if (validateFileSupported(file)) {
//     markdownView.classList.add('drag-over')
//   } else {
//     markdownView.classList.add('drag-error')
//   }
// })

markdownView.addEventListener('drop', event => {
  const file = getDroppedFile(event)
  if (validateFileSupported(file)) {
    mainProgress.openFile(currentWindow, file.path)
  } else {
    alert('Not supported')
  }
  // markdownView.classList.remove('drag-over')
  // markdownView.classList.remove('drag-error')
})

markdownView.addEventListener('dragleave', (event) => {
  markdownView.classList.remove('drag-over')
  markdownView.classList.remove('drag-error')
})

newFileButton.addEventListener('click', () => {
  mainProgress.createWindow()
})

openFileButton.addEventListener('click', () => {
  mainProgress.getFileFromUser(currentWindow)
})

saveMarkdownButton.addEventListener('click', () => {
  const currentContent = markdownView.value
  mainProgress.saveMarkdown(currentWindow, currentContent, filePath)
})

saveHtmlButton.addEventListener('click', () => {
  const html = htmlView.innerHTML
  // console.log(html)
  mainProgress.saveHtml(currentWindow, html, filePath || '')
})

ipcRenderer.on('file-opened', (event, file, content) => {
  // console.log('RENDERER', 'FILE-OPENED', file, content)
  console.log('RENDER_RECV', content)
  if (currentWindow.isDocumentEdited() || originalContent !== content) {
    const result = remote.dialog.showMessageBoxSync(currentWindow, {
      type: 'warning',
      title: 'Overwrite Current Unsaved Changes?',
      buttons: ['Yes', 'Cancel'],
      defaultId: 0,
      cancelId: 1,
    })
    if (result) return
  }
  renderFile(file, content)
})

ipcRenderer.on('file-changed', (event, file, content) => {
  const result = remote.dialog.showMessageBoxSync(currentWindow, {
    type: 'warning',
    title: 'Overwrite Current Unsaved Changes',
    buttons: ['Yes', 'Cancel'],
    defaultId: 0,
    cancelId: 1
  })
  renderFile(file, content)
})

const renderFile = (file, content) => {
  filePath = file
  originalContent = content
  markdownView.value = content
  currentWindow.setRepresentedFilename(file)
  renderMarkdownToHtml(content)
  updaterUserInterface()
}

resetDragEvent(window.document);
