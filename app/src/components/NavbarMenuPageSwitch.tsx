'use client';

import { useState } from "react";
import Navbar from "./Navbar";
import Menu from "./Menu";
import { useDispatch } from "react-redux";
import { setToken } from "@/lib/store";

export default function MenuPageSwitch({ children, token }) {
    const [menuActive, setMenuActive] = useState(false);
    const dispatch = useDispatch()
    dispatch(setToken(token))

    return (
        <>
            <Navbar onClick={() => setMenuActive(!menuActive)} />
            <div className={!menuActive ? "hidden" : "block"}><Menu /></div>
            <div className={menuActive ? "hidden" : "block"}>{children}</div>
        </>
    );
}