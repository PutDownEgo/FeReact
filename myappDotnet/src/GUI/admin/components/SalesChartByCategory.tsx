import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { SalesByCategory } from '../../../models/Product';
import { getRevenueByCategory } from '../../../api/ProductApi';


ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

type SalesData = {
    salesData: {
        month: string;
        sales: number;
    }[];
};


export const options = {
    responsive: true,
    plugins: {
        legend: {
            position: 'top' as const,
        },
        title: {
            display: true,
            text: 'Top Sales Product By Category',
            font: {
                size: 24
            },
        },
    },
};

export type SalesChartByCategoryProps = {
    startDate: string | undefined;
    endDate: string | undefined;
}


const SalesChartByCategory: React.FC<SalesChartByCategoryProps> = ({ startDate, endDate }) => {

    const [salesByCategory, setSalesByCategory] = useState<SalesByCategory[]>([]);

    useEffect(() => {
        const fetchMostSoldProduct = async () => {
            const response = await getRevenueByCategory(startDate || '', endDate || '');
            setSalesByCategory(response.result);
        }
        fetchMostSoldProduct();
    }, [startDate, endDate]);

    const data = {
        labels: salesByCategory.map(item => item.categoryName),
        datasets: [
            {
                label: 'Sales By Category',
                data: salesByCategory.map(item => item.totalRevenue),
                backgroundColor: 'rgba(54, 162, 235, 0.6)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1,
            },
        ],
    };


    return <Bar data={data} options={options} />;
};

export default SalesChartByCategory;
