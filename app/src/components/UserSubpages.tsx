"use client";

import fetchHttp from "@/lib/fetchHttp";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import VideoRecommendation from "./VideoRecommendation";
import { useEffect, useRef, useState } from "react";
import { Calendar, Group, Mail, Users } from "lucide-react";
import "./UserSubpages.scss";
import { original } from "@reduxjs/toolkit";

type stepType = "videos" | "playlists" | "informations";

export default function UserSubpages(props: {
    username: string;
    profileInformation: any;
}) {
    const [data, setData] = useState<any>(null);
    const [isLoading, setLoading] = useState(true);
    const [step, setStep] = useState<stepType>("videos");
    const [value, setValue] = useState('');
    const iconSize = 22;

    const orginal = useRef()

    useEffect(() => {
        fetchHttp(`/user/${props.username}/videos`, {}).then((data) => {
            if (data.ok) {
                setData(data.body);
                orginal.current = data.body
            }
            setLoading(false);
        });
    }, []);

    useEffect(() => {
        if (value !== "") {
            fetchHttp(`/search?query=${value}&user=${props.username}`, {}).then((data) => {
                if (data.ok) {
                    setData(data.body.videos);
                }
                setLoading(false);
            });
        } else {
            setData(orginal.current)
        }
    }, [value]);

    if (isLoading) return <p>Loading...</p>;
    if (!data) return <p>No videos</p>;

    return (
        <>
            <div className="row justify-between w-full my-12 flex-wrap">
                <Select onValueChange={(e: stepType) => setStep(e)}>
                    <SelectTrigger className="w-[220px] self-start row mt-2.5">
                        <SelectValue placeholder="Videos" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectItem value="videos">Videos</SelectItem>
                            <SelectItem value="playlists">Playlists</SelectItem>
                            <SelectItem value="informations">
                                Informations
                            </SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
                <div className="row mt-2.5">
                    <Input
                        className="w-[180px]"
                        placeholder="Search on channel"
                        onChange={(e) => setValue(e.target.value)}
                    />
                </div>
            </div>
            <div className="flex w-[93vw] justify-center max-w-[1100px] flex-wrap">
                {step === "videos" ? (
                    <>
                        {data.map((e: any) => (
                            <VideoRecommendation
                                data={e}
                                key={e.id}
                                withoutCreator={true}
                            />
                        ))}{" "}
                    </>
                ) : (
                    <></>
                )}
                {step === "informations" ? (
                    <div
                        className="column max-w-[400px] mr-auto ml-[40px]"
                        style={{ alignItems: "flex-start" }}
                    >
                        <h1>Informations</h1>
                        <p id="description">
                            {props.profileInformation.description}
                        </p>
                        <div className="row stat">
                            <Mail size={iconSize} />
                            <p>{props.profileInformation.email}</p>
                        </div>
                        <div className="row stat">
                            <Users size={iconSize} />
                            <p>{props.profileInformation.subscriptions}</p>
                        </div>
                        <div className="row stat">
                            <Calendar size={iconSize} />
                            <p>
                                {props.profileInformation.date_joined.slice(
                                    0,
                                    10
                                )}
                            </p>
                        </div>
                    </div>
                ) : (
                    <></>
                )}
            </div>
        </>
    );
}
