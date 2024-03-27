"use client"

import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Navbar from "@/components/Navbar";
import { useState } from "react";
import Menu from "@/components/Menu";

const fontSans = FontSans({
    subsets: ["latin"],
    variable: "--font-sans",
});

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const [menuActive, setMenuActive] = useState(false);

    return (
        <html lang="en">
            <body
                className={cn(
                    "min-h-screen bg-background font-sans antialiased dark",
                    fontSans.variable
                )}
            >
                <Navbar onClick={() => setMenuActive(!menuActive)} />
                {menuActive ? <Menu /> : children}
            </body>
        </html>
    );
}
