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
    const result = await ipcRenderer.invoke('add-doc-channel', 'SatishNew123')
    console.log("<add result app> : " + JSON.stringify(result));
  }
  getIpcData = async () => {
    const result = await ipcRenderer.invoke('get-all-docs-channel')
    console.log("<get result app> : " + JSON.stringify(result));
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
          >Add Doc
          </Button>
        </Box>

        <Box textAlign='center'>
          <Button variant='contained'
            onClick={e => {
              this.getIpcData();
            }}
            style={{
              marginTop: '5em',
            }}
          >Get All Docs
          </Button>
        </Box>
      </div>
    );
  }
}

export default App;
