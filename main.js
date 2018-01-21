const electron = require('electron');
var pnd = require('./pumpndump.js');
// Module to control application life.
const app = electron.app
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow;

const path = require('path');
const url = require('url');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow () {
  // Create the browser window.
  //mainWindow = new BrowserWindow({width: 800, height: 600})
  mainWindow = new BrowserWindow({
    width: 1350,
    height: 800,
    minWidth: 1250,
    minHeight: 200,
    backgroundColor: '#312450',
    // show: false,
    icon: path.join(__dirname, '256_icon.ico')
  });

  // and load the index.html of the app.
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'public/login.html'),
    protocol: 'file:',
    slashes: true
  }));

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});

/////////////////////////
// Pump Dump API
////////////////////////
var apiData = {}//store api data here
const {ipcMain} = require('electron');//allow server&client to talk
//////////////////////////////
//On Obtain User API Key
ipcMain.on('apiKey', (event, keys) => {
  //set API Keys
  pnd.init(keys.public, keys.secret);
  //when finished tell client
  event.sender.send('validKey', '');
  
});
//////////////////////////////
//On Client Ready For Data
ipcMain.on('readyForData', (event, arg) => {
  pnd.getNewCoins(function(coins) {
    apiData.coins = coins;
  });
  //load exsisting coins
  pnd.getBalance(function(balance){
    apiData.balances = balance;//update data to be sent
    //load prices
    pnd.getPrices(function(prices){
      apiData.prices = prices;//updata data to be sent
      event.sender.send('apiData', apiData);//send api data
    });
  });
});
