import React, { useState } from 'react'
import { Product, ProductStatus } from '../../../models/Product'
import { useNavigate } from 'react-router-dom';
import useCurrencyFormatter from '../../../hooks/useCurrencyFormatter';
import { useShoppingCart } from '../../../context/ShoppingCartContext';
import useCustomToast from '../../../util/UseCustomToast';




const ProductCard = (data: Product) => {

    const formatCurrency = useCurrencyFormatter();
    const navigate = useNavigate();
    const showToast = useCustomToast();
    const { getItemQuantity, putItemInCartWithQuantity } = useShoppingCart();


    const handleClicked = (slug: string) => {
        navigate(`/detail/${slug}`);
    }

    const handleAddToCart = (id: number, quantity: number) => {
        if (data?.productStatus === ProductStatus.INACTIVE) {
            showToast('The product has been discontinued', 'warning');
            return;
        }
        if (data) {
            if (data?.quantity < quantity) {
                showToast('Not enough product in stock', 'warning');
                return;
            }
        }


        putItemInCartWithQuantity(id, quantity);
        showToast('Add to cart successful!', 'info');

    }



    return (
        <div onClick={() => handleClicked(data.slug)} className="col-md-6 col-lg-4 col-xl-3 hoverScale">
            <div className="rounded position-relative fruite-item">
                <div className="fruite-img">
                    <img src={data.image} className="img-fluid w-100 rounded-top" alt="" />
                </div>
                <div
                    className="text-white bg-secondary px-3 py-1 rounded position-absolute"
                    style={{ top: '10px', left: '10px' }}
                >
                    {data.category?.name}
                </div>
                <div className="p-4 border border-secondary border-top-0 rounded-bottom">
                    <h4>{data.name}</h4>
                    <div dangerouslySetInnerHTML={{ __html: data.description }} />
                    <div className="d-flex justify-content-between align-items-center flex-lg-wrap" style={{ minHeight: '60px' }}>
                        {data.salePrice < data.price ? (
                            <>
                                <p style={{ color: "#ec7955", textAlign: "left" }} className="w-100 fs-5 fw-bold mb-0">{formatCurrency(data.salePrice)}/ kg</p>
                                <p style={{ textDecoration: "line-through", textAlign: "left" }} className="w-100 text-dark fs-5 mb-0">{formatCurrency(data.price)}/ kg</p>
                            </>
                        ) : (
                            <>
                                <p className="text-dark fs-5 fw-bold mb-0">{formatCurrency(data.price)}/ kg</p>
                            </>
                        )}
                    </div>
                    <a
                        onClick={(event) => {
                            event.stopPropagation();
                            handleAddToCart(data?.id ?? 0, 1);
                        }}
                        className="w-100 mt-3 btn border border-secondary rounded-pill px-3 text-primary"
                    >
                        <i className="fa fa-shopping-bag me-2 text-primary"></i> Add to cart
                    </a>
                </div>
            </div>
        </div>


    )
}

export default ProductCard