import Main from "@/components/Main";
import Tittle from "@/components/Title";
import VideoRecommendation from "@/components/VideoRecommendation";
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
                    className="text-2xl mt-[100px]"
                    text="Something went wrong while loading videos. Try later"
                />
                <Turtle className="w-24 h-24" color="#8dc99d" />
            </div>
        );
    }

    return (
        <Main classname="pt-8">
            <div className="flex w-[93vw] h-full flex-wrap justify-center">
                {res.body.map((e: any) => (
                    <VideoRecommendation data={e} key={e.id} />
                ))}
            </div>
        </Main>
    );
}
