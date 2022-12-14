import { useMemo } from "react";
import { authService } from "../../fbase";
import { useAuthUser } from "../firebase/queries/useAuthUser";
import useAccessTokenFromIndexedDb from "./useAccessTokenFromIndexedDb";

export default function useUser() {
    const idToken = useAccessTokenFromIndexedDb();
    const user = useAuthUser(['user'], authService, {
        enabled: idToken.isSuccess,
        select: (data = authService.currentUser) => data ? ({
            uid: data?.uid ?? '',
            displayName: data?.displayName ?? '',
        }) : null,
    });
    return {
        ...user,
        isLoggedIn: useMemo(() => !!idToken.data, [idToken.data])
    }
}