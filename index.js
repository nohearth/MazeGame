const { app, BrowserWindow } = require('electron')

let window
let url = `file://${__dirname}/./static/index.html`
app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'win32') {
    app.quit()
  }
})

function createWindow() {
  window = new BrowserWindow({
    height: 450,
    width: 520
  })

  window.loadURL(url)

  /*window.on('closed', () => {
    window=null
  })*/
}