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
    
    async function newComment(replyingTo?: string) {
        const res = await fetchHttp(`/video/${props.videoId}/comments/new`, {
            method: "POST",
            token: token,
            body: {
                "text": value
            }
        });
        if (!res.ok) {
            toast({
                variant: "destructive",
                title: "Comment was not added",
                description: "Try later",
            });
            return
        }
        setData([...data, res.body])
        setValue("")
    }

    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [value, setValue] = useState("");
    const { toast } = useToast();

    useEffect(() => {
        const res = fetchHttp(`/video/${props.videoId}/comments`, {});
        res.then((a) => (a.ok ? setData(a.body) : undefined));
        setLoading(false);
    }, []);

    if (loading) return <p>Loading...</p>;

    if (data) {
        return (
            <>
                <div className="row my-2">
                    <Input onChange={(a) => setValue(a.target.value)} placeholder="Write comment" />
                    <Button onClick={() => newComment()} className="rounded-full ml-6">Comment</Button>
                </div>
                {data.map((e: any) => (
                    <Comment data={e} key={e.id}/>
                ))}
            </>
        );
    }
}
