import { useQueryClient, useMutation } from "@tanstack/react-query";
import axios from "axios";

export default function useDeleteNweetMutation() {
    const queryClient = useQueryClient();
    return useMutation(
        (id: number) => axios
            .delete(`http://localhost:1337/api/todos/${id}`), {
        onSettled: () => {
            queryClient.invalidateQueries(['nweets'])
        },
    })
}