import { useQueryClient, useMutation } from "@tanstack/react-query";
import axios, { AxiosResponse } from "axios";
import { Attributes } from "../queries/useTodosQuery";

export interface TodoInput {
    data: TodoInputBody;
}

export interface TodoInputBody {
    text: string;
    done: boolean;
}

export interface TodoInputResponse {
    data: Data;
    meta: Meta;
}

export interface Data {
    id: number;
    attributes: Attributes;
}

export interface Meta {
}



export default function useAddNweetMutation() {
    const queryClient = useQueryClient();

    return useMutation(
        (nweet: TodoInputBody) => axios.post<TodoInputResponse, AxiosResponse<TodoInputResponse>, TodoInput>(
            "http://localhost:1337/api/todos", {
            data: nweet
        }).then(({ data }) => data), {
        onSettled: () => {
            queryClient.invalidateQueries(['nweets'])
        },
    })
}
