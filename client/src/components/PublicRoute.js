import React from 'react';
import {Route, Redirect} from 'react-router-dom';
import { isAuth } from '../services/userService';

const PublicRoute = ({component: Component, restricted, ...rest}) => {
    return (
        <Route {...rest} render={props => (
            isAuth() && restricted ?
                <Redirect to='/' />
                : <Component {...props} />
        )} />
    );
};

export default PublicRoute;