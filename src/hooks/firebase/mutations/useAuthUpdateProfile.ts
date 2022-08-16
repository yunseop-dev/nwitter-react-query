import { UseMutationOptions, UseMutationResult, useMutation } from "@tanstack/react-query";
import { AuthError, User, updateProfile } from "firebase/auth";

type AuthUpdateProfileType = { user: User; displayName?: string | null; photoURL?: string | null };

export default function useAuthUpdateProfile(
    useMutationOptions?: UseMutationOptions<
        AuthUpdateProfileType,
        AuthError,
        AuthUpdateProfileType
    >
): UseMutationResult<
    AuthUpdateProfileType,
    AuthError,
    AuthUpdateProfileType
> {
    return useMutation<
        AuthUpdateProfileType,
        AuthError,
        AuthUpdateProfileType
    >(async ({ user, ...update }) => {
        await updateProfile(user, update);
        return {
            user,
            ...update
        }
    }, useMutationOptions);
}