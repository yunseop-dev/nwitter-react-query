import { useQueryClient } from "@tanstack/react-query";
import { authService } from "../../../../fbase";
import useAuthSignOut from "../../../../hooks/firebase/mutations/useAuthSignOut";

export default function useSignOutMutation() {
    const queryClient = useQueryClient();
    return useAuthSignOut(authService, {
        onMutate: async _ => {
            await queryClient.cancelQueries(['user'])
            const previousUser = queryClient.getQueryData(['user'])
            queryClient.setQueryData(['user'], null)

            return { previousUser }
        },
        onError: (err, _, context: any) => {
            queryClient.setQueryData(
                ['user'],
                context.previousUser
            )
        },
        onSettled() {
            queryClient.invalidateQueries(['user'])
            queryClient.clear();
        }
    });

}
