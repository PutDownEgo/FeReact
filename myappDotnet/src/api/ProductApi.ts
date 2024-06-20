import qs from 'qs';
import publicApi from '../api/publicApi';
import { Category, MostSoldProduct, Product, ProductSearchString, ResponseData, ResponseData1, SalesByCategory } from '../models/Product';
import privateApi from "./privateApi";



export const getProducts = async (): Promise<ResponseData<Product>> => {
    try {
        const response = await publicApi.get<ResponseData<Product>>('/api/v1/products');


        return response.data;
    } catch (error) {
        console.error(error);

        throw error;
    }
}

export const getProductsById = async (id: number): Promise<ResponseData1<Product>> => {
    try {
        const response = await privateApi.get<ResponseData1<Product>>(`/api/v1/products/${id}`);
        return response.data;
    } catch (error) {
        console.error(error);

        throw error;
    }
}



export const getProductsByCategory = async (category: string): Promise<ResponseData<Product>> => {
    const endpoint = category === 'All Products' || category === 'All' ? 'products' : `${category}`;
    try {
        const response = await publicApi.get<ResponseData<Product>>(`/api/v1/products/category/${endpoint}`);

        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error(error);

        throw error;
    }
}

export const get5ProductsByCategory = async (category: string): Promise<ResponseData<Product>> => {
    try {
        const response = await publicApi.get<ResponseData<Product>>(`/api/v1/products/category/${category}?limit=5`);


        return response.data;
    } catch (error) {
        console.error(error);

        throw error;
    }
}


export const getProductsBySlug = async (slug: string): Promise<ResponseData1<Product>> => {
    try {
        const response = await publicApi.get<ResponseData1<Product>>(`/api/v1/products/detail/${slug}`);

        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error(error);

        throw error;
    }
}

export const getCategories = async (): Promise<ResponseData<Category>> => {
    try {
        const response = await publicApi.get<ResponseData<Category>>('/api/v1/categories');

        return response.data;
    } catch (error) {
        console.error(error);

        throw error;
    }
}

export const addProduct = async (formData: FormData): Promise<ResponseData1<Product>> => {
    try {

        const response = await privateApi.post<ResponseData1<Product>>('/api/v1/products', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });



        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}


export const updateProduct = async (formData: FormData): Promise<ResponseData1<Product>> => {
    try {

        const response = await privateApi.put<ResponseData1<Product>>('/api/v1/products', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });



        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const getListProductByIds = async (ids: number[]): Promise<ResponseData<Product>> => {

    try {
        const response = await publicApi.get<ResponseData<Product>>('/api/v1/products/list', {
            params: { ids },
            paramsSerializer: params => qs.stringify(params, { arrayFormat: 'repeat' })
        });
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};


export const getAllProductsBySearchQuery = async (query: string): Promise<ResponseData<ProductSearchString>> => {
    try {
        const response = await publicApi.get<ResponseData<ProductSearchString>>(`/api/v1/products/search?q=${query}`);


        return response.data;
    } catch (error) {
        console.error(error);

        throw error;
    }
}

export const getAllProductsBySearchPage = async (query: string): Promise<ResponseData<Product>> => {
    try {
        const response = await publicApi.get<ResponseData<Product>>(`/api/v1/products/search?q=${query}`);

        return response.data;
    } catch (error) {
        console.error(error);

        throw error;
    }
}



export const deleteProducts = async (ids: number[]): Promise<ResponseData1<String>> => {
    try {
        const response = await privateApi.delete<ResponseData1<String>>(`/api/v1/products`, {
            params: { ids },
            paramsSerializer: params => qs.stringify(params, { arrayFormat: 'repeat' })
        });


        return response.data.message ? response.data : { code: 1000, result: "Success" };
    } catch (error) {
        console.error(error);
        throw error;
    }
}


export const getAllSalesProducts = async (): Promise<ResponseData<Product>> => {
    try {
        const response = await publicApi.get<ResponseData<Product>>('/api/v1/products/sales');

        return response.data;
    } catch (error) {
        console.error(error);

        throw error;
    }
}


export const getMostSoldProducts = async (): Promise<ResponseData<MostSoldProduct>> => {
    try {
        const response = await privateApi.get<ResponseData<MostSoldProduct>>('/api/v1/products/most-sold');


        return response.data;
    } catch (error) {
        console.error(error);

        throw error;
    }
}

export const getRevenueByCategory = async (startDate: String, endDate: String): Promise<ResponseData<SalesByCategory>> => {

    if (!startDate || !endDate) {
        throw new Error('Start date and end date must be provided');
    }
    try {
        const response = await privateApi.get<ResponseData<SalesByCategory>>(`/api/v1/products/sales-category?startDate=${startDate}&endDate=${endDate}`);


        return response.data;
    } catch (error) {
        console.error(error);

        throw error;
    }
}




