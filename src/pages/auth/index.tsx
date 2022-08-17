import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTwitter,
  faGoogle,
  faGithub,
} from "@fortawesome/free-brands-svg-icons";
import AuthForm from "./components/AuthForm";
import { GithubAuthProvider, GoogleAuthProvider } from "firebase/auth";
import useSignInWithPopup from "./hooks/mutations/useSignInWithPopup";
import useUser from "../../hooks/queries/useUser";
import { useEffect } from "react";
import useNweetHistory from "../../hooks/useNweetHistory";

const Auth = () => {
  const { isLoggedIn } = useUser();
  const history = useNweetHistory();
  const signInWithPopup = useSignInWithPopup()
  const onSocialClick: React.MouseEventHandler<HTMLButtonElement> = async (event: any) => {
    const {
      target: { name },
    } = event;
    if (name === "google") {
      const provider = new GoogleAuthProvider();
      await signInWithPopup.mutateAsync({ provider });
    } else if (name === "github") {
      const provider = new GithubAuthProvider();
      await signInWithPopup.mutateAsync({ provider });
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      history.moveToHomePage();
    }
  }, [isLoggedIn, history])

  return (
    <div className="flex flex-col h-screen justify-center items-center">
      <FontAwesomeIcon
        className="mb-7"
        icon={faTwitter}
        color={"#04AAFF"}
        size="3x"
      />
      <AuthForm />
      <div className="flex place-content-between w-full max-w-xs">
        <button onClick={onSocialClick} name="google" className="cursor-pointer rounded-3xl border-none px-0 py-2.5 text-xs text-center w-36 bg-white">
          Continue with Google <FontAwesomeIcon icon={faGoogle} />
        </button>
        <button onClick={onSocialClick} name="github" className="cursor-pointer rounded-3xl border-none px-0 py-2.5 text-xs text-center w-36 bg-white">
          Continue with Github <FontAwesomeIcon icon={faGithub} />
        </button>
      </div>
    </div>
  );
};
export default Auth;
