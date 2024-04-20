import Main from "@/components/Main";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import fetchHttp from "@/lib/fetchHttp";
import { redirect } from "next/navigation";
import "./page.scss";
import UserSubpages from "@/components/UserSubpages";
import SubscribeButton from "@/components/SubscribeButton";
import { cookies } from 'next/headers'

export default async function Page({
    params,
}: {
    params: { username: string };
}) {
    if (!params.username.startsWith("%40")) {
        redirect("/404");
    }

    const cookieStore = cookies()
    const res = await fetchHttp(`/user/${params.username.slice(3)}`, {
        token: cookieStore.get('token')?.value
    });
    
    if (!res.ok) {
        redirect("/404")
    }

    return (
        <Main classname="max-w-[1100px] mx-auto px-[25px]">
            <div className="row w-full flex-wrap">
                <Avatar className="w-28 h-28">
                    <AvatarImage src={`${process.env.NEXT_PUBLIC_API_URL}/user/${res.body.username}/avatar`} alt="@shadcn" />
                    <AvatarFallback style={{ fontSize: "32px" }}>
                        {res.body.username?.slice(0, 2)}
                    </AvatarFallback>
                </Avatar>
                <div className="column textData" style={{alignItems: 'flex-start'}}>
                    <h1>{res.body.username}</h1>
                    <p>
                        {res.body.firstname} •{" "}
                        {res.body.date_joined.slice(0, 10)} <br></br>
                        {res.body.subscriptions} subscriptions
                    </p>
                </div>
                <SubscribeButton isSub={res.body.subscribing} username={res.body.username} />
            </div>
            <UserSubpages username={params.username.slice(3)} profileInformation={res.body} />
        </Main>
    );
}
