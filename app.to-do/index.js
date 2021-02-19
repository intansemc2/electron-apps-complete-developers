const electron = require('electron');
const { platform } = require('os');
const path = require('path');

const { app, BrowserWindow, Menu, ipcMain } = electron;

let mainWindow;
let newToDoWindow;

let menuTemplate = [
    {
        label: 'File',
        submenu: [
            {
                label: 'New ToDo',
                accelerator: 'N',
                click() {
                    if (!newToDoWindow) createNewToDoWindow();
                },
            },
            {
                label: 'Clear All',
                accelerator: 'Backspace',
                click() {
                    mainWindow.webContents.send('todo:clear');
                },
            },
            {
                label: 'Quit',
                accelerator: 'Alt+F4',
                click() {
                    app.quit();
                },
            },
        ],
    },
];

app.on('ready', () => {
    mainWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true,
        },
    });
    mainWindow.loadURL(`file://${path.resolve('./index.html')}`);
    mainWindow.on('closed', () => app.quit());

    const mainMenu = Menu.buildFromTemplate(menuTemplate);
    Menu.setApplicationMenu(mainMenu);
});

function createNewToDoWindow() {
    newToDoWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true,
        },
        width: 400,
        height: 200,
    });
    newToDoWindow.loadURL(`file://${path.resolve('./new-to-do.html')}`);
    newToDoWindow.on('close', () => (newToDoWindow = null));
}

ipcMain.on('todo:add', (event, newToDo) => {
    mainWindow.webContents.send('todo:add', newToDo);
    newToDoWindow.close();
});

if (process.env.NODE_ENV != 'production') {
    menuTemplate.push({
        label: 'DevTool',
        submenu: [
            {
                label: 'Reload',
                accelerator: 'F5',
                click(item, focusedWindow) {
                    focusedWindow.reload();
                },
            },
            {
                label: 'Toggle Dev Tool',
                accelerator: 'F12',
                click(item, focusedWindow) {
                    focusedWindow.toggleDevTools();
                },
            },
        ],
    });
}
