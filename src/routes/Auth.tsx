import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTwitter,
  faGoogle,
  faGithub,
} from "@fortawesome/free-brands-svg-icons";
import { authService } from "../fbase";
import AuthForm from "../components/AuthForm";
import { GithubAuthProvider, GoogleAuthProvider, User } from "firebase/auth";
import useAuthSignInWithPopup from "../hooks/mutations/useAuthSignInWithPopup";
import { useQueryClient } from "@tanstack/react-query";

const Auth = () => {
  const queryClient = useQueryClient();
  const signInWithPopup = useAuthSignInWithPopup(authService, {
    async onSuccess(data) {
      await queryClient.cancelQueries(['user'])
      const previousUser = queryClient.getQueryData(['user'])
      queryClient.setQueryData<User>(['user'], () => data.user)

      return { previousUser }
    },
    onError(error, variables, context: any) {
      queryClient.setQueryData(['user'], context.previousUser)
    }
  });
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

  return (
    <div className="authContainer">
      <FontAwesomeIcon
        icon={faTwitter}
        color={"#04AAFF"}
        size="3x"
        style={{ marginBottom: 30 }}
      />
      <AuthForm />
      <div className="authBtns">
        <button onClick={onSocialClick} name="google" className="authBtn">
          Continue with Google <FontAwesomeIcon icon={faGoogle} />
        </button>
        <button onClick={onSocialClick} name="github" className="authBtn">
          Continue with Github <FontAwesomeIcon icon={faGithub} />
        </button>
      </div>
    </div>
  );
};
export default Auth;
