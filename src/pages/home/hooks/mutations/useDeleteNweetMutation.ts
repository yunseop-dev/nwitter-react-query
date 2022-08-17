import { useQueryClient, useMutation, InfiniteData } from "@tanstack/react-query";
import axios from "axios";
import produce from "immer";
import { INweet } from "../queries/useNweetsQuery";

export default function useDeleteNweetMutation() {
    const queryClient = useQueryClient();
    return useMutation(
        (id: string) => axios.delete(`https://firestore.googleapis.com/v1/projects/tablelab-d9e2e/databases/(default)/documents/nweets/${id}`).then(() => ({ id })), {
        async onSuccess(data) {
            console.log(data);
            await queryClient.cancelQueries(['nweets'])
            const previousNweets = queryClient.getQueryData<InfiniteData<{ list: INweet[]; nextPageToken: string; }>>(['nweets'])
            queryClient.setQueryData<InfiniteData<{ list: INweet[]; nextPageToken: string; }>>(['nweets'], (oldData) => produce(oldData, draft => {
                const pages = draft?.pages.map(item => ({
                    ...item,
                    list: item.list.filter((nweet) => (nweet.id !== data.id))
                }))
                // @ts-ignore;
                draft.pages = pages;
            }))


            return { previousNweets }
        },
        onError(error, variables, context: any) {
            queryClient.setQueryData(['nweets'], context.previousNweets)
        }
    })
}