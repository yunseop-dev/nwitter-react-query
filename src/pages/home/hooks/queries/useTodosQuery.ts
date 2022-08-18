import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useMemo } from "react";
import { NumberParam, useQueryParam } from "use-query-params";

const LIMIT = 5;

export interface Todo {
    data: Datum[];
    meta: Meta;
}

export interface Datum {
    id: number;
    attributes: Attributes;
}

export interface Attributes {
    text: string;
    done: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface Meta {
    pagination: Pagination;
}

export interface Pagination {
    page: number;
    pageSize: number;
    pageCount: number;
    total: number;
}


export default function useTodosQuery() {
    const [pageParam] = useQueryParam('page', NumberParam);
    const page = useMemo(() => pageParam ?? 0, [pageParam]);
    return useQuery<Todo>(
        ['nweets', page],
        () => axios
            .get('http://localhost:1337/api/todos', {
                params: {
                    sort: 'id:DESC',
                    'pagination[page]': page,
                    'pagination[pageSize]': LIMIT
                }
            }).then(({ data }) => {
                return data;
            }),
        {
            keepPreviousData: true
        });
};
