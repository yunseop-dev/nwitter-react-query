import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import flattenDeep from "lodash/flattenDeep";
import last from "lodash/last";
import { useMemo } from "react";

const LIMIT = 5;

export interface INweet {
    id: string;
    text: string;
    createdAt: number;
    creatorId: string;
    attachmentUrl: string;
}

export default function useNweetsInfiniteQuery() {
    const result = useInfiniteQuery<{ list: INweet[]; nextPageToken: string; }>(['nweets'], ({ pageParam }) => axios.get('https://firestore.googleapis.com/v1/projects/tablelab-d9e2e/databases/(default)/documents/nweets', {
        params: {
            pageSize: LIMIT,
            orderBy: 'createdAt desc',
            pageToken: pageParam
        }
    }).then(({ data }) => {
        const list = data.documents.map(((item: any) => ({
            id: last((item.name as string).split('/')),
            text: item.fields.text.stringValue,
            createdAt: Number(item.fields.createdAt.integerValue),
            creatorId: item.fields.creatorId.stringValue,
            attachmentUrl: item.fields.attachmentUrl.stringValue,
        })));
        const nextPageToken = data.nextPageToken;
        return { list, nextPageToken }
    }),
        {
            getNextPageParam: (lastPage) => lastPage.nextPageToken,
            getPreviousPageParam: (firstPage, allPages) => {
                const currentPage = allPages.length - 1;
                const previousToken = allPages?.[currentPage - 1]?.nextPageToken;
                return previousToken;
            }
        }
    );

    return {
        ...result,
        list: useMemo(() => flattenDeep(result.data?.pages.map(page => page.list) ?? []), [result.data?.pages])
    }
};
