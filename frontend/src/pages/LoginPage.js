import { useState, useContext } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { UserContext } from '../UserContext';
import PersonIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/Lock';
import '../styles/login.css';

export default function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [redirect, setRedirect] = useState(false);
    const { setUserInfo } = useContext(UserContext);

    async function login(ev) {
        ev.preventDefault();
        const response = await fetch('http://localhost:4000/login', {
            method: 'POST',
            body: JSON.stringify({ username, password }),
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
        });

        if (response.ok) {
            response.json().then(userInfo => {
                setUserInfo(userInfo);
                setRedirect(true);
            });
        } else {
            alert('Wrong credentials');
        }
    }

    if (redirect) {
        return <Navigate to="/index" />;
    }

    return (
        <div className="login-container">
            <div className="login-box">
                <h2 className="login-title">Welcome Back!</h2>
                <p className="login-subtitle">Log into your account</p>
                <form className="login-form" onSubmit={login}>
                    <div className="input-wrapper">
                        <PersonIcon className="input-icon" />
                        <input
                            type="text"
                            className="input-field"
                            placeholder="Username"
                            value={username}
                            onChange={ev => setUsername(ev.target.value)}
                            required
                        />
                    </div>
                    <div className="input-wrapper">
                        <LockIcon className="input-icon" />
                        <input
                            type="password"
                            className="input-field"
                            placeholder="Password"
                            value={password}
                            onChange={ev => setPassword(ev.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="login-button">Login</button>
                </form>
                <p className="signup-link">
                    Don't have an account? <Link to="/register">Sign Up</Link>
                </p>
            </div>
        </div>
    );
}