import { useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { Role } from '../../../models/Role';
import useCustomToast from '../../../util/UseCustomToast';


type UserLogin = {
    username: string;
    password: string;
}

function LoginForm() {

    const { control, register, handleSubmit, reset, formState: { errors }, setValue } = useForm<UserLogin>({
        mode: 'all',

    });

    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const showToast = useCustomToast();


    const onSubmit = async (data: UserLogin) => {
        try {
            const userRoles = await login(data.username, data.password);
            if (userRoles?.length > 0) {
                if (userRoles.includes(Role.ADMIN) || userRoles.includes(Role.STAFF)) {
                    navigate('/admin');
                } else {
                    const redirectTo = location.state?.from || '/';
                    console.log('Login successful, redirecting to:', redirectTo);
                    navigate(redirectTo, { replace: true });
                }
            } else {
                showToast('Login failed - wrong user name or password', 'error')
            }
        } catch (error) {
            showToast(`${error} `, 'error');
        }
    };



    return (
        <div className="login">
            <strong>Sign in</strong>

            <form action="" onSubmit={handleSubmit(onSubmit)}>
                {/* email */}
                <label htmlFor="">Email <span>*</span> </label>
                <div className="login-input-group">
                    <i className='far fa-paper-plane'></i>
                    <input {...register("username")} type="text" required />
                </div>

                <label htmlFor="">Password <span>*</span> </label>
                <div className="login-input-group">
                    <i className='fas fa-lock'></i>
                    <input {...register("password")} type="password" required />
                </div>

                <div className='btns'>
                    <button type="submit">Login</button>
                </div>
                <a href="#!" className='forget'>Forget your password?</a>

            </form>

            <div className="intro-text">
                <span>Welcome to this site</span>

            </div>
        </div>

    )
}

export default LoginForm