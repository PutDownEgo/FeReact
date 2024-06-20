import React, { Dispatch, SetStateAction } from 'react'

import '../styles/AuthModal.css'
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import { Auth } from '../page/LoginPage';

type MyComponentProps = {
    isAuth: Auth;
    setIsAuth: Dispatch<SetStateAction<Auth>>;
}

function AuthModal({ isAuth, setIsAuth }: MyComponentProps) {
    const switchToLogin = () => {
        setIsAuth({ open: true, form: 'login' });
    };
    return (
        <div id="Auth" className={`${isAuth.open ? 'show' : ''}`}>

            <a href="#!" className='close' onClick={() => setIsAuth({ ...isAuth, open: false })}>
                <i className='fas fa-times'></i>
            </a>
            <div className="content">
                {isAuth.form === 'login' && <LoginForm />}
                {isAuth.form === 'register' && <RegisterForm switchToLogin={switchToLogin} />}
            </div>
        </div>
    )
}

export default AuthModal