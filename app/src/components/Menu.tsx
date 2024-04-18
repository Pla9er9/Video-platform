import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import './Menu.scss'

export default function Menu() {
    const token = useSelector((state: RootState) => state.token.value);
    
    return (
        <div id="menu" className='column'>
            <a href="/">Home</a>
            {token ? <>
                <a href="/upload">Upload video</a>
                <a href="/settings">Settings</a>
            </> : <>
                <a href="/login">Login</a>
                <a href="/registration">Sign up</a>
            </>}
        </div>
    )
}