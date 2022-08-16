import { useQueryClient } from "@tanstack/react-query";
import { User } from "firebase/auth";
import { authService } from "../../../../fbase";
import useAuthSignInWithPopup from "../../../../hooks/firebase/mutations/useAuthSignInWithPopup";

export default function useSignInWithPopup() {
    const queryClient = useQueryClient();
    return useAuthSignInWithPopup(authService, {
        async onSuccess(data) {
            await queryClient.cancelQueries(['user'])
            const previousUser = queryClient.getQueryData(['user'])
            queryClient.setQueryData<User>(['user'], () => data.user)

            return { previousUser }
        },
        onError(error, variables, context: any) {
            queryClient.setQueryData(['user'], context.previousUser)
        }
    });
}