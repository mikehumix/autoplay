const electron = require('electron')
const app = electron.app
const BrowserWindow = electron.BrowserWindow

//定义窗口菜单
const Menu = electron.Menu
let template = [
	{
		label: '音乐',
		click: function () {
			mainWindow.loadURL(url.format({
				pathname: path.join(__dirname, 'app/index.html'),
				protocol: 'file:',
				slashes: true
			}))
		}
	},
	{
		label: '设置',
		click: function () {
			mainWindow.loadURL(url.format({
				pathname: path.join(__dirname, 'app/setting.html'),
				protocol: 'file:',
				slashes: true
			}))
		}
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
  mainWindow = new BrowserWindow({width: 402, height: 800,center:true,resizable:false})

  // and load the index.html of the app.
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'app/index.html'),
    protocol: 'file:',
    slashes: true
  }))

  // 开发者工具开启
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