import { useQueryClient } from "@tanstack/react-query";
import { User } from "firebase/auth";
import useAuthUpdateProfile from "../../../../hooks/firebase/mutations/useAuthUpdateProfile";


export default function useUpdateProfileMutation() {
    const queryClient = useQueryClient();
    return useAuthUpdateProfile({
        async onSuccess(data) {
            await queryClient.cancelQueries(['user'])
            const previousUser = queryClient.getQueryData(['user'])
            queryClient.setQueryData<User>(['user'], (old) => ({
                ...old,
                ...data.user,
                displayName: data.displayName ?? '',
                photoURL: data.photoURL ?? ''
            }))

            return { previousUser }
        },
        onError(error, variables, context: any) {
            queryClient.setQueryData(['user'], context.previousUser)
        }
    });
};