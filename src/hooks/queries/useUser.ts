import { User } from "firebase/auth";
import { useMemo } from "react";
import { authService } from "../../fbase";
import { useAuthUser } from "../firebase/queries/useAuthUser";

export default function useUser() {
    const user = useAuthUser(['user'], authService, {
        select: (data) => data ? ({
            uid: data?.uid ?? '',
            displayName: data?.displayName ?? '',
        }) : null,
        initialData: authService.currentUser as User
    });

    return {
        ...user,
        isLoggedIn: useMemo(() => user.data?.uid || user.data !== null, [user.data])
    }
}