import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import Login from '../components/Login'
import AuthModal from '../components/AuthModal'
import { useAuth } from '../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export type Auth = {
    open: boolean;
    form: string;

}




function LoginPage() {
    const [isAuth, setIsAuth] = useState({ open: false, form: 'login' })
    const { user } = useAuth();
    const navigate = useNavigate();
    useEffect(() => {

        if (user) {
            navigate("/")
        }
    }, [user]);

    return (
        <>
            <Login isAuth={isAuth} setIsAuth={setIsAuth} />
            <AuthModal isAuth={isAuth} setIsAuth={setIsAuth} />

        </>
    )
}

export default LoginPage