"use client";

import MenuButton from "./MenuButton";
import "./Navbar.scss";
import { RootState } from "@/lib/store";
import { useSelector } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import Link from "next/link";
import { Search } from "lucide-react";

export default function Navbar({ onClick }) {
    const data = useSelector((state: RootState) => state.token);

    return (
        <nav className="row">
            <a href="/">Video platform</a>
            <Link href="/search" className="w-8 h-8 column justify-center mr-0">
                <Search className="h-4 w-4" />
            </Link>
            <MenuButton onClick={onClick} />
            {data.value ? (
                <Link href={`/@${data.username}`} style={{margin: "0 8px"}}>
                    <Avatar style={{width: "35px", height: "35px"}}>
                        <AvatarImage
                            src={`${process.env.NEXT_PUBLIC_API_URL}/user/${data.username}/avatar`}
                            alt="@shadcn"
                        />
                        <AvatarFallback style={{fontSize: "12px"}}>{data.username?.slice(0, 2)}</AvatarFallback>
                    </Avatar>
                </Link>
            ) : (
                <></>
            )}
        </nav>
    );
}
