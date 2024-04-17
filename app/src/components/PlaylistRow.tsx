import { Eye, Lock } from "lucide-react";
import Link from "next/link";

export default function PlaylistRow(props: { playlist: any }) {
    return (
        <div className="row w-full my-2">
            {props.playlist.isPrivate ? <Lock size={16} /> : <Eye size={16} />}
            <Link href={`/playlist/${props.playlist.id}`} className="mx-3 w-[140px] overflow-x-hidden">
                <h1>{props.playlist.name}</h1>
            </Link>
            <p className="mx-auto">{props.playlist.videos} videos</p>
            <p>{props.playlist.createdDate.slice(0, 10)}</p>
        </div>
    );
}
