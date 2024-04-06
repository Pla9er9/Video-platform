import Main from "@/components/Main";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import fetchHttp from "@/lib/fetchHttp";
import { redirect } from "next/navigation";
import "./page.scss";
import UserSubpages from "@/components/UserSubpages";

export default async function Page({
    params,
}: {
    params: { username: string };
}) {
    if (!params.username.startsWith("%40")) {
        redirect("/404");
    }

    const res = await fetchHttp(`/user/${params.username.slice(3)}`, {});

    return (
        <Main classname="max-w-[1100px] mx-auto px-[25px]">
            <div className="row w-full flex-wrap">
                <Avatar className="w-28 h-28">
                    <AvatarImage src="" alt="@shadcn" />
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
                <Button className="rounded-full ml-8">Subscribe</Button>
            </div>
            <UserSubpages username={params.username.slice(3)} profileInformation={res.body} />
        </Main>
    );
}
