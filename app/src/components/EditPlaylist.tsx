"use client";

import { getCookie } from "@/lib/cookieOperations";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";
import { Input } from "./ui/input";
import { Checkbox } from "./ui/checkbox";
import { useToast } from "./ui/use-toast";
import fetchHttp from "@/lib/fetchHttp";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";

export default function EditPlaylist(props: { playlist: any }) {
    const [editing, setEditing] = useState(false);
    const [value, setValue] = useState(props.playlist.name);
    const [isPrivate, setPrivate] = useState(props.playlist.isPrivate);
    const [isAuthor, setIsAuthor] = useState(false);
    const { toast } = useToast();
    const token = useSelector((v: RootState) => v.token.value);

    useEffect(() => {
        setIsAuthor(props.playlist.author.username === getCookie("username"));
    }, [props.playlist.author.username]);

    if (!isAuthor) return <></>;

    async function saveChanges() {
        if (value === "") {
            toast({
                variant: "destructive",
                title: "Playlist name cannot be empty",
            });
            return;
        }

        const res = await fetchHttp(`/playlist/${props.playlist.id}/edit`, {
            method: "PATCH",
            body: {
                name: value,
                isPrivate: isPrivate
            },
            token: token
        })
        if (!res.ok) {
            toast({
                variant: "destructive",
                title: "Could not save changes"
            })
            return
        }
        toast({
            title: "Changes saved",
        });
        setEditing(false);
    }

    return (
        <div className="column self-start mb-6 w-full">
            <Button
                variant="outline"
                className="self-start"
                onClick={() => setEditing(!editing)}
            >
                {editing ? "Cancel" : "Edit playlist"}
            </Button>
            {editing ? (
                <>
                    <div className="row space-x-4 mt-4 mb-2 w-full">
                        <Input
                            className="max-w-[250px]"
                            placeholder="Name"
                            onChange={(e) => setValue(e.target.value)}
                            value={value}
                        />
                        <div className="row w-full">
                            <Checkbox
                                id="terms"
                                className="w-5 h-5 ml-2"
                                value={isPrivate ? 1 : 0}
                                onCheckedChange={() => setPrivate(!isPrivate)}
                            />
                            <label
                                htmlFor="terms"
                                className="ml-3 text-base font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                                Private
                            </label>
                        </div>
                        <Button className="ml-auto" onClick={saveChanges}>
                            Save
                        </Button>
                    </div>
                </>
            ) : (
                <></>
            )}
        </div>
    );
}
