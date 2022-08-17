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
      <form onSubmit={onSubmit} className="flex flex-col w-full max-w-xs">
        <input
          name="email"
          type="text"
          placeholder="Email"
          required
          value={email}
          onChange={onChange}
          className="w-full max-w-xs p-2.5 rounded-3xl bg-white mb-2.5 text-xs text-black"
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          required
          value={password}
          onChange={onChange}
          className="w-full max-w-xs p-2.5 rounded-3xl bg-white mb-2.5 text-xs text-black"
        />
        <input
          type="submit"
          value={newAccount ? "Create Account" : "Log In"}
          className="w-full max-w-xs p-2.5 rounded-3xl bg-white mb-2.5 text-xs text-black text-center text-white mt-2.5 cursor-pointer bg-twitter"
        />
        {error && <span className="text-red-600 text-center font-medium text-xs">{error}</span>}
      </form>
      <span onClick={toggleAccount} className="text-twitter cursor-pointer mt-2.5 mb-12.5 block text-xs underline">
        {newAccount ? "Sign In" : "Create Account"}
      </span>
    </>
  );
};
export default AuthForm;
