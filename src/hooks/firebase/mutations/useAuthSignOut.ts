import { UseMutationOptions, UseMutationResult, useMutation } from "@tanstack/react-query";
import { Auth, AuthError, signOut } from "firebase/auth";

export default function useAuthSignOut(
    auth: Auth,
    useMutationOptions?: UseMutationOptions<void, AuthError, void>
): UseMutationResult<void, AuthError, void> {
    return useMutation<void, AuthError, void>(() => {
        return signOut(auth);
    }, useMutationOptions);
}