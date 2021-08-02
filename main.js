const electron = require('electron');
const ipcMain = require('electron').ipcMain;

const PouchDB = require('pouchdb')
PouchDB.plugin(require('pouchdb-find'));
const localSkuDB = new PouchDB('src/data');
const { v4: uuidv4 } = require('uuid');


async function addToPouchDB(arg) {
    let doc = {
        _id: uuidv4(),
        data: {
            name: arg,
            gender: "Male",
        }
    }

    let result = await localSkuDB.put(doc);
    return result;
}

// Electron IPC example
ipcMain.handle('user-data', async function (event, arg) {
    const result = await addToPouchDB(arg);
    console.log("<result main> : " + JSON.stringify(result));
    return result;
    //do child process or other data manipulation and name it manData
    // event.sender.send('manipulatedData', 'COOL info!');
});


const remoteDB = new PouchDB("http://localhost:4985/sku-db", {
    auth: {
        username: 'test_user',
        password: 'test_user@123'
    }
})


localSkuDB.sync(remoteDB, { live: true, retry: true })
    .on('change', function (change) {
    })
    .on('paused', function (info) {
    })
    .on('active', function (info) {
    })
    .on('denied', function (err) {
    })
    .on('complete', function () {
    })
    .on('error', function (err) {
    });

// Module to control application life.
const app = electron.app
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow

const path = require('path')
// const url = require('url')

const isDev = process.env.ELECTRON_IS_DEV;

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow() {
    // Create the browser window.
    mainWindow = new BrowserWindow(
        {
            width: 600,
            height: 600,
            x: 800,
            y: 100,
            webPreferences: {
                nodeIntegration: true,
                // enableRemoteModule: true,
                contextIsolation: false,
            }
        })

    mainWindow.webContents.openDevTools();
    // and load the index.html of the app.
    mainWindow.loadURL(
        isDev
            ? 'http://localhost:3000' // Dev server ran by react-scripts
            : `file://${path.join(__dirname, '/build/index.html')}` // Bundled application
    );
    // mainWindow.loadURL(url.format({
    //   pathname: path.join(__dirname, 'index.html'),
    //   protocol: 'file:',
    //   slashes: true
    // }))

    // Open the DevTools.
    // mainWindow.webContents.openDevTools()

    // Emitted when the window is closed.
    mainWindow.on('closed', function () {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null
    })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
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

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

