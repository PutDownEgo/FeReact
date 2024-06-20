import { zodResolver } from '@hookform/resolvers/zod';
import React, { useCallback, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Controller, useForm } from 'react-hook-form';
import { DatePicker } from 'rsuite';
import 'rsuite/DatePicker/styles/index.css';
import { fetchUserInfoPage, updateUser } from '../../../api/UserApi';
import { GenderEnum, UpdateUserRequest, UpdateUserRequestSchema, User, UserStatus } from '../../../models/User';
import LocationSelector from '../../../util/LocationSelector';
import useCustomToast from '../../../util/UseCustomToast';
import "../styles/UserProfile.css";



const UserProfilePage: React.FC = () => {
    const [currentUser, setCurrenUser] = useState<User>();
    const [dob, setDob] = React.useState(new Date());
    const [profileImage, setProfileImage] = useState<string>("/avatar.jpg");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const showToastMessage = useCustomToast();
    const [address, setAddress] = useState('');
    const { control, register, handleSubmit, reset, formState: { errors }, setValue } = useForm<UpdateUserRequest>({
        mode: 'all',
        resolver: zodResolver(UpdateUserRequestSchema),
        defaultValues: {
            firstName: '',
            lastName: '',
            email: '',
            address: '',
            phoneNumber: '',
            dateOfBirth: new Date(1990, 1, 1),
            gender: GenderEnum.parse('MALE')

        }
    });

    useEffect(() => {
        getUserInfo();
    }, []);


    const getUserInfo = async () => {

        try {
            const response = await fetchUserInfoPage();
            const user = response.result;
            setEditUser(user);
            console.log('User:', user);

        } catch (error) {
            showToastMessage('Error fetching user', 'error');
            console.error('Error fetching product:', error);
        }
    };

    const setEditUser = (user: User) => {
        setValue('firstName', user.firstName);
        setValue('lastName', user.lastName);
        setValue('email', user.email);
        setValue('address', user.address);
        setValue('phoneNumber', user.phoneNumber);
        setValue('dateOfBirth', user.dateOfBirth);
        setAddress(user.address);
        setCurrenUser(user);
        setProfileImage(user.avatar || "/avatar.jpg");
    };

    const onDrop = useCallback((acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        setSelectedFile(file);
        const reader = new FileReader();

        reader.onload = () => {
            setProfileImage(reader.result as string);
        };

        reader.readAsDataURL(file);
    }, []);

    const resetFormState = () => {
        reset();
        setSelectedFile(null);

    };

    const onSubmit = async (data: UpdateUserRequest) => {

        const formData = new FormData();
        formData.append('user', JSON.stringify(data));
        if (selectedFile)
            formData.append('file', selectedFile);

        try {
            await updateUser(formData);
            showToastMessage('User updated successfully', 'success');
            resetFormState();
            getUserInfo();
        } catch (error) {
            showToastMessage(`${error} `, 'error');
            console.error('Error updating user:', error);
        }
    };


    const { getRootProps, getInputProps } = useDropzone({ onDrop });
    return (
        <>
            <div className="container rounded bg-white mt-5 mb-5">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="row">
                        <div className="col-md-3 border-right">
                            <div className="d-flex flex-column align-items-center text-center p-3 py-5">
                                <div {...getRootProps()} className="dropzone">
                                    <input {...getInputProps()} />
                                    <img
                                        style={{ border: "1px solid #81c408" }}
                                        className="rounded-circle mt-5 border-1"
                                        width={200}
                                        height={200}
                                        src={profileImage}
                                        alt="profile"
                                    />

                                </div>
                                <span className="small mt-3">Drag & drop image here, or click to select one</span>
                                <span className="mt-3 font-weight-bold">{currentUser?.username}</span>
                                <span className="text-black-50">{currentUser?.email}</span>
                                <span> </span>
                            </div>
                        </div>
                        <div className="col-md-6 border-right">
                            <div className="p-3 py-5">
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <h4 className="text-right">Profile Settings</h4>
                                </div>
                                <div className="row ">
                                    <div className="col-md-6 mt-3">
                                        <label className="form-label">First Name</label>
                                        <input
                                            type="text"
                                            className="form-control"

                                            {...register("firstName")}
                                            required
                                        />
                                        {errors.firstName &&
                                            <div className="text-danger small">{errors.firstName.message}</div>}
                                    </div>
                                    <div className="col-md-6 mt-3">
                                        <label className="form-label">Last name</label>
                                        <input
                                            type="text"
                                            className="form-control"

                                            {...register("lastName")}
                                            required
                                        />
                                        {errors.lastName &&
                                            <div className="text-danger small">{errors.lastName.message}</div>}
                                    </div>
                                </div>
                                <div className="row ">
                                    <div className="col-md-6 mt-3">
                                        <label className="form-label">Mobile Number</label>
                                        <input
                                            type="text"
                                            className="form-control"

                                            {...register("phoneNumber")}
                                            required
                                        />
                                        {errors.phoneNumber &&
                                            <div className="text-danger small">{errors.phoneNumber.message}</div>}
                                    </div>
                                    <div className="col-md-6 mt-3">
                                        <label className="form-label">Email</label>
                                        <input
                                            type="text"
                                            className="form-control"

                                            {...register("email")}
                                            required
                                        />
                                        {errors.email &&
                                            <div className="text-danger small">{errors.email.message}</div>}
                                    </div>
                                    <div className="col-md-12 mt-3">
                                        <label className="form-label">Date Of Birth</label>
                                        <Controller
                                            name="dateOfBirth"
                                            control={control}
                                            defaultValue={currentUser?.dateOfBirth}
                                            render={({ field }) => (
                                                <DatePicker
                                                    style={{ width: '100%' }}
                                                    {...field}
                                                    format="dd.MM.yyyy"
                                                    onChange={value => field.onChange(value)}
                                                    value={field.value ? new Date(field.value) : null}
                                                />
                                            )}
                                        />
                                        {errors.dateOfBirth &&
                                            <div className="text-danger small">{errors.dateOfBirth.message}</div>}
                                    </div>
                                    <div className="col-md-12 mt-3">
                                        <label className="form-label">Address <sup>*</sup></label>
                                        <LocationSelector onAddressChange={setAddress} />
                                        <input

                                            {...register("address")}
                                            value={address}
                                            onChange={e => {
                                                setValue("address", e.target.value);
                                            }}
                                            type="text"
                                            className="form-control"

                                        />
                                        {errors.address &&
                                            <div className="text-danger small">{errors.address.message}</div>}
                                    </div>



                                </div>

                                <div className="mt-5 text-center">
                                    <button className="btn btn-primary profile-button" type="submit">Save Profile</button>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="p-3 py-5">
                                <div className="d-flex justify-content-between align-items-center experience">
                                    <span>Edit Experience</span>
                                    <span className="border px-3 p-1 add-experience">
                                        <i className="fa fa-plus"></i>&nbsp;Experience
                                    </span>
                                </div>
                                <div className="col-md-12">
                                    <label className="labels">Experience in Designing</label>
                                    <input type="text" className="form-control" placeholder="experience" value="" />
                                </div>
                                <div className="col-md-12">
                                    <label className="labels">Additional Details</label>
                                    <input type="text" className="form-control" placeholder="additional details" value="" />
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </>
    );
}

export default UserProfilePage;
