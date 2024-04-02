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

    const exampleVideoUrl = "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"

    return (
        <Main classname="p-[0] items-start">
            <video
                src={exampleVideoUrl}
                controls={true}
            ></video>
            <div id="data" className="column w-full px-[35px]" style={{alignItems: "start"}}>
                <Title
                    text={data.title}
                    className="text-[20px] text-start mt-6 leading-snug mb-2"
                    />
                    <p>{data.created}</p>
                    <Accordion type="single" collapsible className="w-[80%] self-center mt-10 mb-16">
                        <AccordionItem value="item-1">
                            <AccordionTrigger>Description</AccordionTrigger>
                            <AccordionContent>
                                <p id="description">{data.description}</p>
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-2">
                            <AccordionTrigger>Comments</AccordionTrigger>
                            <AccordionContent>
                                Comments
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-3">
                            <AccordionTrigger>Recomendations</AccordionTrigger>
                            <AccordionContent>
                                Recomendations
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
            </div>
        </Main>
    );
}
