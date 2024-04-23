"use client";

import { useState } from "react";
import VideoCard from "./VideoCard";
import { useToast } from "./ui/use-toast";
import fetchHttp from "@/lib/fetchHttp";
import { Button } from "./ui/button";

export default function HomePageVideos(props: { videosPage: any }) {
    const [videosPage, setVideosPage] = useState(props.videosPage);
    const { toast } = useToast();

    async function loadMoreVideos() {
        const res = await fetchHttp(
            `/video?page=${
                videosPage ? videosPage.page_number + 1 : 1
            }`,
            {}
        );
        if (res.ok) {
            if (videosPage) {
                res.body.content = [...videosPage.content, ...res.body.content];
            }
            setVideosPage(res.body);
        } else {
            toast({
                variant: "destructive",
                title: "Could not load videos",
            });
        }
    }

    return (
        <div className="flex w-[93vw] h-full flex-wrap justify-center">
            {videosPage.content.map((e: any) => (
                <VideoCard data={e} key={e.id} />
            ))}
            <div className="w-full flex">
                {videosPage.has_next ? (
                    <Button
                        variant="outline"
                        className="mx-auto mt-12"
                        onClick={loadMoreVideos}
                    >
                        Load more
                    </Button>
                ) : (
                    <></>
                )}
            </div>
        </div>
    );
}
