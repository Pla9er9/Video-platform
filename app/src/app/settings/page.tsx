"use client";

import Main from "@/components/Main";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import fetchHttp from "@/lib/fetchHttp";
import { RootState } from "@/lib/store";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useToast } from "@/components/ui/use-toast";
import PlaylistRow from "@/components/PlaylistRow";
import VideoRowWithControls from "@/components/VideoRowWithControls";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import Image from "next/image";
import { Label } from "@/components/ui/label";

export default function Settings() {
    const store = useSelector((state: RootState) => state.token);
    const [videosPage, setVideosPage] = useState<any | null>(null);
    const [playlistsPage, setPlaylistsPage] = useState<any | null>(null);
    const [account, setAccount] = useState<any | null>(null);
    const [step, setStep] = useState("account");
    const [avatar, setAvatar] = useState<File | null>(null);
    const { toast } = useToast();
    const pClasses = "text-2xl text-white my-4";

    const formSchema = z.object({
        username: z
            .string()
            .min(2, {
                message: "Username must be at least 2 characters.",
            })
            .max(12, {
                message: "Username must be max 12 characters",
            }),
        email: z.string().email(),
        firstname: z
            .string()
            .min(2, {
                message: "Name must be at least 2 characters",
            })
            .max(12, {
                message: "Name must be max 12 characters",
            }),
        description: z.string(),
    });

    let form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
            email: "",
            firstname: "",
            description: "",
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        let res = await fetchHttp("/api/auth/edit", {
            method: "PATCH",
            body: JSON.stringify({
                username: values.username,
                first_name: values.firstname,
                email: values.email,
                description: values.description,
            }),
            apiUrlPrefix: false,
        });

        if (!res.ok) {
            toast({
                variant: "destructive",
                title: "Changes failed to save",
            });
        }

        if (!avatar) {
            toast({
                title: "Changes saved",
            });
            return;
        }

        let formData = new FormData();
        formData.append("file", avatar);
        res = await fetchHttp(`/account/avatar`, {
            method: "POST",
            token: store.value,
            body: formData,
            stringify: false,
            noContentType: true,
        });
        if (!res.ok) {
            toast({
                variant: "destructive",
                title: "Avatar failed to save",
            });
        }

        toast({
            title: "Changes saved",
        });
    }

    async function loadAccountData() {
        if (account) return;
        const res = await fetchHttp(`/user/${store.username}`, {
            token: store.value,
        });
        if (res.ok) {
            setAccount(res.body);
        }
    }

    async function loadVideos({ loadOnlyOnce = false }) {
        if (videosPage && loadOnlyOnce) return;
        const res = await fetchHttp(
            `/account/videos?page=${
                videosPage ? videosPage.page_number + 1 : 1
            }`,
            {
                token: store.value,
            }
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

    async function loadPlaylists({ loadOnlyOnce = false }) {
        if (playlistsPage && loadOnlyOnce) return;
        const res = await fetchHttp(
            `/account/playlists?page=${
                playlistsPage ? playlistsPage.page_number + 1 : 1
            }`,
            {
                token: store.value,
            }
        );
        if (res.ok) {
            if (playlistsPage) {
                res.body.content = [
                    ...playlistsPage.content,
                    ...res.body.content,
                ];
            }
            setPlaylistsPage(res.body);
        } else {
            toast({
                variant: "destructive",
                title: "Could not load playlists",
            });
        }
    }

    async function deleteAvatar() {
        const res = await fetchHttp("account/avatar/delete", {
            method: "DELETE",
            token: store.value,
        });

        if (!res.ok) {
            toast({
                variant: "destructive",
                title: "Could not delete avatar, try later",
            });
        } else {
            toast({
                title: "Avatar deleted",
            });
        }
    }

    async function logout() {
        const res = await fetchHttp("/api/auth/logout", {
            method: "POST",
            apiUrlPrefix: false,
            redirecting: true,
        });
        if (!res.ok) {
            toast({
                variant: "destructive",
                title: "Could not logout, try later",
            });
        }
    }

    useEffect(() => {
        loadAccountData();
    }, []);

    useEffect(() => {
        if (!account) return;

        form.setValue("username", account.username);
        form.setValue("email", account.email);
        form.setValue("firstname", account.firstname);
        form.setValue("description", account.description);
    }, [account, form]);

    return (
        <Main classname="p-4">
            <div className="w-full overflow-x-auto column">
                <Tabs
                    defaultValue="account"
                    className="w-[800px]"
                    onValueChange={(e) => setStep(e)}
                >
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="account">Account</TabsTrigger>
                        <TabsTrigger
                            value="videos"
                            onClick={() => loadVideos({ loadOnlyOnce: true })}
                        >
                            Videos
                        </TabsTrigger>
                        <TabsTrigger
                            value="playlists"
                            onClick={() =>
                                loadPlaylists({ loadOnlyOnce: true })
                            }
                        >
                            Playlists
                        </TabsTrigger>
                    </TabsList>
                </Tabs>
            </div>
            <div className="row flex-wrap justify-center w-full max-w-[800px] py-8">
                {step === "videos" && videosPage ? (
                    <>
                        {videosPage.content.map((v: any) => (
                            <VideoRowWithControls video={v} key={v.id} />
                        ))}
                        {videosPage.has_next ? (
                            <Button
                                variant="outline"
                                className="mx-auto"
                                onClick={() => loadVideos({})}
                            >
                                Load more
                            </Button>
                        ) : (
                            <></>
                        )}
                    </>
                ) : (
                    <></>
                )}
                {step === "account" && account ? (
                    <div
                        className="column space-y-4 w-[100%] max-w-[500px]"
                        style={{ alignItems: "flex-start" }}
                    >
                        <p className={pClasses}>Account data</p>
                        <Label htmlFor="avatarManagmentRow">Avatar</Label>
                        <div className="row space-x-4" id="avatarManagmentRow">
                            {avatar ? (
                                <Image
                                    width={40}
                                    height={40}
                                    src={window.URL.createObjectURL(avatar)}
                                    style={{
                                        marginLeft: "20px",
                                        borderRadius: "100%",
                                        maxWidth: "60px",
                                        minWidth: "60px",
                                        height: "60px",
                                    }}
                                    alt="New Avatar"
                                    onClick={() => setAvatar(null)}
                                />
                            ) : (
                                <></>
                            )}
                            <Label
                                htmlFor="avatarInput"
                                className="border column w-[130px] h-[40px] rounded-md border-input bg-background cursor-pointer"
                            >
                                <span className="mt-3">Upload avatar</span>
                                <Input
                                    id="avatarInput"
                                    onChange={(e) => {
                                        if (e.target.files)
                                            setAvatar(e.target.files[0]);
                                    }}
                                    style={{ height: "40px", display: "none" }}
                                    type="file"
                                    accept="image/*"
                                />
                            </Label>
                            <Button variant="outline" onClick={deleteAvatar}>
                                Delete avatar
                            </Button>
                        </div>
                        <Form {...form}>
                            <form
                                onSubmit={form.handleSubmit(onSubmit)}
                                className="space-y-8 w-full"
                            >
                                <FormField
                                    control={form.control}
                                    name="username"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Username</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="My username"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="example@mail.com"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="firstname"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Firstname</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Alex"
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
                                                    placeholder="Interesting description"
                                                    {...field}
                                                    style={{
                                                        resize: "none",
                                                        height: "120px",
                                                    }}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button type="submit">Save</Button>
                            </form>
                        </Form>
                        <div
                            className="row w-full"
                            style={{ justifyContent: "space-between" }}
                        >
                            <p className={pClasses + " mt-8"}>Logout</p>
                            <Button
                                variant="outline"
                                className="w-[85px] text-red-600"
                                onClick={logout}
                            >
                                Logout
                            </Button>
                        </div>
                    </div>
                ) : (
                    <></>
                )}
                {step === "playlists" && playlistsPage ? (
                    <div className="column w-full">
                        {playlistsPage.content.map((p: any) => (
                            <PlaylistRow playlist={p} key={p.id} />
                        ))}
                        {playlistsPage.has_next ? (
                            <Button
                                variant="outline"
                                className="mx-auto mt-12"
                                onClick={() => loadPlaylists({})}
                            >
                                Load more
                            </Button>
                        ) : (
                            <></>
                        )}
                    </div>
                ) : (
                    <></>
                )}
            </div>
        </Main>
    );
}
