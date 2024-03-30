export async function POST(request: Request) {
    const data = await request.json()

    const res = await fetch('http://127.0.0.1:8000/signup', {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json",
          },
    })

    const json = await res.json()

    if (!json.ok) {
        return Response.json(json, {
            status: res.status
        })
    }

    return Response.json({ 'token': json.token })
}