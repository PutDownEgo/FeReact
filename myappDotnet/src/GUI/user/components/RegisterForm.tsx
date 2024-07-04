import React, { useEffect, useState } from 'react'
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from 'react-datepicker';
import { subYears } from 'date-fns';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { UserRequest, UserRequestSchema } from '../../../models/User';
import { createNewUser } from '../../../api/UserApi';
import useCustomToast from '../../../util/UseCustomToast';


type RegisterFormProps = {
    switchToLogin: () => void;
};

const RegisterForm = ({ switchToLogin }: RegisterFormProps) => {
    const [isErrorInput, setIsErrorInput] = useState<boolean>(false);
    const [startDate, setStartDate] = useState(new Date());
    const showToast = useCustomToast();


    const [currIndex, setCurrIndex] = useState<number>(0);

    const plusIndex = (n: number) => {
        setCurrIndex(prev => prev + n);
    };

    const handleNext = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        plusIndex(1);
    };


    const { register, handleSubmit, reset, formState: { errors }, setValue } = useForm<UserRequest>({
        mode: 'all',
        resolver: zodResolver(UserRequestSchema),
        defaultValues: {
            username: '',
            password: '',
            firstName: '',
            lastName: '',
            email: '',
            phoneNumber: '',
            dateOfBirth: new Date(),
            gender: 'OTHER'
        }
    });

    useEffect(() => {
        register('dateOfBirth');
    }, [register]);




    const onSubmit = async (data: UserRequest) => {
        console.log(data);

        if (Object.keys(errors).length > 0) {
            showToast('Please complete all required fields.', 'error');
            setCurrIndex(0);
            return;
        }

        try {
            await createNewUser(data);
            showToast('Register new account successful', 'success');
            customResetDefault();
            switchToLogin();
        } catch (error: any) {
            let errorMessage = 'Error creating account.';

            if (error.response && error.response.data && error.response.data.length > 0) {
                const firstError = error.response.data[0];
                errorMessage = firstError.description || 'Unknown error.';
            }

            showToast(errorMessage, 'error');
            console.error('Error creating account:', error);
            setCurrIndex(0);

        }

    };

    const customResetDefault = () => {
        setCurrIndex(0);
        reset();

    }


    return (
        <div className="register">
            <strong>Sign up</strong>
            <div className="login-progress-bar">
                <ul>
                    <div className="progress"></div>
                    {
                        ["Name", "Contact", "Birth", "Submit"].map((item, index) => (
                            <li key={item} data-title={item}
                                className={`${currIndex >= index ? 'active' : ''} `}>
                                {index + 1}
                            </li>
                        ))
                    }


                </ul>
            </div>
            <div className="wrapper" style={{ marginLeft: `${currIndex * -100}% ` }} >
                {/* Basic Info */}
                <form onSubmit={handleNext} >
                    {/* First Name */}
                    <label>First Name<span>*</span></label>
                    <div style={{
                        marginBottom: errors.firstName ? "0px" : "20px"
                    }} className="login-input-group">
                        <i className="fas fa-user"></i>

                        <input
                            style={{ paddingLeft: "8px" }}
                            {...register("firstName")}
                            type="text" required />

                    </div>
                    {(errors.firstName) && <div className="text-danger small">{errors.firstName.message}</div>}

                    {/* Last Name */}
                    <label>Last Name<span>*</span></label>
                    <div style={{
                        marginBottom: errors.lastName ? "0px" : "20px"
                    }}
                        className="login-input-group">
                        <i className="fas fa-user"></i>
                        <input
                            style={{ paddingLeft: "8px" }}
                            {...register("lastName")}
                            type="text" required />
                    </div>
                    {(errors.lastName) && <div className="text-danger small">{errors.lastName.message}</div>}

                    {/* Buttons */}
                    <div className="btns">
                        <button type='submit'>Next</button>
                    </div>
                </form>

                {/* Contact Info */}
                <form onSubmit={handleNext}>
                    {/* Email */}
                    <label>Email<span>*</span></label>
                    <div
                        style={{
                            marginBottom: errors.email ? "0px" : "20px"
                        }}
                        className="login-input-group">
                        <i className='far fa-paper-plane'></i>
                        <input
                            style={{ paddingLeft: "8px" }}
                            {...register("email")}
                            type="email" required />
                    </div>
                    {(errors.email) && <div className="text-danger small">{errors.email.message}</div>}

                    {/* Phone Number */}
                    <label>Phone Number<span>*</span></label>
                    <div
                        style={{
                            marginBottom: errors.phoneNumber ? "0px" : "20px"
                        }}
                        className="login-input-group">
                        <i className='fas fa-lock'></i>
                        <input
                            style={{ paddingLeft: "8px" }}
                            {...register("phoneNumber")}
                            type="number" required />
                    </div>
                    {(errors.phoneNumber) && <div className="text-danger small">{errors.phoneNumber.message}</div>}


                    {/* Buttons */}
                    <div className="btns">
                        <button type='button' onClick={() => plusIndex(-1)}>Prev</button>
                        <button type='submit'>Next</button>
                    </div>
                </form>

                {/* Date of Birth */}
                <form onSubmit={handleNext}>
                    {/* Date */}
                    <label>Date Of Birth<span>*</span></label>
                    <div
                        style={{
                            marginBottom: errors.dateOfBirth ? "0px" : "20px"
                        }}
                        className="login-input-group">
                        <i style={{ marginLeft: "-50px" }} className="fas fa-calendar-week"></i>

                        <DatePicker
                            dateFormat="dd/MM/yyyy"
                            selected={startDate}
                            minDate={new Date(1950, 0, 1)}
                            maxDate={subYears(new Date(), 14)}
                            showYearDropdown
                            showMonthDropdown
                            dropdownMode="select"
                            yearDropdownItemNumber={125}
                            scrollableYearDropdown
                            placeholderText="Select a date"
                            onChange={(date: Date) => {
                                setStartDate(date);
                                setValue('dateOfBirth', date, { shouldValidate: true });
                            }}
                        />
                    </div>
                    {(errors.dateOfBirth) && <div className="text-danger small">{errors.dateOfBirth.message}</div>}

                    {/* Gender */}
                    <label>Gender<span>*</span></label>
                    <div
                        style={{
                            marginBottom: errors.gender ? "0px" : "20px"
                        }} className="login-input-group">
                        <select   {...register("gender")}>
                            <option value="MALE">Male</option>
                            <option value="FEMALE">Female</option>
                            <option value="OTHER">Other</option>
                        </select>
                    </div>

                    {(errors.gender) && <div className="text-danger small">{errors.gender.message}</div>}


                    {/* Buttons */}
                    <div className="btns">
                        <button type='button' onClick={() => plusIndex(-1)}>Prev</button>
                        <button type='submit'>Next</button>
                    </div>
                </form>

                {/* Submit */}
                <form onSubmit={handleSubmit(onSubmit)}>
                    {/* User Name */}
                    <label>User Name<span>*</span></label>
                    <div
                        style={{
                            marginBottom: errors.username ? "0px" : "20px"
                        }}
                        className="login-input-group">
                        <i className="fas fa-user"></i>
                        <input
                            style={{ paddingLeft: "8px" }}
                            {...register("username")}
                            type="text" required />
                    </div>
                    {(errors.username) && <div className="text-danger small">{errors.username.message}</div>}

                    {/* Password */}
                    <label>Password<span>*</span></label>
                    <div
                        style={{
                            marginBottom: errors.password ? "0px" : "20px"
                        }}
                        className="login-input-group">
                        <i className='fas fa-lock'></i>
                        <input
                            style={{ paddingLeft: "8px" }}
                            {...register("password")}
                            type="password" required />

                    </div>
                    {(errors.password) && <div className="text-danger small">{errors.password.message}</div>}

                    {/* Buttons */}
                    <div className="btns">
                        <button type='button' onClick={() => plusIndex(-1)}>Prev</button>
                        <button type='submit'>Register</button>
                    </div>
                </form>

            </div >


            <div className="intro-text">
                <span>Welcome to this site</span>

            </div>
        </div >
    )
}

export default RegisterForm