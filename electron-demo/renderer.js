const { remote, ipcRenderer } = require('electron')
const marked = require('marked')
// 获取主进程模块的引用，通过该应用调用主进程暴露给外部的方法
const mainProgress = remote.require('./main.js')
// 获取当前窗口的自身引用
const currentWindow = remote.getCurrentWindow();

const markdownView = document.getElementById('markdown')
const htmlView = document.getElementById('html')

// buttons
const newFileButton = document.getElementById('new-file')
const openFileButton = document.getElementById('open-file')
const saveMarkdownButton = document.getElementById('save-markdown')
const revertButton = document.getElementById('revert')
const saveHtmlButton = document.getElementById('save-html')
const showFileButton = document.getElementById('show-file')
const openInDefault = document.getElementById('open-in-default')

const renderMarkdownToHtml = (markdown) => {
  htmlView.innerHTML = marked(markdown, { sanitize: true })
}

markdownView.addEventListener('keyup', (event) => {
  const currentContent = event.target.value
  renderMarkdownToHtml(currentContent)
})

newFileButton.addEventListener('click', () => {
  mainProgress.createWindow()
})

openFileButton.addEventListener('click', () => {
  mainProgress.getFileFromUser(currentWindow)
})

ipcRenderer.on('file-opened', (event, file, content) => {
  markdownView.value = content
  renderMarkdownToHtml(content)
})
