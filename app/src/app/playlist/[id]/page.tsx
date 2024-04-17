import Main from "@/components/Main";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import VideoRow from "@/components/VideoRow";
import fetchHttp from "@/lib/fetchHttp";
import { Eye } from "lucide-react";
import { Lock } from "lucide-react";
import { cookies } from "next/headers";
import Link from "next/link";

export default async function Playlist({ params }: { params: { id: string } }) {
    const res = await fetchHttp(`/playlist/${params.id}`, {
        token: cookies().get("jwtToken"),
    });

    const playlist = res.body;

    const styles = {
        color: "hsl(var(--muted-foreground))",
        margin: "8px auto 10px 0",
        fontSize: "14px"
    }

    return (
        <Main classname="max-w-[1000px] mx-auto">
            <div className="row justify-between w-full">
                <h1 className="text-3xl font-medium mr-auto">{playlist.name}</h1>
                {playlist.isPrivate ? <Lock size={24} /> : <Eye size={24} />}
            </div>
            <p style={styles}>{playlist.createdDate.slice(0, 10)}</p>
            <Link href={`/@${playlist.author.username}`} className="row mr-auto mb-8">
                <Avatar className="w-8 h-8 mr-2">
                    <AvatarImage
                        src={`${process.env.NEXT_PUBLIC_API_URL}/user/${playlist.author.username}/avatar`}
                        alt="@shadcn"
                    />
                    <AvatarFallback style={{ fontSize: "13px" }}>
                        {playlist.author.username?.slice(0, 2)}
                    </AvatarFallback>
                </Avatar>
                {playlist.author.username}
            </Link>
            {playlist.videos.map((v: any) => {
                return <VideoRow video={v} playlist={playlist} key={v.id} />;
            })}
        </Main>
    );
}
