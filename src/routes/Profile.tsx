import { authService } from "../fbase";
import { ChangeEventHandler, FormEventHandler, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useAuthUser } from "../hooks/quries/useAuthUser";
import useAuthUpdateProfile from "../hooks/quries/useAuthUpdateProfile";
import { User } from "firebase/auth";
import { useQueryClient } from "@tanstack/react-query";

const Profile = () => {
  const history = useHistory();
  const queryClient = useQueryClient();
  const user = useAuthUser(['user'], authService, {
    select: (data) => ({
      uid: data?.uid ?? '',
      displayName: data?.displayName ?? '',
    })
  });

  const updateProfile = useAuthUpdateProfile({
    async onSuccess(data) {
      await queryClient.cancelQueries(['user'])
      const previousUser = queryClient.getQueryData(['user'])
      queryClient.setQueryData<User>(['user'], (old) => ({
        ...old,
        ...data.user,
        displayName: data.displayName ?? '',
        photoURL: data.photoURL ?? ''
      }))

      return { previousUser }
    },
    onError(error, variables, context: any) {
      queryClient.setQueryData(['user'], context.previousUser)
    }
  });
  const [newDisplayName, setNewDisplayName] = useState(user.data?.displayName ?? '');

  const onLogOutClick = () => {
    authService.signOut();
    history.push("/");
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
      setNewDisplayName(user.data.displayName);
    }
  }, [user.data?.displayName, user.isSuccess])

  return (
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
  );
};

export default Profile;
