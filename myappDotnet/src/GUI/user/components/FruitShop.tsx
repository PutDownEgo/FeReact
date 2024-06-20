import React, { useEffect, useState } from 'react'
import { Product, ProductStatus, ProductType } from '../../../models/Product';
import { getProducts } from '../../../api/ProductApi';
import UseFetch from '../../../api/UseFetchList';
import ReactLoading from 'react-loading';
import ProductCard from './ProductCard';
import { useNavigate } from 'react-router-dom';
import { Button, ThemeProvider, createTheme } from '@mui/material';
import { green } from '@mui/material/colors';



const FruitShop = () => {

    const [products, setProducts] = useState<Product[]>([]);

    const { data, loading, error } = UseFetch(getProducts);

    const [displayCount, setDisplayCount] = useState(4);

    const [filter, setFilter] = useState<ProductType>(ProductType.All);

    const [activeCategory, setActiveCategory] = useState<ProductType>(ProductType.All);

    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

    useEffect(() => {
        if (data) {
            let results = filter === ProductType.All ? data : data.filter(item => item.category?.name === filter);
            results = results.filter(item => item.productStatus == ProductStatus.ACTIVE);

            setFilteredProducts(results.slice(0, displayCount));
        }

    }, [data, filter, displayCount]);

    const handleLoadMore = () => {
        const newDisplayCount = displayCount + 4;
        setDisplayCount(newDisplayCount);
    };

    const handleChangeFilter = (newFilter: ProductType) => {
        setActiveCategory(newFilter);
        setFilter(newFilter);
        setDisplayCount(4);
    };

    const productTypeArray: ProductType[] = [ProductType.All, ProductType.Vegetables, ProductType.Fruits, ProductType.Bread, ProductType.Meat];


    return (
        <div className="container-fluid fruite py-5">
            <div className="container py-5">
                <div className="tab-className text-center">
                    <div className="row g-4">
                        <div className="col-lg-4 text-start">
                            <h1>Our Organic Products</h1>
                        </div>
                        <div className="col-lg-8 text-end">
                            <ul className="nav nav-pills d-inline-flex text-center mb-5">
                                {productTypeArray.map((type, index) => (
                                    <li className="nav-item" key={index}>
                                        <a className={`d-flex m-2 py-2 bg-light rounded-pill ${activeCategory === type ? 'activeTab' : ''}`}
                                            onClick={() => handleChangeFilter(type)}
                                            data-bs-toggle="pill" href={`#tab-${index + 1}`}>
                                            <span style={{ width: '130px' }}>
                                                {type}
                                            </span>
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                    <div className="tab-content">
                        {loading && (
                            <div style={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                height: '30px'
                            }}>
                                <ReactLoading type="spin" color="#ffebcd" height={'10%'} width={'10%'} />
                            </div>
                        )}
                        {error && <div>Error: {error.message}</div>}

                        <div id="tab-1" className="tab-pane fade show p-0 active">
                            <div className="row g-4">
                                <div className="col-lg-12">
                                    <div className="row g-4">
                                        {filteredProducts.map((product) => (

                                            <ProductCard key={product.id} {...product} />

                                        ))
                                        }

                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
                {filteredProducts.length !== 0 && <div className="text-end mt-3">

                    <Button variant="contained"
                        color="success"
                        onClick={handleLoadMore}
                        sx={{ backgroundColor: green[500], color: 'white' }}>
                        Load More
                    </Button>

                </div>}

            </div>
        </div>
    )
}

export default FruitShop
