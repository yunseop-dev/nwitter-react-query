import { authService } from "../../fbase";
import { ChangeEventHandler, FormEventHandler, useEffect, useState } from "react";
import { User } from "firebase/auth";
import useUpdateProfileMutation from "./hooks/mutations/useUpdateProfileMutation";
import useSignOutMutation from "./hooks/mutations/useSignOutMutation";
import useUser from "../../hooks/queries/useUser";
import useNweetHistory from "../../hooks/useNweetHistory";

const Profile = () => {
  const history = useNweetHistory();
  const updateProfile = useUpdateProfileMutation();
  const signOut = useSignOutMutation();
  const user = useUser()

  const [newDisplayName, setNewDisplayName] = useState(user.data?.displayName ?? '');

  const onLogOutClick = async () => {
    await signOut.mutateAsync();
    history.moveToHomePage();
  };

  const onChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    const {
      target: { value },
    } = event;
    setNewDisplayName(value);
  };

  const onSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    if (user.data?.displayName !== newDisplayName) {
      await updateProfile.mutateAsync({ user: authService.currentUser as User, displayName: newDisplayName });
    }
  };

  useEffect(() => {
    if (user.isSuccess) {
      setNewDisplayName(user.data?.displayName ?? '');
    }
  }, [user.data?.displayName, user.isSuccess])

  return (
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
      <div className="container">
        <form onSubmit={onSubmit} className="profileForm">
          <input
            onChange={onChange}
            type="text"
            placeholder="Display name"
            value={newDisplayName}
            autoFocus
            className="formInput"
          />
          <input
            type="submit"
            value="Update Profile"
            className="formBtn"
            style={{
              marginTop: 10,
            }}
          />
        </form>
        <span className="formBtn cancelBtn logOut" onClick={onLogOutClick}>
          Log Out
        </span>
      </div>
    </div>
  );
};

export default Profile;
