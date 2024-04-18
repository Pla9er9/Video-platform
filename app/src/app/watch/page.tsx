import Main from "@/components/Main";
import fetchHttp from "@/lib/fetchHttp";
import { redirect } from "next/navigation";
import "./page.scss";
import Title from "@/components/Title";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import Description from "@/components/Description";
import Comments from "@/components/Comments";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { AddToPlaylist } from "@/components/AddToPlaylist";
import ReactionButtons from "@/components/ReactionButtons";
import { cookies } from "next/headers";

async function getData(id: string) {
    const res = await fetchHttp(`/video/${id}`, {
        server: true,
        token: cookies().get('jwtToken')?.value
    });

    if (!res.ok) {
        redirect("/404");
    }

    return res.body;
}

export default async function Watch({
    searchParams,
}: {
    searchParams?: { [key: string]: string | undefined };
}) {
    const videoId = searchParams?.videoId;
    if (!videoId) {
        redirect("/404");
    }
    const data = await getData(videoId);
    const exampleVideoUrl = `${process.env.NEXT_PUBLIC_API_URL}/video/${videoId}/v`;

    return (
        <Main classname="p-[0] items-start">
            <video controls={true}>
                <source src={exampleVideoUrl} type="video/mp4" />
            </video>
            <div
                id="data"
                className="column w-full px-[35px]"
                style={{ alignItems: "start" }}
            >
                <Title
                    text={data.title}
                    className="text-[20px] text-start mt-4 leading-snug mb-[0px]"
                />
                <div className="row space-x-3 ml-[2px] my-2">
                    <p>{data.views} views</p>
                    <p>{data.created.slice(0, 10)}</p>
                </div>
                <div className="row space-x-5 mt-2 flex-wrap">
                    <div className="row space-x-3">
                        <Link href={`/@${data.creator.username}`}>
                            <Avatar style={{ width: "40px", height: "40px" }}>
                                <AvatarImage
                                    src={`${process.env.NEXT_PUBLIC_API_URL}/user/${data.creator.username}/avatar`}
                                    alt="avatar"
                                />
                                <AvatarFallback style={{ fontSize: "12px" }}>
                                    {data.creator.username?.slice(0, 2)}
                                </AvatarFallback>
                            </Avatar>
                        </Link>
                        <Link href={`/@${data.creator.username}`}>
                            {data.creator.username}
                        </Link>
                        <div></div>
                    </div>
                    <ReactionButtons likes={data.likes} dislikes={data.dislikes} reaction={data.reaction} />
                    <AddToPlaylist />
                </div>
                <Accordion
                    type="single"
                    collapsible
                    className="w-[80%] self-center mt-10 mb-16"
                >
                    <AccordionItem value="item-1">
                        <AccordionTrigger>Description</AccordionTrigger>
                        <AccordionContent>
                            <Description text={data.description} />
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-3">
                        <AccordionTrigger>Recomendations</AccordionTrigger>
                        <AccordionContent>Recomendations</AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2">
                        <AccordionTrigger>Comments</AccordionTrigger>
                        <AccordionContent>
                            <Comments videoId={videoId} />
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </div>
        </Main>
    );
}
