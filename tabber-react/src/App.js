import React from 'react';
import {Link} from 'react-router-dom';
import Button from '@material-ui/core/Button';

import './App.css';

export default function App() {
  return (
    <div className="App">
      <header className="App-header">
        <p>
          Tabber React Popup soon come !!!
        </p>
        <Link to="/tabber" target="_blank">
          <Button variant="contained" color="primary">
            Save Tab
          </Button>
        </Link>
      </header>
    </div>
  );
}
