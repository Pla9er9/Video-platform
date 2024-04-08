import { useState } from "react";
import { Button } from "./ui/button";
import { MenuIcon, X } from "lucide-react";

export default function MenuButton({ onClick }) {
    const [clicked, setClicked] = useState(false)

    function click() {
        setClicked(!clicked)
        onClick()
    }

    const size = "h-5 w-5"

    return (
        <Button variant="ghost" size="icon" onClick={click} className="mx-2">
            {!clicked ? (
                <MenuIcon className={size} />
            ) : (
                <X className={size} />
            )}
        </Button>
    );
}
