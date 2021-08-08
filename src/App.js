import React, { Component } from 'react';
import {
  Button,
  Box,
} from '@material-ui/core';

const electron = window.require('electron');
const { ipcRenderer } = electron;

class App extends Component {
  componentDidMount() {
    ipcRenderer.on('response-channel', function (event, arg) {
      console.log(arg);
    });
  }
  componentWillUnmount() {
    ipcRenderer.removeAllListeners('response-channel');
  }
  sendIpcData = async () => {
    const result = await ipcRenderer.invoke('request-channel', 'Satish')
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
