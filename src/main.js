const electron = require( 'electron' );
const path = require( 'path' );
const url = require( 'url' );

// global reference to the main window
var win = null;

/**
 * Open and configure the main window of the application
 */
function activateWindow() {

    if ( win !== null ) {
        return;
    }

    win = new electron.BrowserWindow( {
        width: 1120,
        height: 680,
        webPreferences: {
            experimentalFeatures: false,
            nodeIntegration: true,
            webSecurity: true // required to open local images in browser
        }
    } );
    
    win.setMenu( null );

    //win.webContents.openDevTools();

    // and load the index.html of the app.
    win.loadURL( url.format( {
        pathname: path.join( __dirname, 'web', 'index.html' ),
        protocol: 'file:',
        slashes: true
    } ) );

    win.on( 'closed', () => {
        // close all existing windows
        electron.BrowserWindow.getAllWindows().forEach( w => w.close() );
        win = null;
    } );
}

/**
 * Quit aplication, except for OSX
 */
function closeWindow () {
    //if( process.platform !== 'darwin' ) {
        electron.app.quit();
    //}
}

/************************
 *** MAIN ENTRY POINT ***
 ************************/

// connect events
//electron.app.addEventListener(;
electron.app.on( 'ready', activateWindow );
electron.app.on( 'activate', activateWindow );
electron.app.on( 'window-all-closed', closeWindow );