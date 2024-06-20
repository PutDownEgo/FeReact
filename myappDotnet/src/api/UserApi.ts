import { AxiosError } from "axios";
import { NewSystemUserRequest, User, UserRequest } from "../models/User";
import { ResponseData, ResponseData1 } from "../models/Product";
import privateApi from './privateApi';
import { Auth } from "../models/Auth";
import publicApi from "./publicApi";
import qs from 'qs';


export interface BackendError {
    code: number;
    message: string;
}

export const createNewUser = async (user: UserRequest): Promise<ResponseData1<User>> => {
    try {
        const response = await privateApi.post<ResponseData1<User>>('/api/v1/accounts/signup', user);

        return response.data;

    } catch (error) {
        const axiosError = error as AxiosError<BackendError>;
        if (axiosError.response && axiosError.response.data) {
            const backendError = axiosError.response.data;
            console.error(`Error Code: ${backendError.code}, Message: ${backendError.message}`);
            throw new Error(backendError.message);
        } else {
            console.error('An unexpected error occurred:', error);
            throw new Error('An unexpected error occurred, please try again later.');
        }
    }
}
export const createNewSystemUser = async (formData: FormData): Promise<ResponseData1<User>> => {
    try {
        const response = await privateApi.post<ResponseData1<User>>('/api/v1/accounts/admins', formData);
        return response.data;
    } catch (error) {
        const axiosError = error as AxiosError<BackendError>;
        if (axiosError.response && axiosError.response.data) {
            const backendError = axiosError.response.data;
            console.error(`Error Code: ${backendError.code}, Message: ${backendError.message}`);
            throw new Error(backendError.message);
        } else {
            console.error('An unexpected error occurred:', error);
            throw new Error('An unexpected error occurred, please try again later.');
        }
    }
}


export const updateSystemUser = async (formData: FormData, userId: number): Promise<ResponseData1<User>> => {
    try {
        const response = await privateApi.put<ResponseData1<User>>(`/api/v1/accounts/admins/${userId}`, formData);
        return response.data;
    } catch (error) {
        const axiosError = error as AxiosError<BackendError>;
        if (axiosError.response && axiosError.response.data) {
            const backendError = axiosError.response.data;
            console.error(`Error Code: ${backendError.code}, Message: ${backendError.message}`);
            throw new Error(backendError.message);
        } else {
            console.error('An unexpected error occurred:', error);
            throw new Error('An unexpected error occurred, please try again later.');
        }
    }
}

export const authenticate = async (username: string, password: string): Promise<ResponseData1<Auth>> => {
    try {
        const response = await publicApi.post('/api/v1/accounts/token', { username, password });
        return response.data;
    } catch (error) {
        const axiosError = error as AxiosError<BackendError>;
        if (axiosError.response && axiosError.response.data) {
            const backendError = axiosError.response.data;
            console.error(`Error Code: ${backendError.code}, Message: ${backendError.message}`);
            throw new Error(backendError.message);
        } else {
            console.error('An unexpected error occurred:', error);
            throw new Error('An unexpected error occurred, please try again later.');
        }
    }
}


export const fetchUserInfo = async (accessToken: string) => {

    try {
        const response = await publicApi.get('/api/v1/accounts/me', {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        return response.data;
    } catch (error) {
        console.error('Error fetching user info:', error);
        throw error;
    }


};



export const fetchUserInfoPage = async (): Promise<ResponseData1<User>> => {

    try {
        const response = await privateApi.get('/api/v1/accounts/me');
        if (response.data.code !== 1000) throw new Error(response.data.message);

        return response.data;
    } catch (error) {
        console.error('Error fetching user info:', error);
        throw error;
    }


};


export const updateUser = async (formData: FormData): Promise<ResponseData1<User>> => {
    try {
        const response = await privateApi.put<ResponseData1<User>>('/api/v1/accounts', formData);
        return response.data;
    } catch (error) {
        const axiosError = error as AxiosError<BackendError>;
        if (axiosError.response && axiosError.response.data) {
            const backendError = axiosError.response.data;
            console.error(`Error Code: ${backendError.code}, Message: ${backendError.message}`);
            throw new Error(backendError.message);
        } else {
            console.error('An unexpected error occurred:', error);
            throw new Error('An unexpected error occurred, please try again later.');
        }
    }

}

export const updateUserProfileById = async (userId: number, formData: FormData): Promise<ResponseData1<User>> => {
    try {
        const response = await privateApi.put<ResponseData1<User>>('/api/v1/accounts/' + userId, formData);
        return response.data;
    } catch (error) {
        const axiosError = error as AxiosError<BackendError>;
        if (axiosError.response && axiosError.response.data) {
            const backendError = axiosError.response.data;
            console.error(`Error Code: ${backendError.code}, Message: ${backendError.message}`);
            throw new Error(backendError.message);
        } else {
            console.error('An unexpected error occurred:', error);
            throw new Error('An unexpected error occurred, please try again later.');
        }
    }

}


export const getAllCustomer = async (): Promise<ResponseData<User>> => {
    try {
        const response = await privateApi.get<ResponseData<User>>('/api/v1/accounts/customers');
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const getAllAdmin = async (): Promise<ResponseData<User>> => {
    try {
        const response = await privateApi.get<ResponseData<User>>('/api/v1/accounts/admins');
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}


export const getUserById = async (userId: number): Promise<ResponseData1<User>> => {
    try {
        const response = await privateApi.get<ResponseData1<User>>(`/api/v1/accounts/${userId}`);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}


export const getSystemUserById = async (userId: number): Promise<ResponseData1<User>> => {
    try {
        const response = await privateApi.get<ResponseData1<User>>(`/api/v1/accounts/admins/${userId}`);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}


export const deleteCustomersByIds = async (ids: number[]): Promise<ResponseData1<String>> => {
    try {
        const response = await privateApi.delete<ResponseData1<String>>(`/api/v1/accounts/customers`, {
            params: { ids },
            paramsSerializer: params => qs.stringify(params, { arrayFormat: 'repeat' })
        });
        if (response.data.code !== 1000) throw new Error("Error: " + response.data.message);

        return response.data.message ? response.data : { code: 1000, result: "Success" };
    } catch (error) {
        console.error(error);
        throw error;
    }
}





