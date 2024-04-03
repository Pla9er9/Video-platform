"use client";

import "./Description.scss";

async function urlify(text: string) {
    await new Promise((r) => setTimeout(r, 30));

    var urlRegex = /(https?:\/\/[^\s]+)/g;
    var tagRegex = /( #[^\s]+)/g;

    text = text.replace(
        tagRegex,
        (span: string) => `<span class="tag">${span}</span>`
    );
    text = text.replace(
        urlRegex,
        (url: string) => '<a href="' + url + '">' + url + "</a>"
    );

    const d = document.getElementById("description");
    if (d) {
        d.innerHTML = text;
    }
}

export default function Description(props: { text: string }) {
    urlify(props.text);
    return <p id="description"></p>;
}
