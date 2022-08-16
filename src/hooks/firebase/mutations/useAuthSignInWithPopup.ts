import { UseMutationOptions, UseMutationResult, useMutation } from "@tanstack/react-query";
import { Auth, UserCredential, AuthError, AuthProvider, PopupRedirectResolver, signInWithPopup } from "firebase/auth";

export default function useAuthSignInWithPopup(
    auth: Auth,
    useMutationOptions?: UseMutationOptions<
        UserCredential,
        AuthError,
        { provider: AuthProvider; resolver?: PopupRedirectResolver }
    >
): UseMutationResult<
    UserCredential,
    AuthError,
    { provider: AuthProvider; resolver?: PopupRedirectResolver }
> {
    return useMutation<
        UserCredential,
        AuthError,
        { provider: AuthProvider; resolver?: PopupRedirectResolver }
    >(({ provider, resolver }) => {
        return signInWithPopup(auth, provider, resolver);
    }, useMutationOptions);
}
