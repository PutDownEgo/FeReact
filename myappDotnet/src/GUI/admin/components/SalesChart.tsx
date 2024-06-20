import React from 'react';
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
            text: 'Monthly Sales Chart',
            font: {
                size: 24
            },
        },
    },
};

const SalesChart: React.FC<SalesData> = ({ salesData }) => {

    const data = {
        labels: salesData.map(item => item.month),
        datasets: [
            {
                label: 'Monthly Sales',
                data: salesData.map(item => item.sales),
                backgroundColor: 'rgba(54, 162, 235, 0.6)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1,
            },
        ],
    };


    return <Bar data={data} options={options} />;
};

export default SalesChart;
