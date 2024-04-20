import fetchHttp from "@/lib/fetchHttp";
import { cookies } from "next/headers";
import { permanentRedirect } from "next/navigation";

export async function POST(request: Request) {
    const cookieStore = cookies();
    const token = cookieStore.get('token')

    if (!token) {
        return new Response('', {status: 401})
    }

    const res = await fetchHttp("logout", {
        method: "POST",
        token: token.value,
        server: true
    });

    const json = await res.body;
    if (!res.ok) {
        return Response.json(json, {
            status: res.status,
        });
    }

    cookieStore.delete("token");
    cookieStore.delete("username");

    permanentRedirect("/")
}
