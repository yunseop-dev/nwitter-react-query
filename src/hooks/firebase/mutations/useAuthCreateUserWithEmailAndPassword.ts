import { UseMutationOptions, UseMutationResult, useMutation } from "@tanstack/react-query";
import { Auth, UserCredential, AuthError, createUserWithEmailAndPassword } from "firebase/auth";

export default function useAuthCreateUserWithEmailAndPassword(
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
        return createUserWithEmailAndPassword(auth, email, password);
    }, useMutationOptions);
}
