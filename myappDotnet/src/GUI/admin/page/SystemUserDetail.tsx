import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { DatePicker } from 'rsuite';
import 'rsuite/DatePicker/styles/index.css';
import { createNewSystemUser, getSystemUserById, updateSystemUser } from '../../../api/UserApi';
import { Gender, NewSystemUserRequest, NewSystemUserSchema, Role, UpdateSystemUserRequest, UpdateSystemUserSchema, User, UserStatus } from '../../../models/User';
import LocationSelector from '../../../util/LocationSelector';
import useCustomToast from '../../../util/UseCustomToast';

function SystemUserDetail() {
    const { id } = useParams();
    const userIdNumber = Number(id) || 0;
    const isUpdateMode = userIdNumber !== 0;
    const [user, setUser] = useState<User>();
    const [profileImage, setProfileImage] = useState<string>("/avatar.jpg");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [address, setAddress] = useState('');
    const showToastMessage = useCustomToast();
    const [userNotFound, setUserNotFound] = useState<boolean>(false);
    const navigate = useNavigate();
    const { control, register, handleSubmit, reset, formState: { errors }, setValue } = useForm<NewSystemUserRequest | UpdateSystemUserRequest>({
        mode: 'all',
        resolver: zodResolver(isUpdateMode ? UpdateSystemUserSchema : NewSystemUserSchema),
        defaultValues: {
            firstName: '',
            lastName: '',
            email: '',
            address: '',
            phoneNumber: '',
            dateOfBirth: new Date(1990, 1, 1),
            gender: Gender.MALE,
            status: UserStatus.ACTIVE,
            username: '',
            password: '',
            roles: Role.STAFF,
        }
    });

    useEffect(() => {
        if (isUpdateMode) {
            const fetchUser = async () => {
                try {
                    const data = await fetchUserById(userIdNumber);
                    if (data) {
                        setUser(data);
                    } else {
                        setUserNotFound(true);
                    }
                } catch (error) {
                    console.error("Failed to fetch user:", error);
                }
            };

            fetchUser();
        }
    }, [userIdNumber, isUpdateMode]);

    const fetchUserById = async (userId: number) => {
        try {
            const response = await getSystemUserById(userId);
            if (response.result) {
                setEditUser(response.result);
                return response.result;
            } else {
                return null;
            }
        } catch (error) {
            console.error("Failed to fetch user:", error);
            return null;
        }
    };

    const setEditUser = (user: User) => {
        setValue('firstName', user.firstName);
        setValue('lastName', user.lastName);
        setValue('email', user.email);
        setValue('address', user.address);
        setValue('phoneNumber', user.phoneNumber);
        setValue('dateOfBirth', user.dateOfBirth);
        setValue('status', user.status);
        setValue('username', user.username);
        if (user.roles) setValue('roles', user.roles);
        setAddress(user.address);
        setUser(user);
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

    const onSubmit = async (data: NewSystemUserRequest | UpdateSystemUserRequest) => {
        const formData = new FormData();
        formData.append('user', JSON.stringify(data));
        if (selectedFile) formData.append('file', selectedFile);

        try {
            if (isUpdateMode) {
                await updateSystemUser(formData, userIdNumber);
                showToastMessage('User updated successfully', 'success');
            } else {
                await createNewSystemUser(formData);
                showToastMessage('User created successfully', 'success');
                navigate("/admin/users")
            }
            resetFormState();
            if (isUpdateMode) fetchUserById(userIdNumber);
        } catch (error) {
            showToastMessage('Error submitting user data', 'error');
            console.error('Error submitting user data:', error);
        }
    };

    const { getRootProps, getInputProps } = useDropzone({ onDrop });


    if (userNotFound) {
        return <div className="container">User not found</div>;
    }

    return (
        <div className="container">
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
                            <span className="mt-3 font-weight-bold">{user?.username}</span>
                            <span className="text-black-50">{user?.email}</span>
                        </div>
                    </div>
                    <div className="col-md-9 border-right">
                        <div className="p-3 py-5">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h4 className="text-right">Profile Settings</h4>
                            </div>
                            <div className="row">
                                <div className="col-md-6 mt-3">
                                    <label className="form-label">Username</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        {...register("username")}
                                        required={!isUpdateMode}
                                        disabled={isUpdateMode}
                                    />
                                    {errors.username &&
                                        <div className="text-danger small">{errors.username.message}</div>}
                                </div>
                                <div className="col-md-6 mt-3">
                                    <label className="form-label">Password</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        {...register("password")}
                                        required={!isUpdateMode}
                                    />
                                    {errors.password &&
                                        <div className="text-danger small">{errors.password.message}</div>}
                                </div>
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
                                    <label className="form-label">Last Name</label>
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
                            <div className="row">
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
                                <div className="col-md-6 mt-3">
                                    <label className="form-label">Date Of Birth</label>
                                    <Controller
                                        name="dateOfBirth"
                                        control={control}
                                        defaultValue={user?.dateOfBirth}
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
                                <div className="col-md-6 mt-3">
                                    <label className="form-label">Gender</label>
                                    <select
                                        className="form-control"
                                        {...register("gender")}
                                        required
                                    >
                                        <option value={Gender.MALE}>Male</option>
                                        <option value={Gender.FEMALE}>Female</option>
                                        <option value={Gender.OTHER}>Other</option>
                                    </select>
                                    {errors.gender &&
                                        <div className="text-danger small">{errors.gender.message}</div>}
                                </div>
                                <div className="col-md-6 mt-3">
                                    <label className="form-label">Status</label>
                                    <select
                                        className="form-control"
                                        {...register("status")}
                                        required
                                    >
                                        <option value={UserStatus.INACTIVE}>INACTIVE</option>
                                        <option value={UserStatus.ACTIVE}>ACTIVE</option>
                                    </select>
                                    {errors.status &&
                                        <div className="text-danger small">{errors.status.message}</div>}
                                </div>
                                <div className="col-md-6 mt-3">
                                    <label className="form-label">Role</label>
                                    <select
                                        className="form-control"
                                        {...register("roles")}
                                        required
                                    >
                                        <option value={Role.ADMIN}>Admin</option>
                                        <option value={Role.STAFF}>Staff</option>
                                    </select>
                                    {errors.roles &&
                                        <div className="text-danger small">{errors.roles.message}</div>}
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
                                <button className="btn btn-primary profile-button" type="submit">
                                    {isUpdateMode ? 'Update Profile' : 'Create Profile'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default SystemUserDetail;
