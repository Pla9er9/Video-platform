'use client'

import Link from "next/link";
import "./VideoRow.scss";
import { Button } from "./ui/button";
import { Trash } from "lucide-react";
import { getCookie } from "@/lib/cookieOperations";

export default function VideoRow(props: { video: any; playlist: any }) {
    return (
        <div className="row w-full my-4">
            <Link href={`/watch?videoId=${props.video.id}`}>
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
            {props.playlist.author.username === getCookie("username") ? (
                <Button size="icon" variant="ghost" className="ml-auto">
                    <Trash size={18} />
                </Button>
            ) : (
                <></>
            )}
        </div>
    );
}
