import { useRef, useState, useEffect } from 'react';
import useAuth from '../hooks/useAuth';
import { Link, useNavigate, useLocation } from 'react-router-dom';

import axios from '../api/axios';
const LOGIN_URL = 'auth/login';

const Login = () => {
    const { setAuth } = useAuth();

    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";

    const emailRef = useRef();
    const errRef = useRef();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errMsg, setErrMsg] = useState('');

    useEffect(() => {
        emailRef.current.focus();
    }, [])

    useEffect(() => {
        setErrMsg('');
    }, [email, password])

    const decodeJwt = (token) => {
        const arrayToken = token.split('.')
        const tokenPayload = JSON.parse(atob(arrayToken[1]))
        return tokenPayload
        // console.log(tokenPayload);
        // return Math.floor(new Date().getTime() / 1000) >= tokenPayload?.sub;
    }
    const getRolesToken = async (token) => {
        const data = await decodeJwt(token)
        console.log(data);
        const arrayRoles = data.scope.split(' ')
        console.log(arrayRoles)
        return arrayRoles
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(LOGIN_URL, { email, password } )
            console.log(response)
            const accessToken = response?.data
            const roles = await getRolesToken(accessToken)
            console.log("roles")
            console.log(roles)
            setAuth({ email, password, roles, accessToken })
            setEmail('');
            setPassword('');
            navigate(from, { replace: true });
            
        } catch (err) {
            if (!err?.response) {
                setErrMsg('No Server Response');
            } else if (err.response?.status === 400) {
                setErrMsg('Missing Username or Password');
            } else if (err.response?.status === 401) {
                setErrMsg('Unauthorized');
            } else {
                setErrMsg('Login Failed');
            }
            errRef.current.focus();
        }
    }

    return (
    <section className="login-container">
        <p ref={errRef} className={errMsg? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
        <h1 className='h1login'>Sign In</h1>
        <form onSubmit={handleSubmit} className="login-form">
        <label htmlFor="emailname">Username:</label>
        <input
            placeholder='email'
            type="text"
            id="emailname"
            ref={emailRef}
            autoComplete="off"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            required
            className="input-field"
        />

        <label htmlFor="password">Password:</label>
        <input
            placeholder='password'
            type="password"
            id="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            required
            className="input-field"
        />
        <button className="login-btn">Sign In</button>
        </form>
        <p>
        Need an Account?<br />
        <span className="line">
            <Link to="/register">Sign Up</Link>
        </span>
        </p>
    </section>

    )
}

export default Login
