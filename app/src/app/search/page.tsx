"use client";

import Main from "@/components/Main";
import SearchSkeleton from "@/components/SearchSkeleton";
import { Input } from "@/components/ui/input";
import UserProfileSearchResult from "@/components/UserProfileSearchResult";
import VideoCard from "@/components/VideoCard";
import fetchHttp from "@/lib/fetchHttp";
import { useEffect, useState } from "react";

export default function Search() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [value, setValue] = useState("");

    async function search() {
        setLoading(true);
        const res = await fetchHttp(`/search?query=${value}`, {});
        if (res.ok) {
            setData(res.body);
        }
        setLoading(false);
    }

    useEffect(() => {
        if (value !== "") {
            search();
        } else {
            setData(null)
        }
    }, [value]);

    return (
        <Main classname="max-w-[1100px] mx-auto">
            <Input
                placeholder="Search here"
                className="mb-8"
                onChange={async (e) => {
                    setValue(e.target.value);
                }}
            />
            <div
                className="row flex-wrap w-full"
                style={{ justifyContent: "center" }}
            >
                {loading ? <SearchSkeleton /> : <></>}
                {data && !loading ? (
                    <>
                        <div
                            className="row flex-wrap w-full"
                            style={{ justifyContent: "space-around" }}
                        >
                            {data.profiles.map((d: any) => (
                                <UserProfileSearchResult data={d} key={d.id} />
                            ))}
                        </div>
                        <div
                            className="row flex-wrap w-full"
                            style={{ justifyContent: "center" }}
                        >
                            {data.videos.map((v: any) => (
                                <VideoCard data={v} key={v.id} />
                            ))}
                        </div>
                    </>
                ) : (
                    <></>
                )}
            </div>
        </Main>
    );
}
