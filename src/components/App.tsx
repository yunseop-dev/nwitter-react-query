import { useMemo } from "react";
import AppRouter from "./Router";
import { authService } from "../fbase";
import { useAuthUser } from "../hooks/quries/useAuthUser";

function App() {
  const user = useAuthUser(['user'], authService);
  const isLoggedIn = useMemo(() => user.isSuccess && user.data !== null, [user.data, user.isSuccess]);

  return (
    <AppRouter
      isLoggedIn={isLoggedIn}
    />
  );
}

export default App;
