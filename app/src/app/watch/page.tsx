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
import { Button } from "@/components/ui/button";
import { ArrowDown, ArrowUp } from "lucide-react";
import Description from "@/components/Description";

async function getData() {
    const res = await fetchHttp(`/video/7982febc-6b6e-40e4-995c-1fc9a80a0874`, {
        server: true,
    });

    if (!res.ok) {
        redirect("/404");
    }

    return res.body;
}

export default async function Watch() {
    const data = await getData();
    
    const exampleVideoUrl =
        `${process.env.PUBLIC_API_URL}/video/7982febc-6b6e-40e4-995c-1fc9a80a0874/v`

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
                    <p>{data.created}</p>
                </div>
                <div className="row space-x-3 mt-2">
                    <Button className="rounded-full" variant="outline">
                        <ArrowUp size="18px" className="mr-2" />
                        {data.likes} Like
                    </Button>
                    <Button className="rounded-full" variant="secondary">
                        <ArrowDown size="18px" className="mr-2" />
                        {data.dislikes} Dislike
                    </Button>
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
                    <AccordionItem value="item-2">
                        <AccordionTrigger>Comments</AccordionTrigger>
                        <AccordionContent>Comments</AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-3">
                        <AccordionTrigger>Recomendations</AccordionTrigger>
                        <AccordionContent>Recomendations</AccordionContent>
                    </AccordionItem>
                </Accordion>
            </div>
        </Main>
    );
}
