import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import './UserProfileSearchResult.scss'

export default function UserProfileSearchResult(props: {data: any}) {
    return (
        <a href={`/@${props.data.username}`} className="row my-8 mx-4 userProfileSearchResult">
            <Avatar className="h-24 w-24">
                <AvatarImage src={`${process.env.NEXT_PUBLIC_API_URL}/user/${props.data.username}/avatar`} alt="@shadcn" />
                <AvatarFallback style={{ fontSize: "32px" }}>
                    {props.data.username?.slice(0, 2)}
                </AvatarFallback>
            </Avatar>
            <div className="column ml-4" style={{alignItems: 'flex-start'}}>
                <p className="text-white text-xl">{props.data.username}</p>
                <p>{props.data.subscriptions} subscriptions</p>
            </div>
        </a>
    )
}