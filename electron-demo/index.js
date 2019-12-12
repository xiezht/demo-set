const electron = require('electron');
const fs = require('fs')
const path = require('path');
const menuTemplate = require('./menu-template')
const { remote } = electron
const { Menu } = remote

const btn = document.getElementById('snapshot-btn')
const section = document.getElementById('content')


function showUserData() {
  console.log('渲染进程')
  // const dataPath = path.join(__dirname, 'user-data.json')
  // if (!section) return

  /**文件读取 */
  // fs.readFile(dataPath, (err, data) => {
  //   if (err) return
  //   section.innerText = data
  // })

  /**同步通信 */
  // console.log(
  //   ipcRenderer.sendSync('sync-msg', 'ping')
  // );

  /**异步通信 */
  // ipcRenderer.send('async-msg', 'async-ping')
  // ipcRenderer.on('async-reply', (event, arg) => {
  //   console.log('异步响应', arg)
  // })
}

btn.addEventListener('click', showUserData)

// Menu.setApplicationMenu(Menu.buildFromTemplate(menuTemplate))
// module.exports = {
//   showUserData
// }
