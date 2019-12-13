const electron = require('electron');
const fs = require('fs')
const path = require('path');
const menuTemplate = require('./menu-template')
const { remote } = electron
const { Menu } = remote

const btn = document.getElementById('snapshot-btn')
const section = document.getElementById('content')

function askNotificationPermission() {
  function handlePermission(permission) {
    if (!('permission' in Notification)) {
      Notification.permission = permission
    }
    if (Notification.permission === 'denied'
      || Notification.permission === 'default') {
      
    }
  }
}

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
  // if (!window.Notification) {
  //   alert('Not surpport')
  //   return
  // }

  // if (Notification.permission === 'granted') {
  //   let notify = new Notification('title', {
  //     body: '提示内容'
  //   })
  // } else if (Notification.permission !== 'denied') {
  //   Notification.requestPermission(status => {
  //     switch(status) {
  //       case 'granted':
          
  //     }
  //   })
  // }
}

btn.addEventListener('click', showUserData)

// Menu.setApplicationMenu(Menu.buildFromTemplate(menuTemplate))
// module.exports = {
//   showUserData
// }
