import { useQueryClient } from "@tanstack/react-query";
import { authService } from "../../../../fbase";
import useAuthSignOut from "../../../../hooks/firebase/mutations/useAuthSignOut";
import useLocalStorage from "../../../../hooks/useLocalStorage";

export default function useSignOutMutation() {
    const queryClient = useQueryClient();
    const [, setToken] = useLocalStorage<string | null>('idToken', null);

    return useAuthSignOut(authService, {
        onMutate: async _ => {
            await queryClient.cancelQueries(['user'])
            const previousUser = queryClient.getQueryData(['user'])
            const previousIdToken = queryClient.getQueryData(['idToken'])
            queryClient.setQueryData(['user'], null)
            queryClient.setQueryData(['idToken'], null)
            setToken(null);

            return { previousUser, previousIdToken }
        },
        onError: (err, _, context: any) => {
            queryClient.setQueryData(
                ['user'],
                context.previousUser
            )
            queryClient.setQueryData(
                ['idToken'],
                context.previousIdToken
            )
            setToken(context.previousIdToken)
        },
        onSettled() {
            queryClient.invalidateQueries(['user'])
            queryClient.invalidateQueries(['idToken'])
            queryClient.clear();
        }
    });

}
