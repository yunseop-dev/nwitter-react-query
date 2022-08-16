import { useMemo } from "react";
import { authService } from "../../fbase";
import { useAuthUser } from "../firebase/queries/useAuthUser";

export default function useUser() {
    const user = useAuthUser(['user'], authService, {
        select: (data) => ({
            uid: data?.uid ?? '',
            displayName: data?.displayName ?? '',
        })
    });

    return {
        ...user,
        isLoggedIn: useMemo(() => user.data !== null, [user.data])
    }
}