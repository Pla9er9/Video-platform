import { redirect } from "next/navigation";

let any: unknown

export default async function fetchHttp(
	url: string,
    {
        method = 'GET',
        body = any,
        token = '',
        apiUrlPrefix = true,
        server = false,
		stringify = true,
		noContentType = false,
		redirecting = false,
        contentType = 'application/json;charset=UTF-8',
		headers = {},
		cacheOption = 'no-cache'
    }

): Promise<response> {
	let auth = '';
	let apiPrefix = '';
	let stringBody = '';
    
	if (apiUrlPrefix) apiPrefix = process.env.NEXT_PUBLIC_API_URL ?? "";

	if (token !== '' && token !== undefined) auth = 'token ' + token;

	if (url[0] !== '/' && apiUrlPrefix) url = '/' + url;

	if (body !== undefined && typeof body !== 'string') {
		stringBody = JSON.stringify(body);
	} else if (typeof body === 'string') {
		stringBody = body;
	}

	let res
	if (noContentType) {
		res = await fetch(apiPrefix + url, {
			method: method,
			body: method === "GET" ? null : stringify ? stringBody : body,
			headers: {
				Authorization: auth,
				...headers
			},
			redirect: 'follow',
			cache: cacheOption
		});
	} else {
		res = await fetch(apiPrefix + url, {
			method: method,
			body: method === "GET" ? null : stringify ? stringBody : body,
			headers: {
				Authorization: auth,
				'Content-type': contentType,
				...headers
			},
			redirect: 'follow',
			cache: cacheOption
		});
	}
	if (res.redirected) {
		window.location.href = res.url;
	}

	let _body = await res.text()
	try {
		_body = JSON.parse(_body)
	} catch { /**/ }

	if ((res.status === 403 || res.status === 401) && redirecting) {
		if (server) {
			redirect('/login');
		}
		window.location.replace('login');
		return {
			body: _body,
			status: res.status,
			ok: false,
		};
	}
	if (res.status === 500 || res.status === 400) {
		return {
			body: _body,
			status: res.status,
			ok: false,
		};
	}

	if (res.status === 404 && redirecting) {
		if (server) {
			redirect('/404');
		} else {
			window.location.replace('404');
			return {
				body: _body,
				status: res.status,
				ok: false,
			};
		}
	}

	if (res.ok) {
		return {
			body: _body,
			status: res.status,
			ok: res.status === 200,
		};
	} else {
		return {
			body: "",
			status: res.status,
			ok: res.status === 200,
		};
	}
}

type response = {
	body: any
	status: number
	ok: boolean
}