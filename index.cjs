const { app, BrowserWindow, contextBridge, ipcMain, ipcRenderer } = require('electron');
const path = require('node:path'); // Change this line

let mainWindow;

function createWindow() {
	mainWindow = new BrowserWindow({
		width: 800,
		height: 600,
		alwaysOnTop: true,
		autoHideMenuBar: false,
		frame: true,
		fullscreen: true,
		webPreferences: {
			contextIsolation: true,
			enableRemoteModule: false,
			preload: path.join(__dirname, 'preload.cjs') // Use a preload script
		}
	});

	// Open the DevTools.
	mainWindow.webContents.openDevTools();
	mainWindow.on('closed', () => {
		mainWindow = null;
		app.quit();
	});

	mainWindow.loadURL('http://localhost:5173/');
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('activate', () => {
	if (mainWindow === null) {
		createWindow();
	}
});

// IPC listener
ipcMain.on('sync-database', async (event, arg) => {
	// Handle the sync database request
	console.log(arg); // Log the argument received from Svelte
	// Perform database sync logic here
	const desktopPath = app.getPath('documents');

	console.log('Desktop Path:', desktopPath);

	event.reply('sync-database-response', 'Database synced successfully!');
});
