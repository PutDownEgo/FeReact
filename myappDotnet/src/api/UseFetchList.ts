import React, { useEffect, useState } from 'react'
import { getProducts } from './ProductApi'
import { ResponseData } from '../models/Product';

type UseFetchResult<T> = {
    data: T[] | null;
    loading: boolean;
    error: Error | null;
};



const UseFetchList = <T,>(fetchDataFunction: () => Promise<ResponseData<T>>): UseFetchResult<T> => {
    const [data, setData] = useState<T[] | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetchDataFunction();
                if (response.code === 1000) {
                    console.log("------------", response.result);
                    setData(response.result);
                    setError(null);
                } else {
                    throw new Error(`Server responded with status code: ${response.code}`);
                }
            } catch (err) {
                setError(err as Error);
                setData(null);
            } finally {
                setLoading(false);
            }
        };


        fetchData();
    }, [fetchDataFunction]);

    return { data, loading, error };
};

export default UseFetchList; 