import { useQueryClient, useMutation, InfiniteData } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import produce from "immer";
import last from "lodash/last";
import { INweet } from "../queries/useNweetsQuery";

interface INweetUpdateVariables {
    id: string;
    text: string
}

export default function useUpdateNweetMutation() {
    const queryClient = useQueryClient();
    return useMutation<INweet, AxiosError, INweetUpdateVariables>(
        ({ id, text }) => axios.patch<INweet>(`https://firestore.googleapis.com/v1/projects/tablelab-d9e2e/databases/(default)/documents/nweets/${id}?updateMask.fieldPaths=text`, {
            fields: {
                text: { stringValue: text },
            }
        }).then(({ data }: any) => ({
            id: last((data.name as string).split('/')),
            text: data.fields.text.stringValue,
            createdAt: Number(data.fields.createdAt.integerValue),
            creatorId: data.fields.creatorId.stringValue,
            attachmentUrl: data.fields.attachmentUrl.stringValue,
        } as INweet)),
        {
            async onSuccess(data) {
                await queryClient.cancelQueries(['nweets'])
                const previousNweets = queryClient.getQueryData<InfiniteData<{ list: INweet[]; nextPageToken: string; }>>(['nweets'])
                queryClient.setQueryData<InfiniteData<{ list: INweet[]; nextPageToken: string; }>>(['nweets'], (oldData) => produce(oldData, draft => {
                    const pages = draft?.pages.map(item => ({
                        ...item,
                        list: item.list.map((nweet) => {
                            if (nweet.id === data.id) return data;
                            return nweet;
                        })
                    }))
                    // @ts-ignore;
                    draft.pages = pages;
                }))

                return { previousNweets }
            },
            onError(error, variables, context: any) {
                queryClient.setQueryData(['nweets'], context.previousNweets)
            }
        }
    );
}