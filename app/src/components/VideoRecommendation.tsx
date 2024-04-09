import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import "./VideoRecommendations.scss";

export default function VideoRecommendation(props: {
    data: any;
    withoutCreator?: boolean;
}) {
    return (
        <div className={`videoRecommendation column ${props.withoutCreator ? "pb-3" : "pb-4"}`}>
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
                {props.withoutCreator ? (
                    <></>
                ) : (
                    <Link href={`/@${props.data.creator.username}`}>
                        <Avatar className="avatar">
                            <AvatarImage src={`${process.env.NEXT_PUBLIC_API_URL}/user/${props.data.creator.username}/avatar`} alt="@shadcn" />
                            <AvatarFallback style={{ fontSize: "12px" }}>
                                {props.data.creator.username?.slice(0, 2)}
                            </AvatarFallback>
                        </Avatar>
                    </Link>
                )}
                <div className={`column ${props.withoutCreator ? "ml-2" : "ml-3"} w-full`}>
                    <Link
                        href={"/watch?videoId=" + props.data.id}
                        className="title"
                    >
                        {props.data.title}
                    </Link>
                    {props.withoutCreator ? (
                        <></>
                    ) : (
                        <Link
                            href={`/@${props.data.creator.username}`}
                            className="channelOwner"
                        >
                            {props.data.creator.username}
                        </Link>
                    )}
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
