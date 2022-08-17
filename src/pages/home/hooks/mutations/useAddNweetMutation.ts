import { useQueryClient, useMutation, InfiniteData } from "@tanstack/react-query";
import axios from "axios";
import produce from "immer";
import last from "lodash/last";
import { INweet } from "../queries/useNweetsInfiniteQuery";

export type INewNweet = Omit<INweet, 'id'>;

export default function useAddNweetMutation() {
    const queryClient = useQueryClient();
    return useMutation(
        (nweet: INewNweet) => axios.post<INweet>("https://firestore.googleapis.com/v1/projects/tablelab-d9e2e/databases/(default)/documents/nweets", {
            fields: {
                text: { stringValue: nweet.text },
                createdAt: { integerValue: nweet.createdAt },
                creatorId: { stringValue: nweet.creatorId },
                attachmentUrl: { stringValue: nweet.attachmentUrl },
            }
        }).then(({ data }: any) => ({
            id: last((data.name as string).split('/')),
            text: data.fields.text.stringValue,
            createdAt: Number(data.fields.createdAt.integerValue),
            creatorId: data.fields.creatorId.stringValue,
            attachmentUrl: data.fields.attachmentUrl.stringValue,
        } as INweet)), {
        async onSuccess(data) {
            await queryClient.cancelQueries(['nweets'])
            const previousNweets = queryClient.getQueryData<InfiniteData<{ list: INweet[]; nextPageToken: string; }>>(['nweets'])
            queryClient.setQueryData<InfiniteData<{ list: INweet[]; nextPageToken: string; }>>(['nweets'], (oldData) => produce(oldData, draft => {
                const pages = draft?.pages.map(item => ({
                    ...item,
                    list: [data, ...item.list]
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