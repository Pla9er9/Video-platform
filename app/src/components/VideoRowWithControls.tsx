"use client";

import Link from "next/link";
import "./VideoRow.scss";
import { Button } from "./ui/button";
import { Edit, Trash } from "lucide-react";
import { useState } from "react";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "./ui/use-toast";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import fetchHttp from "@/lib/fetchHttp";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import Image from "next/image";

export default function VideoRowWithControls(props: { video: any }) {
    const [editing, setEditing] = useState(false);
    const { toast } = useToast();
    const token = useSelector((state: RootState) => state.token.value);
    const [miniature, setMiniature] = useState<File | null>(null);
    const [video, setVideo] = useState(props.video)

    const formSchema = z.object({
        title: z.string().min(2).max(50),
        description: z.string().min(2).max(2500),
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: props.video.title,
            description: props.video.description,
        },
    });

    function getErrorToast(title: string) {
        return toast({
            variant: "destructive",
            title: title,
            description: "Try later",
        });
    }

    function getSuccesToast(description: string) {
        return toast({
            description: "✅ - " + description,
        });
    }

    async function deleteVideo() {
        const res = await fetchHttp(`/video/${props.video.id}/delete`, {
            method: "DELETE",
            token: token
        })

        if (!res.ok) {
            toast({
                variant: "destructive",
                title: "Could not delete video, try later"
            })
        } else {
            document.getElementById(`videoRowWithControls-${props.video.id}`)?.remove()
        }
    }

    async function onSubmit(values: z.infer<typeof formSchema>) {
        let formData = new FormData();
        const b: any = "";
        let options = {
            method: "PATCH",
            token: token,
            body: b,
            stringify: false,
            contentType: "application/json;charset=UTF-8",
        };
        options.body = JSON.stringify({
            title: values.title,
            description: values.description,
            isPrivate: false,
        });

        
        let res = await fetchHttp(`/video/${props.video.id}/edit`, options);
        if (!res.ok) {
            getErrorToast("Failed to create video");
            return;
        }
        getSuccesToast("Video informations saved");
        
        video.title = values.title
        video.description = values.description
        setVideo(video)
        setEditing(false)

        if (!miniature) {
            return
        }

        formData.append("file", miniature);
        options.body = formData;
        options.method = "POST"
        res = await fetchHttp(`/video/${props.video.id}/upload/miniature`, {
            ...options,
            noContentType: true,
        });
        if (!res.ok) {
            getErrorToast("Error while uploading miniature");
        } else {
            getSuccesToast("Miniature uploaded");
        }
        form.reset();
    }

    return (
        <div className="column w-full" id={`videoRowWithControls-${props.video.id}`}>
            <div className="row w-full my-4">
                <Link href={`/watch?videoId=${video.id}`}>
                    <img
                        className="w-[150px] h-[80px] rounded"
                        src={`${process.env.NEXT_PUBLIC_API_URL}/video/${video.id}/miniature`}
                    />
                </Link>
                <div
                    className="column ml-4 videoInfo"
                    style={{ alignItems: "start" }}
                >
                    <h1>{video.title}</h1>
                    <p>{video.creator.username}</p>
                    <p>{video.views} views</p>
                </div>
                <Button
                    size="icon"
                    variant="ghost"
                    className="ml-auto mr-2"
                    onClick={() => setEditing(!editing)}
                >
                    <Edit size={18} />
                </Button>
                <Button size="icon" variant="ghost" onClick={deleteVideo}>
                    <Trash size={18} />
                </Button>
            </div>
            {editing ? (
                <>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="grid max-w-sm items-center gap-1.5 space-y-5 w-72"
                        >
                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Title</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="My awesome video"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Description</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Super interesting description"
                                                {...field}
                                                style={{
                                                    resize: "none",
                                                    height: "160px",
                                                }}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Label>New miniature</Label>
                            <div className="row">
                                <Input
                                    onChange={(e) => {
                                        if (e.target.files)
                                            setMiniature(e.target.files[0]);
                                    }}
                                    style={{ height: "80px" }}
                                    type="file"
                                    accept="image/*"
                                />
                                {miniature ? (
                                    <Image
                                        width={115}
                                        height={76}
                                        src={window.URL.createObjectURL(
                                            miniature
                                        )}
                                        style={{
                                            marginLeft: "20px",
                                            borderRadius: "5px",
                                            maxWidth: "125px",
                                            minWidth: "125px",
                                            height: "76px",
                                        }}
                                        alt=""
                                    />
                                ) : (
                                    <></>
                                )}
                            </div>
                            <Button
                                type="submit"
                                className="w-[100px]"
                            >
                                Save
                            </Button>
                        </form>
                    </Form>
                </>
            ) : (
                <></>
            )}
        </div>
    );
}
