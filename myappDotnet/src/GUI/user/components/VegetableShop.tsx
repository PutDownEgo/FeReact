import { Button } from '@mui/material';
import { green } from '@mui/material/colors';
import { useEffect, useState } from 'react';
import { getAllSalesProducts } from '../../../api/ProductApi';
import { Product, ProductStatus } from '../../../models/Product';
import ProductCard from './ProductCard';

const VegetableShop = () => {

    const [products, setProducts] = useState<Product[]>([]);

    const [displayCount, setDisplayCount] = useState(4);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

    useEffect(() => {
        const fetchSalesProducts = async () => {
            let response = await getAllSalesProducts();
            let filter = response.result.filter(item => item.productStatus == ProductStatus.ACTIVE)
            setFilteredProducts(filter.slice(0, displayCount));
        }
        fetchSalesProducts();
    }, [displayCount]);


    const handleLoadMore = () => {
        const newDisplayCount = displayCount + 1;
        setDisplayCount(newDisplayCount);
    };


    return (
        <>
            <div className="container-fluid vesitable py-5 ">
                <div className="container py-5">
                    <h1 className="mb-3">Best sales products</h1>

                    <div className='row'>
                        {filteredProducts.map((product => <ProductCard key={product.id} {...product} />))}
                    </div>

                    {(filteredProducts.length / displayCount) > 1 && <div className="text-end mt-3">

                        <Button variant="contained"
                            color="success"
                            onClick={handleLoadMore}
                            sx={{ backgroundColor: green[500], color: 'white' }}>
                            Load More
                        </Button>

                    </div>}
                </div>
            </div>
        </>

    )
}

export default VegetableShop