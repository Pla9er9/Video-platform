import MenuButton from "./MenuButton";
import './Navbar.scss'

export default function Navbar({ onClick }) {
    return (
        <nav className="row">
            <a href="/">Video platform</a>
            <MenuButton onClick={onClick} />
        </nav>
    );
}
