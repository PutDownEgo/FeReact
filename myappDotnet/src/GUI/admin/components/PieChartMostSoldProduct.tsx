import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { MostSoldProduct } from '../../../models/Product';
import { getMostSoldProducts } from '../../../api/ProductApi';

const options = {
    responsive: true,
    plugins: {
        legend: {
            position: 'top' as const,
        },
        title: {
            display: true,
            text: 'Most sales products',
            font: {
                size: 24
            },

        }
    }
};


ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
);

function PieChartMostSoldProduct() {
    const [mostProducts, setMostProducts] = useState<MostSoldProduct[]>([]);

    useEffect(() => {
        const fetchMostSoldProduct = async () => {
            const response = await getMostSoldProducts();
            setMostProducts(response.result);
        }
        fetchMostSoldProduct();
    }, []);



    const data = {
        labels: mostProducts.map(product => product?.product.name),
        datasets: [{
            label: 'My First Dataset',
            data: mostProducts.map(product => product?.totalQuantitySold),
            backgroundColor: mostProducts.map(() =>
                `rgb(
            ${Math.floor(Math.random() * 256)}, 
            ${Math.floor(Math.random() * 256)}, 
            ${Math.floor(Math.random() * 256)})`),
            hoverOffset: 4
        }]
    }
    return (
        <Pie data={data} options={options} />
    )
}

export default PieChartMostSoldProduct;
