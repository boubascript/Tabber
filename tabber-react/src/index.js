import React from 'react';
import ReactDOM from 'react-dom';
import { Route, HashRouter, Switch} from 'react-router-dom'

import './index.css';
import App from './App';
import Tabber from './Tabber';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(
    <HashRouter>
        <Switch>
            <Route path="/tabber" component={Tabber}/>
            <Route component={App}/>
        </Switch>
    </HashRouter>
    , document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
