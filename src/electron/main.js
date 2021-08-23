const electron = require('electron');
const ipcMain = require('electron').ipcMain;

const PouchDB = require('pouchdb')
PouchDB.plugin(require('pouchdb-find'));
const localPouchDB = new PouchDB('src/data');
const { v4: uuidv4 } = require('uuid');


async function addToPouchDB(arg) {
    let doc = {
        _id: uuidv4(),
        data: {
            name: arg
        }
    }

    let result = await localPouchDB.put(doc);
    return result;
}

ipcMain.handle('add-doc-channel', async function (event, arg) {
    return await addToPouchDB(arg);
});

async function getAllDocs() {
    return await localPouchDB.allDocs({
        include_docs: true,
    });
}

ipcMain.handle('get-all-docs-channel', async function (event, arg) {
    return await getAllDocs();
});

const remoteDB = new PouchDB("http://localhost:4985/sample-db", {
    auth: {
        username: 'test_user',
        password: 'test_user@123'
    }
})


localPouchDB.sync(remoteDB, { live: true, retry: true })
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

const app = electron.app
const BrowserWindow = electron.BrowserWindow

const path = require('path')

const isDev = process.env.ELECTRON_IS_DEV;

let mainWindow

function createWindow() {
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
    mainWindow.loadURL(
        isDev
            ? 'http://localhost:3000' // Dev server ran by react-scripts
            : `file://${path.join(__dirname, '/build/index.html')}` // Bundled application
    );

    mainWindow.on('closed', function () {
        mainWindow = null
    })
}

app.on('ready', createWindow)
app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', function () {
    if (mainWindow === null) {
        createWindow()
    }
})
