import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Controller, useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { DatePicker } from 'rsuite';
import 'rsuite/DatePicker/styles/index.css';
import { getUserById, updateUserProfileById } from '../../../api/UserApi';
import { GenderEnum, UpdateUserRequest, UpdateUserRequestSchema, User, UserStatus } from '../../../models/User';
import LocationSelector from '../../../util/LocationSelector';
import useCustomToast from '../../../util/UseCustomToast';

function CustomerDetail() {
    const { id } = useParams();

    const [userStatus, setUserStatus] = useState<UserStatus[]>([UserStatus.ACTIVE, UserStatus.INACTIVE]);
    const showToastMessage = useCustomToast();
    const [user, setUser] = useState<User>();
    const [profileImage, setProfileImage] = useState<string>("");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [userNotFound, setUserNotFound] = useState<boolean>(false);
    const [address, setAddress] = useState('');
    const { control, register, handleSubmit, reset, formState: { errors }, setValue } = useForm<UpdateUserRequest>({
        mode: 'all',
        resolver: zodResolver(UpdateUserRequestSchema),
        defaultValues: {
            firstName: '',
            lastName: '',
            emailAddress: '',
            address: '',
            phoneNumber: '',
            dateOfBirth: new Date(1990, 1, 1),
            gender: GenderEnum.parse('MALE'),
            status: UserStatus.ACTIVE
        }
    });


    useEffect(() => {

        const fetchUser = async () => {
            try {
                const data = await fetchUserById(id?.toString() || '');
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
    }, [id]);

    const fetchUserById = async (userId: string) => {
        try {
            const response = await getUserById(id?.toString() || '');
            setEditUser(response.result);
            return response.result;

        } catch (error) {
            console.error("Failed to fetch products:", error);
        }
    };

    const setEditUser = (user: User) => {
        setValue('firstName', user.firstName);
        setValue('lastName', user.lastName);
        setValue('emailAddress', user.email);
        setValue('address', user.address);
        setValue('phoneNumber', user.phoneNumber);
        setValue('dateOfBirth', user.dateOfBirth);
        setValue("status", user.status);
        setAddress(user.address);
        setUser(user);
        setProfileImage(user.avatar);
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
            const response = await updateUserProfileById(id?.toString() || '', formData);
            showToastMessage('User updated successfully', 'success');
            resetFormState();
            fetchUserById(id?.toString() || '')
        } catch (error) {
            showToastMessage('Error updating user', 'error');
            console.error('Error updating user:', error);
        }
    };

    const { getRootProps, getInputProps } = useDropzone({ onDrop });

    if (userNotFound) {
        return <div className="container">User not found</div>;
    }

    return (
        <>
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

                                            {...register("emailAddress")}
                                            required
                                        />
                                        {errors.emailAddress &&
                                            <div className="text-danger small">{errors.emailAddress.message}</div>}
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
                                            <option value="MALE">Male</option>
                                            <option value="FEMALE">Female</option>
                                            <option value="OTHER">Other</option>
                                        </select>
                                        {errors.gender &&
                                            <div className="text-danger small">{errors.gender.message}</div>}
                                    </div>

                                    <div className="col-md-12 mt-3">
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
                        {/* <div className="col-md-3">
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
                            </div> */}
                    </div>
                </form>

            </div>
        </>
    )
}

export default CustomerDetail