import React from 'react';
import ReactDOM from 'react-dom';

import * as serviceWorker from './serviceWorker';
import 'react-mdl/extra/material.css';
import 'react-mdl/extra/material.js';
import './static/css/index.scss';
import { Route, Link, BrowserRouter as Router , Redirect} from 'react-router-dom';
import AppComponent from './components/AppComponent'
import Login from './components/Login'
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import RadarDataService from "./components/RadarDataService";
import javaJSON from "./components/java-radar";

const routing = (
    <Router>
        <div>
            <PublicRoute restricted={true} path="/login" component={Login} />
            <ProtectedRoute exact path="/" component={AppComponent} />



        </div>
    </Router>
)

ReactDOM.render(routing, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
