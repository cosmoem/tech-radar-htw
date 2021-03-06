import React from "react";
import { Route, Redirect,withRouter } from "react-router-dom";
import { isAuth } from '../services/userService';

const ProtectedRoute = ({component: Component,...rest}) => {
    return (
        <Route
            {...rest}
            render={props => {
                if (isAuth()) {
                    return <Component {...props} />;
                } else {
                    return (
                        <Redirect to='/login'/>

                    );
                }
            }}
        />
    );
};
export default withRouter(ProtectedRoute);