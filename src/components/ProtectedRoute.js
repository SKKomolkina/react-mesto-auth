import React from 'react';
import { Route, Redirect } from 'react-router-dom';

import Footer from './Footer';

function ProtectedRoute({ component: Component, ...props }) {
    return (
        <Route>
            <>
                {
                    props.isLoggedIn ? <Component {...props} /> : <Redirect to="/sign-in" />
                }

                <Footer />
            </>
        </Route>
    )
}

export default ProtectedRoute;