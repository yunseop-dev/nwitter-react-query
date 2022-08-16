import React, { useEffect } from 'react';
import { Route } from 'react-router';
import useUser from '../hooks/queries/useUser';
import useNweetHistory from '../hooks/useNweetHistory';

const AuthRoute = ({ component: Component, ...rest }: any) => {
    const history = useNweetHistory();
    const { isLoggedIn } = useUser()

    useEffect(() => {
        if (!isLoggedIn) {
            history.replaceWithSignInPage();
        }
    }, [history, isLoggedIn]);

    return (
        <Route
            {...rest}
            render={routeProps => (
                isLoggedIn
                    ? <Component {...routeProps} />
                    : <div>Loading...</div>
            )}
        />
    )
};

export default AuthRoute;
