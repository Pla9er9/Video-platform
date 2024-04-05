function Tittle(props: {
    text: string,
    className?: string
    }) {
    return (
        <h1
            className={
                "text-5xl font-bold mb-14 mt-4 text-center " + props.className
            }
        >
            {props.text}
        </h1>
    );
}

export default Tittle;
