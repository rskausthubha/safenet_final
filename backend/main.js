const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const fs = require('fs')
const { PythonShell } = require('python-shell')

const isWin = (process.platform === "win32") ? true : false
const isLinux = (process.platform === "linux") ? true : false
const isMac = (process.platform === "darwin") ? true : false

let mainWindow

const createWindow = () => {
    mainWindow = new BrowserWindow({
        center: true,
        autoHideMenuBar: true,
        show: false,
        minWidth: 1000,
        minHeight: 650,
        icon: path.join(__dirname, 'dist/img/safenet-upscaled-logo.png'),
        webPreferences: {
            preload: path.join(__dirname, './preload.js')
        },
    })

    mainWindow.maximize()
    mainWindow.show()

    mainWindow.loadFile(path.join(__dirname, 'dist/index.html'))
}

// --------------- Communication between electron and react ---------------

ipcMain.on('inputFile', (_, data) => {
    console.log(data)

    fs.copyFileSync(data.path, data.name)

    sendFile(data.name)
})

const sendFile = async (fileName) => {
    let options = {
        mode: "text",
        args: JSON.stringify(fileName),
        pythonPath: path.join(__dirname, 'python-env/Scripts/python.exe')
    }

    try {
        const result = await PythonShell.run(path.join(__dirname, 'prediction.py'), options)

        console.log(result[0])

        mainWindow.webContents.send('predictedResult', result)
    } catch (err) {
        console.error(err)
    }

    fs.unlink(fileName, (err) => {
        if (err) {
            console.error(err)

            return
        }
    })
}

// --------------- App related code ---------------

app.whenReady().then(() => {
    createWindow()

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow()
        }
    })
})

app.on('window-all-closed', () => {
    if (!isMac) {
        app.quit()
    }
})
