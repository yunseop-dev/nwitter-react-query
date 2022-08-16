import { useQueryClient } from "@tanstack/react-query";
import { User } from "firebase/auth";
import { authService } from "../../../../fbase";
import useAuthSignInWithEmailAndPassword from "../../../../hooks/firebase/mutations/useAuthSignInWithEmailAndPassword";
import useNweetHistory from "../../../../hooks/useNweetHistory";

export default function useSignInWithEmailAndPasswordMutation() {
    const queryClient = useQueryClient();
    const history = useNweetHistory();
    return useAuthSignInWithEmailAndPassword(authService, {
        async onSuccess(data) {
            await queryClient.cancelQueries(['user'])
            const previousUser = queryClient.getQueryData(['user'])
            queryClient.setQueryData<User>(['user'], () => data.user)
            history.moveToHomePage()

            return { previousUser }
        },
        onError(error, variables, context: any) {
            queryClient.setQueryData(['user'], context.previousUser)
        }
    });
}