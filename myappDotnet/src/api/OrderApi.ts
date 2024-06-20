import axios from "axios"
import { Order, OrderRequest, ResultOrder, OrderStatus } from '../models/Order';
import { ResponseData, ResponseData1 } from "../models/Product";
import privateApi from "./privateApi";
import { SalesMonthlyData } from "../GUI/admin/page/Dashboard";

export const createOrder = async (order: Order): Promise<ResponseData1<OrderRequest>> => {
    try {
        const response = await privateApi.post<ResponseData1<OrderRequest>>('/api/v1/orders', order);
        if (response.data.code !== 1000) throw new Error("Error");

        return response.data;
    } catch (error) {
        console.error(error);

        throw error;
    }
}

export const createOrderWithPayment = async (order: Order): Promise<String> => {
    try {
        const response = await privateApi.post<String>('/api/v1/vnpayment/neworder', order);

        return response.data;
    } catch (error) {
        console.error(error);

        throw error;
    }
}

export const createOrderWithPayment2 = async (url: String): Promise<ResponseData1<OrderRequest>> => {
    try {
        const response = await privateApi.get<ResponseData1<OrderRequest>>('url');

        return response.data;
    } catch (error) {
        console.error(error);

        throw error;
    }
}

export const getAllOrders = async (): Promise<ResponseData1<ResultOrder>> => {
    try {
        const response = await privateApi.get<ResponseData1<ResultOrder>>('/api/v1/orders');
        console.log(response);
        if (response.data.code !== 1000) throw new Error("Error");

        return response.data;
    } catch (error) {
        console.error(error);

        throw error;
    }
}


export const getOrderById = async (id: number): Promise<ResponseData1<Order>> => {
    try {
        const response = await privateApi.get<ResponseData1<Order>>(`/api/v1/orders/${id}`);
        if (response.data.code !== 1000) throw new Error("Error");

        return response.data;
    } catch (error) {
        console.error(error);

        throw error;
    }
}


export const updateOrder = async (orderId: number, status: OrderStatus): Promise<ResponseData1<Order>> => {
    try {
        const response = await privateApi.put<ResponseData1<Order>>(
            `/api/v1/orders/${orderId}/status`,
            null,
            {
                params: {
                    orderId,
                    status,
                },
            }
        );

        if (response.data.code !== 1000) throw new Error("Error");

        return response.data;
    } catch (error) {
        console.error(error);

        throw error;
    }
}

export const getOrderByUser = async (): Promise<ResponseData<Order>> => {
    try {
        const response = await privateApi.get<ResponseData<Order>>(`/api/v1/orders/user`);
        if (response.data.code !== 1000) throw new Error("Error");

        return response.data;
    } catch (error) {
        console.error(error);

        throw error;
    }
}


export const getNumsOfOrderDaily = async (): Promise<ResponseData1<number>> => {
    try {
        const response = await privateApi.get<ResponseData1<number>>(`/api/v1/orders/daily-sales`);
        if (response.data.code !== 1000) throw new Error("Error");

        return response.data;
    } catch (error) {
        console.error(error);

        throw error;
    }
}


export const getRevenueMonthly = async (): Promise<ResponseData<SalesMonthlyData>> => {
    try {
        const response = await privateApi.get<ResponseData<SalesMonthlyData>>(`/api/v1/orders/monthly-sales`);
        if (response.data.code !== 1000) throw new Error("Error");

        return response.data;
    } catch (error) {
        console.error(error);

        throw error;
    }
}


export const getRevenueAtCurrentMonth = async (): Promise<ResponseData1<number>> => {
    try {
        const response = await privateApi.get<ResponseData1<number>>(`/api/v1/orders/monthly-sales-revenue`);
        if (response.data.code !== 1000) throw new Error("Error");

        return response.data;
    } catch (error) {
        console.error(error);

        throw error;
    }
}


export const getRevenueAtCurrentYear = async (): Promise<ResponseData1<number>> => {
    try {
        const response = await privateApi.get<ResponseData1<number>>(`/api/v1/orders/yearly-sales-revenue`);
        if (response.data.code !== 1000) throw new Error("Error");

        return response.data;
    } catch (error) {
        console.error(error);

        throw error;
    }
}


