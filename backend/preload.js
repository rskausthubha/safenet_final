const { IpcRendererEvent, ipcRenderer, contextBridge, contextBridge } = require('electron')

contextBridge.exposeInMainWorld('electron', {
    sendFile: (fileName) => {
        ipcRenderer.send('inputFile', fileName)
    },
    getResult: (res) => {
        ipcRenderer.on('predictedResult', res)
    }
})
