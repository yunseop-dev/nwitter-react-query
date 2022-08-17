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
    <div className="flex justify-center max-w-4xl w-full mx-auto mt-20 mb-0">
      <div className="flex flex-col w-full max-w-xs">
        <form onSubmit={onSubmit} className="flex flex-col border-b border-solid border-black/75 pb-7 w-full">
          <input
            onChange={onChange}
            type="text"
            placeholder="Display name"
            value={newDisplayName}
            autoFocus
            className="w-full px-5 py-2.5 rounded-2xl border border-solid border-black text-center bg-white text-black"
          />
          <input
            type="submit"
            value="Update Profile"
            className="cursor-pointer w-full px-5 py-2 text-center text-white rounded-2xl bg-twitter cursor-pointer mt-2.5"
          />
        </form>
        <span className="cursor-pointer w-full px-5 py-2 text-center text-white rounded-2xl bg-red-600 cursor-pointer mt-12" onClick={onLogOutClick}>
          Log Out
        </span>
      </div>
    </div>
  );
};

export default Profile;
