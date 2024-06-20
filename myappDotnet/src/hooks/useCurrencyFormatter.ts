import { useCallback } from 'react';

function useCurrencyFormatter() {
    const formatCurrency = useCallback((value: number) => {

        if (value === null || value === undefined || isNaN(value)) {
            return 'N/A';
        }


        return value.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
    }, []);

    return formatCurrency;
}

export default useCurrencyFormatter;
