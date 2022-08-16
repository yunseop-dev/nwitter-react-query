import { HashRouter as Router, Route, Switch } from "react-router-dom";
import useUser from "../hooks/queries/useUser";
import Auth from "../pages/auth";
import Home from "../pages/home";
import Profile from "../pages/profile";
import AuthRoute from "./AuthRoute";
import Navigation from "./Navigation";

const AppRouter = () => {
  const { isLoggedIn } = useUser()
  return (
    <Router>
      {isLoggedIn && <Navigation />}
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
    </Router>
  );
};

export default AppRouter;
