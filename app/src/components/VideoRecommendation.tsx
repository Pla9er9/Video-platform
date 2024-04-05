import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import Image from "next/image";
import "./VideoRecommendations.scss";

export default function VideoRecommendation(props: { data: any }) {
    return (
        <div className="videoRecommendation column">
            <Link
                href={"/watch?videoId=" + props.data.id}
                className="miniature"
            >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={`${process.env.NEXT_PUBLIC_API_URL}/video/${props.data.id}/miniature`}
                    alt="video miniature"
                    className="miniature"
                />
            </Link>
            <div
                className="row w-full mt-2 px-2"
                style={{ alignItems: "flex-start" }}
            >
                <Link href={`/@${props.data.creator.username}`}>
                    <Avatar className="avatar">
                        <AvatarImage src="" alt="@shadcn" />
                        <AvatarFallback style={{ fontSize: "12px" }}>
                            {props.data.creator.username?.slice(0, 2)}
                        </AvatarFallback>
                    </Avatar>
                </Link>
                <div className="column ml-3 w-full">
                    <Link
                        href={"/watch?videoId=" + props.data.id}
                        className="title"
                    >
                        {props.data.title}
                    </Link>
                    <Link
                        href={`/@${props.data.creator.username}`}
                        className="channelOwner"
                    >
                        {props.data.creator.username}
                    </Link>
                    <p className="w-full row justify-between">
                        <span>{props.data.views} views</span>
                        <span className="date">
                            {props.data.created.slice(0, 10)}
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
}
