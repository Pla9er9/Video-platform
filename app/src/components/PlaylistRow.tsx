"use client"

import { Eye, Lock, Trash } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";
import fetchHttp from "@/lib/fetchHttp";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { useToast } from "./ui/use-toast";

export default function PlaylistRow(props: { playlist: any }) {
    const token = useSelector((state: RootState) => state.token.value);
    const { toast } = useToast()

    async function deletePlaylist() {
        const res = await fetchHttp(`/playlist/${props.playlist.id}/delete`, {
            method: "DELETE",
            token: token
        })
        if (res.ok) {
            toast({
                title: "Playlist deleted"
            })
            document.getElementById(`playlist-${props.playlist.id}`)?.remove()
        } else {
            toast({
                variant: "destructive",
                title: "Cannot delete playlist",
                description: "Try later"
            })
        }
    }

    return (
        <div className="row w-full my-2" id={`playlist-${props.playlist.id}`}>
            {props.playlist.isPrivate ? <Lock size={16} /> : <Eye size={16} />}
            <Link href={`/playlist/${props.playlist.id}`} className="mx-3 w-[140px] overflow-x-hidden">
                <h1>{props.playlist.name}</h1>
            </Link>
            <p className="mx-auto">{props.playlist.videos} videos</p>
            <p className="mx-auto">{props.playlist.createdDate.slice(0, 10)}</p>
            <Button size="icon" variant="ghost" className="w-8 h-8" onClick={deletePlaylist}>
                <Trash color="red" className="w-4 h-4" />
            </Button>
        </div>
    );
}
