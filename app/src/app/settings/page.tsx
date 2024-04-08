"use client";

import Main from "@/components/Main";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import VideoRecommendation from "@/components/VideoRecommendation";
import fetchHttp from "@/lib/fetchHttp";
import { getCookie } from "@/lib/cookieOperations";
import { RootState } from "@/lib/store";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

async function saveAccountData() {
    
}

export default function Settings() {
    const token = useSelector((state: RootState) => state.token.value);
    const [videos, setVideos] = useState<any[] | null>(null);
    const [account, setAccount] = useState<any | null>(null);
    const [step, setStep] = useState("account");

    async function loadAccountData() {
        if (account) return;
        const res = await fetchHttp(`/user/${getCookie("username")}`, {
            token: token,
        });
        if (res.ok) {
            setAccount(res.body);
        }
    }

    async function loadVideos() {
        if (videos) return;
        const res = await fetchHttp(`/account/videos`, {
            token: token,
        });
        if (res.ok) {
            setVideos(res.body);
        }
    }

    useEffect(() => {
        loadAccountData()
    }, [])

    loadAccountData()

    return (
        <Main classname="p-4">
            <div className="w-full overflow-x-auto column">
                <Tabs
                    defaultValue="account"
                    className="w-[800px]"
                    onValueChange={(e) => setStep(e)}
                >
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="account">Account</TabsTrigger>
                        <TabsTrigger value="videos" onClick={loadVideos}>
                            Videos
                        </TabsTrigger>
                        <TabsTrigger value="playlists">Playlists</TabsTrigger>
                    </TabsList>
                </Tabs>
            </div>
            <div className="row flex-wrap justify-center w-full max-w-[800px] py-8">
                {step === "videos" && videos ? (
                    videos.map((v) => {
                        return (
                            <VideoRecommendation data={v} key={"v" + v.id} />
                        );
                    })
                ) : (
                    <></>
                )}
                {step === "account" && account ? (
                    <div className="column space-y-4 w-[100%] max-w-[500px]" style={{alignItems: 'flex-start'}}>
                        <p className="text-2xl text-white my-4">Account data</p>
                        <Input value={account.username}/>
                        <Input value={account.email}/>
                        <Input value={account.firstname}/>
                        <Textarea value={account.description} style={{resize: 'none', height: '120px'}}/>
                        <Button>Save</Button>
                    </div>
                ) : (
                    <></>
                )}
            </div>
        </Main>
    );
}
