import { UseMutationOptions, UseMutationResult, useMutation } from "@tanstack/react-query";
import { Auth, UserCredential, AuthError, signInWithEmailAndPassword } from "firebase/auth";

export default function useAuthSignInWithEmailAndPassword(
    auth: Auth,
    useMutationOptions?: UseMutationOptions<
        UserCredential,
        AuthError,
        { email: string; password: string }
    >
): UseMutationResult<
    UserCredential,
    AuthError,
    { email: string; password: string }
> {
    return useMutation<
        UserCredential,
        AuthError,
        { email: string; password: string }
    >(({ email, password }) => {
        return signInWithEmailAndPassword(auth, email, password);
    }, useMutationOptions);
}
