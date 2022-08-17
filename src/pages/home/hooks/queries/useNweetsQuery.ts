import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useMemo } from "react";
import { NumberParam, useQueryParam } from "use-query-params";

const LIMIT = 5;

export interface INweet {
    id: string;
    text: string;
    createdAt: number;
    creatorId: string;
    attachmentUrl: string;
}

interface ItemType { id: number; title: string; }

export default function useNweetsQuery() {
    const [pageParam] = useQueryParam('page', NumberParam);
    const page = useMemo(() => pageParam ?? 0, [pageParam]);
    return useQuery<INweet[]>(
        ['nweets', page],
        () => axios
            .get('https://jsonplaceholder.typicode.com/posts', {
                params: {
                    _limit: LIMIT,
                    _page: page
                }
            }).then(({ data }) => {
                return data.map(((item: ItemType) => ({
                    id: item.id,
                    text: item.title,
                })));
            }),
        {
            keepPreviousData: true
        });
};
