import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTwitter } from "@fortawesome/free-brands-svg-icons";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import useUser from "../hooks/queries/useUser";

const Navigation = () => {
  const user = useUser()

  if (!user.isLoggedIn) return <></>

  return (
    <nav>
      <ul className="flex justify-center mt-12">
        <li>
          <Link to="/" className="mr-2.5" aria-label="Twitter Logo">
            <FontAwesomeIcon icon={faTwitter} className="text-twitter" size="2x" />
          </Link>
        </li>
        <li>
          <Link
            to="/profile"
            className="flex flex-col items-center ml-2.5 text-xs"
          >
            <FontAwesomeIcon icon={faUser} className="text-twitter" size="2x" />
            <span className="mt-2.5">
              {user.data?.displayName
                ? `${user.data?.displayName}의 Profile`
                : "Profile"}
            </span>
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;
