import { useQueryClient, useMutation } from "@tanstack/react-query";
import axios, { AxiosError, AxiosResponse } from "axios";
import { useMemo } from "react";
import { useQueryParam, NumberParam } from "use-query-params";
import { Todo } from "../queries/useTodosQuery";

export interface TodoUpdateInputVariables {
    data: Data;
}

export interface Data {
    id?: number;
    text: string;
    done: boolean;
}

export interface TodoUpdateInputResponse {
    data: ResponseData;
    meta: Meta;
}

export interface ResponseData {
    id: number;
    attributes: ResponseAttributes;
}

export interface ResponseAttributes {
    text: string;
    done: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface Meta {
}


export default function useUpdateNweetMutation() {
    const queryClient = useQueryClient();
    const [pageParam, setPageParam] = useQueryParam('page', NumberParam);
    const page = useMemo(() => pageParam ?? 1, [pageParam]);

    return useMutation<TodoUpdateInputResponse, AxiosError, Data>(
        ({ id, text, done }) => axios.put<
            TodoUpdateInputResponse,
            AxiosResponse<TodoUpdateInputResponse>,
            TodoUpdateInputVariables
        >(`http://localhost:1337/api/todos/${id}`, {
            data: { text, done }
        }).then(({ data }) => data),
        {
            async onSuccess(data) {
                await queryClient.cancelQueries(['nweets', page])
                const previousNweets = queryClient.getQueryData<Todo>(['nweets', page])
                queryClient.setQueryData<Todo>(['nweets', page], (oldData) => {
                    if (!oldData) return;
                    const result = oldData?.data.map((item) => item.id === data.data.id ? ({
                        ...item,
                        attributes: {
                            ...item.attributes,
                            text: data.data.attributes.text,
                            done: data.data.attributes.done,
                            createdAt: data.data.attributes.createdAt,
                            updatedAt: data.data.attributes.updatedAt,
                        }
                    }) : item)

                    return {
                        ...oldData,
                        data: result
                    }
                })

                return { previousNweets }
            },
            onError(error, variables, context: any) {
                queryClient.setQueryData<Todo>(['nweets', page], context.previousNweets)
            }
        }
    );
}