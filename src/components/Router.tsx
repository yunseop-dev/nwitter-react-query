import { HashRouter as Router, Route, Switch } from "react-router-dom";
import useUser from "../hooks/queries/useUser";
import Auth from "../pages/auth";
import Home from "../pages/home";
import Profile from "../pages/profile";
import Navigation from "./Navigation";

const AppRouter = () => {
  const { isLoggedIn } = useUser()
  return (
    <Router>
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
    </Router>
  );
};

export default AppRouter;
