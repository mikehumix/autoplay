const electron = require('electron')
const app = electron.app
const BrowserWindow = electron.BrowserWindow
const ipcMain = electron.ipcMain

app.commandLine.appendSwitch("--disable-http-cache");

//定义窗口菜单
const Menu = electron.Menu
let template = [
	{
		label: '音乐',
		click: function () {

      mainWindow.webContents.send('index')
			// mainWindow.loadURL(url.format({
			// 	pathname: path.join(__dirname, 'app/index.html'),
			// 	protocol: 'file:',
			// 	slashes: true
			// }))
		}
	},
	{
		label: '设置',
		click: function () {
      mainWindow.webContents.send('setting')
			// mainWindow.loadURL(url.format({
			// 	pathname: path.join(__dirname, 'app/setting.html'),
			// 	protocol: 'file:',
			// 	slashes: true
			// }))
		}
	},{
    label: '查看',
    submenu: [{
      label: '重载',
      accelerator: 'CmdOrCtrl+R',
      click: function (item, focusedWindow) {
        if (focusedWindow) {
          // 重载之后, 刷新并关闭所有的次要窗体
          if (focusedWindow.id === 1) {
            BrowserWindow.getAllWindows().forEach(function (win) {
              if (win.id > 1) {
                win.close()
              }
            })
          }
          focusedWindow.reload()
        }
      }
    }, {
      label: '切换开发者工具',
      accelerator: (function () {
        if (process.platform === 'darwin') {
          return 'Alt+Command+I'
        } else {
          return 'Ctrl+Shift+I'
        }
      })(),
      click: function (item, focusedWindow) {
        if (focusedWindow) {
          focusedWindow.toggleDevTools()
        }
      }
    }]
  }
]

const path = require('path')
const url = require('url')

// 全局window
let mainWindow = null

const shouldQuit = app.makeSingleInstance((commandLine, workingDirectory) => {
  // Someone tried to run a second instance, we should focus our window.
  if (mainWindow) {
    if (mainWindow.isMinimized()) mainWindow.restore()
    mainWindow.focus()
  }
})

if (shouldQuit) {
  app.quit()
}

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({width: 416, height: 800,center:true,resizable:true})
  mainWindow.webContents.send('bugs')
  // and load the index.html of the app.
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'app/index.html'),
    protocol: 'file:',
    slashes: true
  }))

  //开发者工具开启
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    mainWindow = null
  })
}

app.on('ready', function () {
	createWindow();
	const menu = Menu.buildFromTemplate(template)
	Menu.setApplicationMenu(menu)
})

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})