import { useMemo } from "react";
import { HashRouter as Router, Route, Switch } from "react-router-dom";
import { QueryParamProvider } from "use-query-params";
import { ReactRouter5Adapter } from 'use-query-params/adapters/react-router-5';
import { authService } from "../fbase";
import { useAuthUser } from "../hooks/quries/useAuthUser";
import Auth from "../routes/Auth";
import Home from "../routes/Home";
import Profile from "../routes/Profile";
import Navigation from "./Navigation";

const AppRouter = () => {
  const user = useAuthUser(['user'], authService);
  const isLoggedIn = useMemo(() => user.data !== null, [user.data]);
  return (
    <Router>
      <QueryParamProvider adapter={ReactRouter5Adapter}>
        {isLoggedIn && <Navigation />}
        <Switch>
          {isLoggedIn ? (
            <div
              style={{
                maxWidth: 890,
                width: "100%",
                margin: "0 auto",
                marginTop: 80,
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Route exact path="/">
                <Home />
              </Route>
              <Route exact path="/profile">
                <Profile />
              </Route>
            </div>
          ) : (
            <Route exact path="/">
              <Auth />
            </Route>
          )}
        </Switch>
      </QueryParamProvider>
    </Router>
  );
};

export default AppRouter;
