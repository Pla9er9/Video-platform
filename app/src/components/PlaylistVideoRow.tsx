"use client";

import Link from "next/link";
import "./VideoRow.scss";
import { Button } from "./ui/button";
import { Trash } from "lucide-react";
import fetchHttp from "@/lib/fetchHttp";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { useToast } from "./ui/use-toast";

export default function PlaylistVideoRow(props: { video: any; playlist: any }) {
    const { toast } = useToast();
    const store = useSelector((s: RootState) => s.token)
    const isAuthor = props.playlist.author.username === store.username

    async function removeVideoFromPlaylist() {
        const res = await fetchHttp(
            `/playlist/${props.playlist.id}/video/${props.video.id}`,
            {
                method: "DELETE",
                token: store.value,
            }
        );

        if (!res.ok) {
            toast({
                variant: "destructive",
                title: "Could not remove video from playlist, try later"
            })
        } else {
            document
                .getElementById(`playlistVideoRow-${props.video.id}`)
                ?.remove();
        }
    }

    return (
        <div
            className="row w-full my-4"
            id={`playlistVideoRow-${props.video.id}`}
            style={{borderRight: "solid 1px gray"}}
        >
            <Link href={`/watch?videoId=${props.video.id}`}>
                {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text */}
                <img
                    className="w-[150px] h-[80px] rounded"
                    src={`${process.env.NEXT_PUBLIC_API_URL}/video/${props.video.id}/miniature`}
                />
            </Link>
            <div
                className="column ml-4 videoInfo"
                style={{ alignItems: "start" }}
            >
                <h1>{props.video.title}</h1>
                <p>{props.video.creator.username}</p>
                <p>{props.video.views} views</p>
            </div>
            {isAuthor ? (
                <Button size="icon" variant="ghost" className="ml-auto mr-4" onClick={removeVideoFromPlaylist}>
                    <Trash size={18} />
                </Button>
            ) : (
                <></>
            )}
        </div>
    );
}
