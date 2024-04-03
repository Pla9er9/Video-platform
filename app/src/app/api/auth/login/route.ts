import { cookies } from "next/headers";

export async function POST(request: Request) {
    const data = await request.json();
    const cookieStore = cookies();

    const res = await fetch("http://127.0.0.1:8000/login", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json",
        },
    });

    const json = await res.json();
    if (!res.ok) {
        return Response.json(json, {
            status: res.status,
        });
    }

    cookieStore.set("jwtToken", json.token, { secure: true, httpOnly: true });
    cookieStore.set("username", json.user.username);

    return Response.json({ token: json.token });
}
