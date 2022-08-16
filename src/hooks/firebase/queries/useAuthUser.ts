import { QueryKey, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import { Auth, AuthError, NextOrObserver, User } from "firebase/auth";
import { useSubscription } from "./useSubscription";

export function useAuthUser<R = User | null>(
    queryKey: QueryKey,
    auth: Auth,
    options: Omit<UseQueryOptions<User | null, AuthError, R>, "queryFn"> = {}
): UseQueryResult<R, AuthError> {
    const subscribeFn = (cb: NextOrObserver<User | null>) =>
        auth.onAuthStateChanged(cb);

    return useSubscription<User | null, AuthError, R>(
        queryKey,
        ["useAuthUser"],
        subscribeFn,
        options
    );
}