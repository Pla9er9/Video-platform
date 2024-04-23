"use client";

import Main from "@/components/Main";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import fetchHttp from "@/lib/fetchHttp";
import { RootState } from "@/lib/store";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useToast } from "@/components/ui/use-toast";
import PlaylistRow from "@/components/PlaylistRow";
import VideoRowWithControls from "@/components/VideoRowWithControls";
import MainSettings from "@/components/Settings";

export default function Settings() {
    const store = useSelector((state: RootState) => state.token);
    const [videosPage, setVideosPage] = useState<any | null>(null);
    const [playlistsPage, setPlaylistsPage] = useState<any | null>(null);
    const [account, setAccount] = useState<any | null>(null);
    const [step, setStep] = useState("account");
    const { toast } = useToast();

    async function loadAccountData() {
        if (account) return;
        const res = await fetchHttp(`/user/${store.username}`, {
            token: store.value,
        });
        if (res.ok) {
            setAccount(res.body);
        }
    }

    async function loadVideos({ loadOnlyOnce = false }) {
        if (videosPage && loadOnlyOnce) return;
        const res = await fetchHttp(
            `/account/videos?page=${
                videosPage ? videosPage.page_number + 1 : 1
            }`,
            {
                token: store.value,
            }
        );
        if (res.ok) {
            if (videosPage) {
                res.body.content = [...videosPage.content, ...res.body.content];
            }
            setVideosPage(res.body);
        } else {
            toast({
                variant: "destructive",
                title: "Could not load videos",
            });
        }
    }

    async function loadPlaylists({ loadOnlyOnce = false }) {
        if (playlistsPage && loadOnlyOnce) return;
        const res = await fetchHttp(
            `/account/playlists?page=${
                playlistsPage ? playlistsPage.page_number + 1 : 1
            }`,
            {
                token: store.value,
            }
        );
        if (res.ok) {
            if (playlistsPage) {
                res.body.content = [
                    ...playlistsPage.content,
                    ...res.body.content,
                ];
            }
            setPlaylistsPage(res.body);
        } else {
            toast({
                variant: "destructive",
                title: "Could not load playlists",
            });
        }
    }

    useEffect(() => {
        loadAccountData();
    }, []);

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
                        <TabsTrigger
                            value="videos"
                            onClick={() => loadVideos({ loadOnlyOnce: true })}
                        >
                            Videos
                        </TabsTrigger>
                        <TabsTrigger
                            value="playlists"
                            onClick={() =>
                                loadPlaylists({ loadOnlyOnce: true })
                            }
                        >
                            Playlists
                        </TabsTrigger>
                    </TabsList>
                </Tabs>
            </div>
            <div className="row flex-wrap justify-center w-full max-w-[800px] py-8">
                {step === "videos" && videosPage ? (
                    <>
                        {videosPage.content.map((v: any) => (
                            <VideoRowWithControls video={v} key={v.id} />
                        ))}
                        {videosPage.has_next ? (
                            <Button
                                variant="outline"
                                className="mx-auto"
                                onClick={() => loadVideos({})}
                            >
                                Load more
                            </Button>
                        ) : (
                            <></>
                        )}
                    </>
                ) : (
                    <></>
                )}
                {step === "account" && account ? (
                    <MainSettings accountData={account} />
                ) : (
                    <></>
                )}
                {step === "playlists" && playlistsPage ? (
                    <div className="column w-full">
                        {playlistsPage.content.map((p: any) => (
                            <PlaylistRow playlist={p} key={p.id} />
                        ))}
                        {playlistsPage.has_next ? (
                            <Button
                                variant="outline"
                                className="mx-auto mt-12"
                                onClick={() => loadPlaylists({})}
                            >
                                Load more
                            </Button>
                        ) : (
                            <></>
                        )}
                    </div>
                ) : (
                    <></>
                )}
            </div>
        </Main>
    );
}
