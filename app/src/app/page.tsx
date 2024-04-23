import HomePageVideos from "@/components/HomePageVideos";
import Main from "@/components/Main";
import Tittle from "@/components/Title";
import fetchHttp from "@/lib/fetchHttp";
import { Turtle } from "lucide-react";

export default async function Home() {
    const res = await fetchHttp(`/video`, {
        server: true,
    });
    if (!res.ok) {
        return (
            <div className="w-full column">
                <Tittle
                    className="text-2xl mt-[100px] max-w-[600px]"
                    text="Something went wrong while loading videos. Try later"
                />
                <Turtle className="w-32 h-32" color="#8dc99d" />
            </div>
        );
    }
    return (
        <Main classname="pt-8">
            <HomePageVideos videosPage={res.body} />
        </Main>
    );
}
