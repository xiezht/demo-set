const { remote, ipcRenderer } = require('electron')
const path = require('path')
const marked = require('marked')
// 获取主进程模块的引用，通过该应用调用主进程暴露给外部的方法
const mainProgress = remote.require('./main.js')
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

markdownView.addEventListener('keyup', (event) => {
  const currentContent = event.target.value
  renderMarkdownToHtml(currentContent)
  const isEdited = (currentContent !== originalContent)
  updaterUserInterface(isEdited)
})

newFileButton.addEventListener('click', () => {
  mainProgress.createWindow()
})

openFileButton.addEventListener('click', () => {
  mainProgress.getFileFromUser(currentWindow)
})

saveHtmlButton.addEventListener('click', () => {
  const html = htmlView.innerHTML
  console.log(html)
  mainProgress.saveHtml(currentWindow, html, filePath || '')
})

ipcRenderer.on('file-opened', (event, file, content) => {
  console.log('RENDERER', 'FILE-OPENED', file, content)
  filePath = file
  originalContent = content
  markdownView.value = content
  currentWindow.setRepresentedFilename(file)
  renderMarkdownToHtml(content)
  updaterUserInterface()
})
