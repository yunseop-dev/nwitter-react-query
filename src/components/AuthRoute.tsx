import { Route } from 'react-router';
import { Redirect } from 'react-router-dom';
import useUser from '../hooks/queries/useUser';

const AuthRoute = ({ children, ...rest }: any) => {
    const { isLoggedIn } = useUser()

    return (
        <Route
            {...rest}
            render={({ location }) =>
                isLoggedIn ? (
                    children
                ) : (
                    <Redirect
                        to={{
                            pathname: "/signin",
                            state: { from: location }
                        }}
                    />
                )
            }
        />
    )
};

export default AuthRoute;
