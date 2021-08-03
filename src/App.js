import React, { Component } from 'react';
import {
  Button,
  Box,
} from '@material-ui/core';

const electron = window.require('electron');
const { ipcRenderer } = electron;
// access the local file system; HOWEVER, `remote.require` is considered harmful
// https://medium.com/@16cards/remote-require-is-considered-harmful-and-should-be-avoided-in-general-8282567a851
// const fs = electron.remote.require('fs');

class App extends Component {
  componentDidMount() {
    // Electron IPC example
    ipcRenderer.on('manipulatedData', function (event, arg) {
      console.log(arg);
    });
  }
  componentWillUnmount() {
    // Electron IPC example
    ipcRenderer.removeAllListeners('manipulatedData');
  }
  sendIpcData = async () => {
    const result = await ipcRenderer.invoke('user-data', 'Satish')
    console.log("<result app> : " + JSON.stringify(result));
  }
  render() {
    return (
      <div className="App">
        <header className="App-header">
        </header>
        <Box textAlign='center'>
          <Button variant='contained'
            onClick={e => {
              this.sendIpcData();
            }}
            style={{
              marginTop: '16em',
            }}
          >Send IPC Data
          </Button>
        </Box>
      </div>
    );
  }
}

export default App;
