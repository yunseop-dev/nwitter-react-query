import { useState } from "react";
import useSignUpMutation from "../hooks/mutations/useSignUpMutation";
import useSignInWithEmailAndPasswordMutation from "../hooks/mutations/useSignInWithEmailAndPasswordMutation";

const AuthForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newAccount, setNewAccount] = useState(true);
  const [error, setError] = useState("");
  const createUserWithEmailAndPassword = useSignUpMutation();
  const signInWithEmailAndPassword = useSignInWithEmailAndPasswordMutation();

  const onChange = (event: any) => {
    const {
      target: { name, value },
    } = event;
    if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    }
  };

  const onSubmit = async (event: any) => {
    event.preventDefault();
    try {
      if (newAccount) {
        // create newAccount
        await createUserWithEmailAndPassword.mutateAsync({
          email,
          password
        });
      } else {
        await signInWithEmailAndPassword.mutateAsync({
          email,
          password
        });
      }
    } catch (error: any) {
      setError(error.message);
    }
  };

  const toggleAccount = () => setNewAccount((prev) => !prev);

  return (
    <>
      <form onSubmit={onSubmit} className="container">
        <input
          name="email"
          type="text"
          placeholder="Email"
          required
          value={email}
          onChange={onChange}
          className="authInput"
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          required
          value={password}
          onChange={onChange}
          className="authInput"
        />
        <input
          type="submit"
          value={newAccount ? "Create Account" : "Log In"}
          className="authInput authSubmit"
        />
        {error && <span className="authError">{error}</span>}
      </form>
      <span onClick={toggleAccount} className="authSwitch">
        {newAccount ? "Sign In" : "Create Account"}
      </span>
    </>
  );
};
export default AuthForm;
