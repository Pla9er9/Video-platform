"use client";

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
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import fetchHttp from "@/lib/fetchHttp";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useToast } from "./ui/use-toast";
import { Textarea } from "./ui/textarea";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";

export default function Settings(props: { accountData: any }) {
    const pClasses = "text-2xl text-white my-4";
    const [avatar, setAvatar] = useState<File | null>(null);
    const { toast } = useToast();
    const store = useSelector((state: RootState) => state.token);
    
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
            username: props.accountData.username,
            email: props.accountData.email,
            firstname: props.accountData.firstname,
            description: props.accountData.description,
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

    return (
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
                            if (e.target.files) setAvatar(e.target.files[0]);
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
                                    <Input placeholder="Alex" {...field} />
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
    );
}
