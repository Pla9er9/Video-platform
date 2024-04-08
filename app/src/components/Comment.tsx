import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Reply } from "lucide-react";

export default function Comment(props: { data: any }) {
    return (
        <div className="column" style={{ alignItems: "flex-start" }}>
            <div className="row mt-12 w-full" style={{alignItems: "flex-start"}}>
                <Link href={`/@${props.data.author.username}`}>
                    <Avatar style={{ width: "35px", height: "35px" }}>
                        <AvatarImage src="" alt="@shadcn" />
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
                <Button className="w-[28px] h-[28px] ml-auto bg-transparent" variant="ghost" size="icon">
                    <Reply size={18} />
                </Button>
            </div>
            <p className="ml-12 max-w-[750px]">{props.data.text}</p>
        </div>
    );
}
