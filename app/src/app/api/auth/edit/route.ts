import fetchHttp from "@/lib/fetchHttp";
import { cookies } from "next/headers";

export async function PATCH(request: Request) {
    const data = await request.json();
    const cookieStore = cookies();

    const res = await fetchHttp("account/edit", {
        method: "PATCH",
        body: JSON.stringify(data),
        server: true,
        token: cookieStore.get('jwtToken')?.value,
    });

    if (!res.ok) {
        return Response.json(res.body, {
            status: res.status,
        });
    }

    var a = new Date();
    a = new Date(a.getTime() + 1000 * 60 * 60 * 24 * 365);
    cookieStore.set("username", res.body.username, { expires: a });

    return Response.json({ token: res.body.token });
}
