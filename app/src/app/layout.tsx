import { Inter as FontSans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Providers } from "@/components/redux/provider";
import MenuPageSwitch from "@/components/NavbarMenuPageSwitch";
import { cookies } from 'next/headers'

const fontSans = FontSans({
    subsets: ["latin"],
    variable: "--font-sans",
});

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {

    const cookieStore = cookies()
    const jwt = cookieStore.get('jwtToken')?.value

    return (
        <html lang="en">
            <body
                className={cn(
                    "min-h-screen bg-background font-sans antialiased dark",
                    fontSans.variable
                )}
            >
                <Providers>
                    <MenuPageSwitch token={jwt}>
                        {children}
                    </MenuPageSwitch>
                </Providers>
            </body>
        </html>
    );
}
