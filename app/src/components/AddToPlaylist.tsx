"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { List } from "lucide-react";
import { Input } from "./ui/input";
import { Checkbox } from "./ui/checkbox";
import { useState } from "react";
import { useToast } from "./ui/use-toast";
import fetchHttp from "@/lib/fetchHttp";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";

export function AddToPlaylist() {
    const token = useSelector((state: RootState) => state.token.value);
    const [value, setValue] = useState("");
    const [isPrivate, setPrivate] = useState(false)
    const [playlists, setPlaylist] = useState<any[]>([]);
    const { toast } = useToast();

    async function addNewPlaylist() {
        if (value === "") {
            toast({
                variant: "destructive",
                title: "Playlist name cannot be empty",
            });
            return;
        }
        const res = await fetchHttp(`/playlist/new`, {
            token: token,
            method: "post",
            body: {
                "name": value,
                "isPrivate": isPrivate
            }
        })
        if (!res.ok) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Could not create playlist"
            });
            return
        }
        setPlaylist([...playlists, res.body]);
        setValue("");
    }

    async function addVideoToPlaylist(playlistId: string) {
        const p = new URLSearchParams(location.search)
        const res = await fetchHttp(`playlist/${playlistId}/add?videoId=${p.get("videoId")}`, {
            token: token,
            method: "POST",
        })
        if (!res.ok) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Could not add to playlist"
            });
        } else {
            toast({
                title: "Video added to playlist",
            });
        }
    }

    async function loadPlaylists() {
        if (playlists.length > 0) return

        const res = await fetchHttp(`/account/playlists`, {
            token: token,
        });
        if (res.ok) {
            setPlaylist(res.body)
        }
    }

    return (
        <Dialog onOpenChange={loadPlaylists}>
            <DialogTrigger asChild>
                <Button className="rounded-full" variant="outline">
                    <List size="18px" className="mr-2" />
                    Add to Playlist
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]" >
                <DialogHeader>
                    <DialogTitle>Save video in playlist</DialogTitle>
                    <DialogDescription>
                        Choose existing playlist or create new one
                    </DialogDescription>
                </DialogHeader>
                <div className="column w-[250px] mx-auto my-4 max-h-[300px] overflow-auto">
                    {playlists.map((p) => (
                        <Button
                            variant="outline"
                            key={p.id}
                            className="my-2 w-[100%]"
                            onClick={() => addVideoToPlaylist(p.id)}
                        >
                            <List className="w-4 h-4 mr-2" />
                            <p className="mr-auto ml-2">{p.name}</p>
                        </Button>
                    ))}
                </div>
                <div className="column w-[250px] space-y-6 mx-auto max-h-[300px]">
                    <p className="text-base mr-auto ml-2 text-white">
                        New playlist
                    </p>
                    <Input
                        placeholder="Name"
                        onChange={(e) => setValue(e.target.value)}
                        value={value}
                    />
                    <div className="row w-full">
                        <Checkbox id="terms" className="w-5 h-5 ml-2" value={isPrivate ? 1 : 0} onCheckedChange={() => setPrivate(!isPrivate)} />
                        <label
                            htmlFor="terms"
                            className="ml-3 text-base font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                            Private
                        </label>
                        <Button className="ml-auto" onClick={addNewPlaylist}>
                            Create
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
