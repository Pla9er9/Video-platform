"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import fetchHttp from "@/lib/fetchHttp";
import { useToast } from "./ui/use-toast";

export default function SubscribeButton(props: {
    isSub: boolean;
    username: string;
}) {
    const [isSub, setSub] = useState(props.isSub);
    const token = useSelector((state: RootState) => state.token.value);
    const { toast } = useToast();

    async function changeSubcribtionState() {
        const res = await fetchHttp(
            `/user/${props.username}/${isSub ? "unsubscribe" : "subscribe"}`,
            {
                method: 'POST',
                token: token,
            }
        );
        if (res.ok) {
            setSub(!isSub);
        } else {
            toast({
                variant: 'destructive',
                title: 'Could not subscribe',
                description: 'Try later'
            })
        }
    }

    return (
        <Button
            variant={isSub ? "outline" : undefined}
            className="rounded-full ml-8"
            onClick={changeSubcribtionState}
        >
            {isSub ? "Subscribing" : "Subscribe"}
        </Button>
    );
}
