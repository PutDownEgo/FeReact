import { Dispatch, SetStateAction, useEffect } from 'react';
import { OAuthConfig } from '../../../config/OAuthConfig';
import { Auth } from '../page/LoginPage';
import IMG from "../styles/email.svg";
import "../styles/login.css";
import { useNavigate } from 'react-router-dom';


type MyComponentProps = {
    isAuth: Auth;
    setIsAuth: Dispatch<SetStateAction<Auth>>;
}
const Login = ({ isAuth, setIsAuth }: MyComponentProps) => {
    const navigate = useNavigate();

    const handleClickToGooleLogin = () => {
        const callbackUrl = OAuthConfig.redirectUri;
        const authUrl = OAuthConfig.authUri;
        const googleClientId = OAuthConfig.clientId;

        const targetUrl = `${authUrl}?redirect_uri=${encodeURIComponent(
            callbackUrl
        )}&response_type=code&client_id=${googleClientId}&scope=openid%20email%20profile`;

        console.log(targetUrl);

        window.location.href = targetUrl;
    };

    useEffect(() => {
        const accessToken = localStorage.getItem("accessToken");

        if (accessToken) {
            navigate("/");
        }
    }, [navigate]);

    return (
        <div id='login-Home' className={`${isAuth.open ? 'active' : ''}`}>
            <div className="login-container">

                <div className="login-img">
                    <img src={IMG} alt="IMG" />
                </div>

                <div className="login-text-btns">
                    <p>Welcome to my website</p>

                    <div className="login-btns" >
                        <a href="#!" className='login-login-btn' onClick={() => setIsAuth({ open: true, form: 'login' })}>Login</a>

                        <a href="#!" className='login-register-btn' onClick={() => setIsAuth({ open: true, form: 'register' })}>Register</a>
                    </div>
                    <span>Or via Social Media</span>
                    <div className="login-via-social">
                        <a >
                            <i className="fab fa-facebook-f"></i>
                        </a>

                        <a onClick={handleClickToGooleLogin}>
                            <i className="fab fa-google"></i>
                        </a>

                        <a href="">
                            <i className="fab fa-twitter"></i>
                        </a>
                    </div>
                </div>


            </div>



        </div>
    )
}

export default Login