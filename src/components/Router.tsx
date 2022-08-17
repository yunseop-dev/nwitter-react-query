import { HashRouter as Router, Route, Switch } from "react-router-dom";
import { QueryParamProvider } from "use-query-params";
import { ReactRouter5Adapter } from 'use-query-params/adapters/react-router-5';
import Auth from "../pages/auth";
import Home from "../pages/home";
import Profile from "../pages/profile";
import AuthRoute from "./AuthRoute";
import Navigation from "./Navigation";

const AppRouter = () => {
  return (
    <Router>
      <QueryParamProvider adapter={ReactRouter5Adapter}>
        <Navigation />
        <Switch>
          <AuthRoute exact path="/">
            <Home />
          </AuthRoute>
          <AuthRoute exact path="/profile">
            <Profile />
          </AuthRoute>
          <Route exact path="/signin">
            <Auth />
          </Route>
        </Switch>
      </QueryParamProvider>
    </Router>
  );
};

export default AppRouter;
