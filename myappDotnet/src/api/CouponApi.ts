import { AxiosError } from "axios";
import { Coupon, CouponRequest } from "../models/Coupon";
import { ResponseData, ResponseData1 } from "../models/Product";
import privateApi from "./privateApi";
import { BackendError } from "./UserApi";
import qs from 'qs';

export const getAllCoupons = async (): Promise<ResponseData<Coupon>> => {
    try {
        const response = await privateApi.get<ResponseData<Coupon>>('/api/v1/coupons');
        if (response.data.code !== 1000) throw new Error("Error");

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


export const getCouponByCode = async (code: string): Promise<ResponseData1<Coupon>> => {
    try {
        const response = await privateApi.get<ResponseData1<Coupon>>(`/api/v1/coupons/code/${code}`);

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


export const createNewCoupon = async (couponRequest: CouponRequest): Promise<ResponseData1<Coupon>> => {
    try {
        const response = await privateApi.post<ResponseData1<Coupon>>('/api/v1/coupons', couponRequest);
        if (response.data.code !== 1000) throw new Error("Error");
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


export const deleteCoupons = async (ids: number[]): Promise<ResponseData1<String>> => {
    try {
        const response = await privateApi.delete<ResponseData1<String>>('/api/v1/coupons', {
            params: { ids },
            paramsSerializer: params => qs.stringify(params, { arrayFormat: 'repeat' })
        });
        return response.data.message ? response.data : { code: 1000, result: "Success" };
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




