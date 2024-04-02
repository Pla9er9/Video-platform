export default function Main({ children, classname = "" }) {
    return (
        <main className={"min-h-screen p-14 column " + classname}>
            {children}
        </main>
    )
}