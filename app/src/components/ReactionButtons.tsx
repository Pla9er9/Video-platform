"use client";

import { ArrowDown, ArrowUp } from "lucide-react";
import { Button } from "./ui/button";
import { useEffect, useRef, useState } from "react";
import fetchHttp from "@/lib/fetchHttp";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";

type reaction = "like" | "dislike" | null;

export default function ReactionButtons(props: {
    likes: number;
    dislikes: number;
    reaction: reaction;
}) {
    let likes = props.likes
    let dislikes = props.dislikes

    if (props.reaction === "like") {
        likes -= 1
    }

    if (props.reaction === "dislike") {
        dislikes -= 1
    }

    const [reaction, setReaction] = useState<reaction>(props.reaction);
    const token = useSelector((state: RootState) => state.token.value);
    let videoId = useRef("")

    useEffect(() => {
        const s = new URLSearchParams(location.search)
        videoId.current = s.get("videoId") ?? ""
    }, [])

    async function resetReaction() {
        const res = await fetchHttp(`/video/${videoId.current}/unlike`, {
            method: "POST",
            token: token
        })
        if (res.ok) {
            setReaction(null);
        } else {
            console.error(res)
        }
    }

    async function changeReaction(_reaction: reaction) {
        if (reaction === _reaction) {
            resetReaction();
            return
        }
        const res = await fetchHttp(`/video/${videoId.current}/${_reaction}`, {
            method: "POST",
            token: token
        })
        if (res.ok) {
            setReaction(_reaction);
        } else {
            console.error(res)
        }
    }

    return (
        <>
            <Button
                className="rounded-full"
                variant={reaction === "like" ? "default" : "outline"}
                onClick={() => changeReaction("like")}
            >
                <ArrowUp size="18px" className="mr-2" />
                {likes + (reaction === "like" ? 1 : 0)}
            </Button>
            <Button
                className="rounded-full"
                variant={reaction === "dislike" ? "default" : "outline"}
                onClick={() => changeReaction("dislike")}
            >
                <ArrowDown size="18px" className="mr-2" />
                {dislikes + (reaction === "dislike" ? 1 : 0)}
            </Button>
        </>
    );
}