import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import {Trash } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import fetchHttp from "@/lib/fetchHttp";
import { useSearchParams } from "next/navigation";
import { useToast } from "./ui/use-toast";

export default function Comment(props: { data: any }) {
    const store = useSelector((v: RootState) => v.token)
    const searchParams = useSearchParams()
    const videoId = searchParams.get("videoId")
    const { toast } = useToast()

    async function deleteComment() {
        const res = await fetchHttp(`/video/${videoId}/comments/${props.data.id}`, {
            method: 'delete',
            token: store.value
        })
        if (!res.ok) {
            toast({
                variant: "destructive",
                title: "Could not delete comment"
            })
        } else {
            document.getElementById(`comment-${props.data.id}`)?.remove()
        }
    }

    return (
        <div className="column my-6 w-full" id={`comment-${props.data.id}`} style={{ alignItems: "flex-start" }}>
            <div className="row w-full" style={{ alignItems: "flex-start" }}>
                <Link href={`/@${props.data.author.username}`}>
                    <Avatar style={{ width: "35px", height: "35px" }}>
                        <AvatarImage
                            src={`${process.env.NEXT_PUBLIC_API_URL}/user/${props.data.author.username}/avatar`}
                            alt="@shadcn"
                        />
                        <AvatarFallback style={{ fontSize: "12px" }}>
                            {props.data.author.username?.slice(0, 2)}
                        </AvatarFallback>
                    </Avatar>
                </Link>
                <Link
                    href={`/@${props.data.author.username}`}
                    className="mx-3 text-sm text-white"
                >
                    {props.data.author.username}
                </Link>
                <p className="text-[11px]">
                    {props.data.postedDate.slice(0, 10)}
                </p>
                {props.data.author.username == store.username ? (
                    <Button
                        className="w-[28px] h-[28px] ml-auto bg-transparent"
                        variant="ghost"
                        size="icon"
                        onClick={deleteComment}
                    >
                        <Trash size={16} />
                    </Button>
                ) : (
                    <></>
                )}
            </div>
            <p className="ml-12 max-w-[750px]">{props.data.text}</p>
        </div>
    );
}
