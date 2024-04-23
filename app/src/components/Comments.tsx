"use client";

import fetchHttp from "@/lib/fetchHttp";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useEffect, useState } from "react";
import { useToast } from "./ui/use-toast";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import Comment from "./Comment";

export default function Comments(props: { videoId: string }) {
    const token = useSelector((state: RootState) => state.token.value);
    const [data, setData] = useState<any>();
    const [loading, setLoading] = useState(false);
    const [value, setValue] = useState("");
    const { toast } = useToast();

    async function newComment() {
        const res = await fetchHttp(`/video/${props.videoId}/comments/new`, {
            method: "POST",
            token: token,
            body: {
                text: value,
            },
        });
        if (!res.ok) {
            toast({
                variant: "destructive",
                title: "Comment was not added",
                description: "Try later",
            });
            return;
        }
        const allComments = [...data.content, res.body]
        data.content = allComments
        setData(data);
        setValue("");
    }

    async function loadMoreComments() {
        const res = await fetchHttp(`/video/${props.videoId}/comments?page=${data.page_number + 1}`, {
            method: "GET",
            token: token,
        });
        if (!res.ok) {
            toast({
                variant: "destructive",
                title: "Could not load more comments",
            });
            return;
        }
        const allLoadedComments = [...data.content, ...res.body.content]
        res.body.content = allLoadedComments
        setData(res.body);
    }

    useEffect(() => {
        const res = fetchHttp(`/video/${props.videoId}/comments`, {});
        res.then((a) => (a.ok ? setData(a.body) : undefined));
        setLoading(false);
    }, [props.videoId]);

    if (loading) return <p>Loading...</p>;

    if (data) {
        return (
            <div className="column">
                {token ? (
                    <div className="row my-2 w-full">
                        <Input
                            onChange={(a) => setValue(a.target.value)}
                            placeholder="Write comment"
                        />
                        <Button
                            onClick={() => newComment()}
                            className="rounded-full ml-6"
                        >
                            Comment
                        </Button>
                    </div>
                ) : (
                    <></>
                )}
                {data.content.map((e: any) => (
                    <Comment data={e} key={e.id} />
                ))}
                {data.has_next ? (
                    <Button variant="outline" className="mx-auto" onClick={loadMoreComments}>
                        Load more
                    </Button>
                ) : (
                    <></>
                )}
            </div>
        );
    }
}
