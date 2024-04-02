"use client";

import MenuButton from "./MenuButton";
import "./Navbar.scss";
import { RootState } from "@/lib/store";
import { useSelector } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export default function Navbar({ onClick }) {
    const data = useSelector((state: RootState) => state.token);

    return (
        <nav className="row">
            <a href="/">Video platform</a>
            <MenuButton onClick={onClick} />
            {data.value ? (
                <Avatar style={{marginLeft: "8px", width: "35px", height: "35px"}}>
                    <AvatarImage
                        src=""
                        alt="@shadcn"
                    />
                    <AvatarFallback style={{fontSize: "12px"}}>{data.username?.slice(0, 2)}</AvatarFallback>
                </Avatar>
            ) : (
                <></>
            )}
        </nav>
    );
}
