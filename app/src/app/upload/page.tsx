"use client";

import Title from "@/components/Title";
import Main from "@/components/Main";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Image from "next/image";
import fetchHttp from "@/lib/fetchHttp";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { useToast } from "@/components/ui/use-toast";

export default function Upload() {
    const [step, setStep] = useState(0);
    const [miniature, setMiniature] = useState<File | null>(null);
    const [video, setVideo] = useState<File | null>(null);
    const token = useSelector((state: RootState) => state.token.value);
    const { toast } = useToast();

    const formSchema = z.object({
        title: z.string().min(2).max(50),
        description: z.string().min(2).max(2500),
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            description: "",
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

    async function onSubmit(values: z.infer<typeof formSchema>) {
        let formData = new FormData()
        const b: any = ""
        let options = {
            method: "POST",
            token: token,
            body: b,
            stringify: false,
            contentType: "application/json;charset=UTF-8"
        };
        options.body = JSON.stringify({
            title: values.title,
            description: values.description,
            isPrivate: false,
        });

        let res = await fetchHttp("/video/new", options);
        if (!res.ok) {
            getErrorToast("Failed to create video")
            return
        }
        getSuccesToast("Video informations uploaded, uploading miniature")

        const id = res.body.id

        // @ts-ignore
        formData.append('file', miniature)
        options.body = formData
        res = await fetchHttp(`/video/${id}/upload/miniature`, {...options, noContentType: true})
        if (!res.ok) {
            getErrorToast("Error while uploading miniature")
        } else {
            getSuccesToast("Miniature uploaded, uploading video")
        }
        
        // @ts-ignore
        formData.set('file', video)
        options.body = formData
        res = await fetchHttp(`/video/${id}/upload/video`, {...options, noContentType: true})
        if (!res.ok) {
            getErrorToast("Error while uploading video")
            return
        } 
        getSuccesToast("Video succesfully uploaded")
        form.reset()
    }

    return (
        <Main>
            <Title text="Upload video" className="text-4xl" />
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="grid w-full max-w-sm items-center gap-1.5 space-y-5 w-72"
                >
                    {step === 0 ? (
                        <>
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
                        </>
                    ) : (
                        <>
                            <Label>Choose video</Label>
                            <div className="column">
                                <Input
                                    onChange={(e) => {
                                        if (e.target.files) setVideo(e.target.files[0])
                                    }}
                                    style={{ height: "80px" }}
                                    type="file"
                                    accept="video/mp4"
                                />
                                {video ? (
                                    <>
                                        <video
                                            controls={true}
                                            src={window.URL.createObjectURL(
                                                video
                                            )}
                                            style={{
                                                marginTop: "20px",
                                                borderRadius: "5px",
                                            }}
                                        ></video>
                                    </>
                                ) : (
                                    <></>
                                )}
                            </div>
                            <Label>Select miniature</Label>
                            <div className="row">
                                <Input
                                    onChange={(e) => {
                                        if (e.target.files) setMiniature(e.target.files[0]);
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
                        </>
                    )}
                    {step === 1 && (
                        <>
                            <Button
                                className="w-full"
                                variant="outline"
                                onClick={() => setStep(0)}
                            >
                                Back
                            </Button>{" "}
                        </>
                    )}
                    <Button
                        type={step === 0 ? "button" : "submit"}
                        className="w-full"
                        onClick={
                            step === 0
                                ? (e) => {
                                      e.preventDefault();
                                      setStep(1);
                                  }
                                : undefined
                        }
                    >
                        {step === 0 ? "Next" : "Upload"}
                    </Button>
                </form>
            </Form>
        </Main>
    );
}
