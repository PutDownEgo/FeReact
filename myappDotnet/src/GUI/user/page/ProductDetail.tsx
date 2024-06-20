import React, { useCallback, useEffect, useState } from 'react';
import { getProductsBySlug } from '../../../api/ProductApi';

import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import UseFetch1 from '../../../api/UseFetch';
import { useShoppingCart } from '../../../context/ShoppingCartContext';
import { Product, ProductStatus, ProductType } from '../../../models/Product';

import { NavLink, useNavigate, useParams } from 'react-router-dom';
import { Rating } from 'react-simple-star-rating';
import 'react-toastify/dist/ReactToastify.css';
import { countProductsInCategory } from '../../../api/CategoryApi';
import { createRating, getRatingbyProductId } from '../../../api/RatingApi';
import { useAuth } from '../../../context/AuthContext';
import useCurrencyFormatter from '../../../hooks/useCurrencyFormatter';
import { RatingCreation } from '../../../models/Rating';
import useCustomToast from '../../../util/UseCustomToast';




const ProductDetail = () => {

    let { slug } = useParams<{ slug: string }>();
    if (typeof slug === 'undefined') {
        slug = '';
    }

    const formatCurrency = useCurrencyFormatter();
    const [product, setProduct] = useState<Product | null>(null);
    const [quantity, setQuantity] = useState(1);
    const [rating, setRating] = useState(0)
    const [hasRated, setHasRated] = useState(false);
    const [createRatingObject, setCreateRatingObject] = useState<RatingCreation | null>(null);
    const showToast = useCustomToast();
    const navigate = useNavigate();
    const [categories, setCategories] = useState<ProductType[]>([ProductType.All, ProductType.Fruits, ProductType.Vegetables]);
    const [countProducts, setCountProducts] = useState<Map<string, number>>(new Map());
    const { user } = useAuth();

    useEffect(() => {
        window.scrollTo(0, 200);
    }, [])


    const fetchDataFunction = useCallback(() => {
        if (typeof slug === 'string') {
            return getProductsBySlug(slug);
        } else {
            throw new Error('Slug is undefined');
        }
    }, [slug]);
    const { data, loading, error } = UseFetch1(fetchDataFunction);


    const { getItemQuantity, putItemInCartWithQuantity } = useShoppingCart();

    const quantityInCart = getItemQuantity(product?.id || 0);

    useEffect(() => {
        if (!loading) {
            if (data) {
                setProduct(data);
            } else {
                navigate('/not-found');
            }
        }
    }, [data, navigate, loading]);

    // useEffect(() => {

    //     if (data?.category?.name) {
    //         get5ProductsByCategory(data.category.name)
    //             .then((response) => {
    //                 setProductWithTheSameCategory(response.result);
    //             })
    //             .catch(error => {
    //                 console.error('Error fetching products by category', error);
    //                 setProductWithTheSameCategory([]);
    //             });
    //     }
    // }, [data?.category?.name]);

    useEffect(() => {
        const getCountProductsInCategory = async () => {
            for (let category of categories) {
                const response = await countProductsInCategory(category);
                setCountProducts(prevCountProducts => new Map(prevCountProducts).set(category, response.result));
            }
        }
        getCountProductsInCategory();
    }, []);

    useEffect(() => {
        if (data?.id) {
            getRatingbyProductId(data.id)
                .then((response) => {
                    setRating(response.result);
                })
                .catch((error) => {
                    console.error('Error fetching rating', error);
                    setRating(0);
                    setHasRated(false);
                });
        }
    }, [data?.id]);

    const handleIncreateQuantity = () => {
        setQuantity(quantity + 1);
    }

    const handleDecreaseQuantity = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
        }
    }

    const handleAddToCart = (id: number, quantity: number) => {
        if (product?.productStatus === ProductStatus.INACTIVE) {
            showToast('The product has been discontinued', 'warning');
            return;
        }
        if (product) {
            console.log("product ne", product)
            if (product?.quantity < quantity) {
                showToast('Not enough product in stock', 'warning');
                return;
            }
        }


        putItemInCartWithQuantity(id, quantity);
        setQuantity(1);
        showToast('Add to cart successful!', 'info');
    }
    const handleQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newQuantity = parseInt(event.target.value, 10) || 1;
        setQuantity(newQuantity);
    };

    const handleRating = (rate: number) => {
        if (!user) {
            showToast('Please log in to rate', 'warning');
            return;
        }

        if (product) {
            const newRatingObject = {
                rate,
                productId: product.id,
                userId: user.id
            };


            createRating(newRatingObject).then((response) => {
                setRating(rate);
                setHasRated(true);
                showToast('🦄 Voted successful', 'info');
            }).catch((error) => {
                console.error(error);
            });
        }
    };

    const effectivePrice = product?.salePrice && product.salePrice < product.price
        ? product.salePrice
        : product?.price;

    return (


        <div className="container-fluid py-5 mt-5">

            <div className="container py-5">
                <div className="row g-4 mb-5">
                    <div className="col-lg-8 col-xl-9">
                        <div className="row g-4">
                            <div className="col-lg-6">
                                <div className="border rounded">
                                    <a href="#">
                                        {loading ? <Skeleton height="400px" /> : <img src={product?.image} className="img-fluid rounded" alt="Image" />}
                                    </a>
                                </div>
                            </div>
                            <div className="col-lg-6">

                                <h4 className="fw-bold mb-3">{loading ? <Skeleton width={100} /> : product?.name}</h4>
                                <p className="mb-3">{loading ? <Skeleton width={100} /> : "Category: Vegetables"}</p>
                                <h5 className="fw-bold mb-3">{loading ? <Skeleton width={100} /> : formatCurrency(effectivePrice || 0)}</h5>
                                {product?.salePrice && product.salePrice < product.price && (
                                    <h6 className="text-danger text-decoration-line-through">{formatCurrency(product.price)}</h6>
                                )}
                                <div className="d-flex mb-4">
                                    <Rating
                                        allowFraction
                                        size={25}
                                        readonly={!user || hasRated}
                                        initialValue={rating}
                                        onClick={handleRating}
                                    />
                                </div>
                                <div className="mb-4">
                                    {loading
                                        ? <Skeleton width={100} />
                                        : <div dangerouslySetInnerHTML={{ __html: product?.description || '' }} />
                                    }
                                </div>

                                <div className="input-group quantity mb-5" style={{ width: '100px' }}>
                                    <div className="input-group-btn">
                                        <button onClick={handleDecreaseQuantity} className="btn btn-sm btn-minus rounded-circle bg-light border">
                                            <i className="fa fa-minus"></i>
                                        </button>
                                    </div>
                                    <input value={quantity}
                                        onChange={handleQuantityChange} type="text" className="form-control form-control-sm text-center border-0" />
                                    <div className="input-group-btn">
                                        <button onClick={handleIncreateQuantity} className="btn btn-sm btn-plus rounded-circle bg-light border">
                                            <i className="fa fa-plus"></i>
                                        </button>
                                    </div>
                                </div>
                                <a onClick={() => handleAddToCart(product?.id ?? 0, quantity)} className="btn border border-secondary rounded-pill px-4 py-2 mb-4 text-primary">
                                    <i className="fa fa-shopping-bag me-2 text-primary"></i> Add to cart
                                </a>
                                {product?.productStatus === ProductStatus.INACTIVE && (
                                    <div className="text-danger">The product has been discontinued</div>
                                )}
                                {product && product?.quantity <= 0 && (
                                    <div className="text-danger">The product is not enough in stock</div>
                                )}


                            </div>
                            <div className="col-lg-12">
                                <nav>
                                    <div className="nav nav-tabs mb-3">
                                        <button className="nav-link active border-white border-bottom-0" type="button" role="tab"
                                            id="nav-about-tab" data-bs-toggle="tab" data-bs-target="#nav-about"
                                            aria-controls="nav-about" aria-selected="true">Description</button>
                                        <button className="nav-link border-white border-bottom-0" type="button" role="tab"
                                            id="nav-mission-tab" data-bs-toggle="tab" data-bs-target="#nav-mission"
                                            aria-controls="nav-mission" aria-selected="false">Reviews</button>
                                    </div>
                                </nav>
                                <div className="tab-content mb-5">
                                    <div className="tab-pane active" id="nav-about" role="tabpanel" aria-labelledby="nav-about-tab">
                                        <p className="mb-4">
                                            {loading
                                                ? <Skeleton width={900} count={10} />
                                                : <div dangerouslySetInnerHTML={{ __html: product?.description || '' }} />
                                            }
                                        </p>

                                        <div className="px-2">
                                            <div className="row g-4">
                                                <div className="col-6">
                                                    <div className="row bg-light align-items-center text-center justify-content-center py-2">
                                                        <div className="col-6">
                                                            <p className="mb-0">Weight</p>
                                                        </div>
                                                        <div className="col-6">
                                                            <p className="mb-0">1 kg</p>
                                                        </div>
                                                    </div>
                                                    <div className="row text-center align-items-center justify-content-center py-2">
                                                        <div className="col-6">
                                                            <p className="mb-0">Country of Origin</p>
                                                        </div>
                                                        <div className="col-6">
                                                            <p className="mb-0">Agro Farm</p>
                                                        </div>
                                                    </div>
                                                    <div className="row bg-light text-center align-items-center justify-content-center py-2">
                                                        <div className="col-6">
                                                            <p className="mb-0">Quality</p>
                                                        </div>
                                                        <div className="col-6">
                                                            <p className="mb-0">Organic</p>
                                                        </div>
                                                    </div>
                                                    <div className="row text-center align-items-center justify-content-center py-2">
                                                        <div className="col-6">
                                                            <p className="mb-0">Check</p>
                                                        </div>
                                                        <div className="col-6">
                                                            <p className="mb-0">Healthy</p>
                                                        </div>
                                                    </div>
                                                    <div className="row bg-light text-center align-items-center justify-content-center py-2">
                                                        <div className="col-6">
                                                            <p className="mb-0">Min Weight</p>
                                                        </div>
                                                        <div className="col-6">
                                                            <p className="mb-0">250 Kg</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="tab-pane" id="nav-mission" role="tabpanel" aria-labelledby="nav-mission-tab">
                                        <div className="d-flex">
                                            <img src="/user-assets/assets/avatar.jpg" className="img-fluid rounded-circle p-3" style={{ width: '100px', height: '100px' }} alt="" />
                                            <div className="">
                                                <p className="mb-2" style={{ fontSize: '14px' }}>April 12, 2024</p>
                                                <div className="d-flex justify-content-between">
                                                    <h5>Jason Smith</h5>
                                                    <div className="d-flex mb-3">
                                                        <i className="fa fa-star text-secondary"></i>
                                                        <i className="fa fa-star text-secondary"></i>
                                                        <i className="fa fa-star text-secondary"></i>
                                                        <i className="fa fa-star text-secondary"></i>
                                                        <i className="fa fa-star"></i>
                                                    </div>
                                                </div>
                                                <p>The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc.
                                                    Suspendisse ultricies nisi vel quam suscipit.</p>
                                            </div>
                                        </div>
                                        <div className="d-flex">
                                            <img src="/user-assets/assets/avatar.jpg" className="img-fluid rounded-circle p-3" style={{ width: '100px', height: '100px' }} alt="" />
                                            <div className="">
                                                <p className="mb-2" style={{ fontSize: '14px' }}>April 12, 2024</p>
                                                <div className="d-flex justify-content-between">
                                                    <h5>Emily Johnson</h5>
                                                    <div className="d-flex mb-3">
                                                        <i className="fa fa-star text-secondary"></i>
                                                        <i className="fa fa-star text-secondary"></i>
                                                        <i className="fa fa-star text-secondary"></i>
                                                        <i className="fa fa-star text-secondary"></i>
                                                        <i className="fa fa-star"></i>
                                                    </div>
                                                </div>
                                                <p>The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc.
                                                    Suspendisse ultricies nisi vel quam suscipit.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <form>
                                <h4 className="mb-5 fw-bold">Leave a Reply</h4>
                                <div style={{ border: "1px dashed black" }} className="row g-4">
                                    <div className="col-lg-6">
                                        <div className="border-bottom rounded">
                                            <input type="text" className="form-control border-0 me-4" placeholder="Your Name *" />
                                        </div>
                                    </div>
                                    <div className="col-lg-6">
                                        <div className="border-bottom rounded">
                                            <input type="email" className="form-control border-0" placeholder="Your Email *" />
                                        </div>
                                    </div>
                                    <div className="col-lg-12">
                                        <div className="border-bottom rounded my-4">
                                            <textarea className="form-control border-0" rows={8} placeholder="Your Review *" spellCheck="false"></textarea>
                                        </div>
                                    </div>
                                    <div className="col-lg-12">
                                        <div className="d-flex justify-content-between py-3 mb-3">
                                            <div className="d-flex align-items-center">
                                                <p className="mb-0 me-3">Please rate:</p>
                                                <div className="d-flex align-items-center" style={{ fontSize: '12px' }}>
                                                    <i className="fa fa-star text-muted"></i>
                                                    <i className="fa fa-star"></i>
                                                    <i className="fa fa-star"></i>
                                                    <i className="fa fa-star"></i>
                                                    <i className="fa fa-star"></i>
                                                </div>
                                            </div>
                                            <button type="submit" className="btn border border-secondary text-primary rounded-pill px-4 py-3">Post Comment</button>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>

                    <div className="col-lg-4 col-xl-3">
                        <div className="row g-4 fruite">
                            <div className="col-lg-12">

                                <div className="mb-4">
                                    <h4>Categories</h4>
                                    <ul className="list-unstyled fruite-categorie">

                                        {loading ? <Skeleton width={300} count={5} /> :
                                            categories.map((category) => (
                                                <li key={category}>
                                                    <div className="d-flex justify-content-between fruite-name">
                                                        <NavLink to={`/category/${category}`}><i className="fas fa-apple-alt me-2"></i>{category}</NavLink>
                                                        <span>({countProducts.get(category)})</span>
                                                    </div>
                                                </li>
                                            ))
                                        }
                                    </ul>
                                </div>
                            </div>
                            <div className="col-lg-12">
                                <h4 className="mb-4">Featured products</h4>
                                <div className="d-flex align-items-center justify-content-start">
                                    <div className="rounded" style={{ width: '100px', height: '100px' }}>
                                        <img src="/user-assets/assets/featur-1.jpg" className="img-fluid rounded" alt="Image" />
                                    </div>
                                    <div>
                                        <h6 className="mb-2">Big Banana</h6>
                                        <div className="d-flex mb-2">
                                            <i className="fa fa-star text-secondary"></i>
                                            <i className="fa fa-star text-secondary"></i>
                                            <i className="fa fa-star text-secondary"></i>
                                            <i className="fa fa-star text-secondary"></i>
                                            <i className="fa fa-star"></i>
                                        </div>
                                        <div className="d-flex mb-2">
                                            <h5 className="fw-bold me-2">2.99 $</h5>
                                            <h5 className="text-danger text-decoration-line-through">4.11 $</h5>
                                        </div>
                                    </div>
                                </div>
                                {/* Additional product entries omitted for brevity, follow the same pattern as above */}
                                <div className="d-flex justify-content-center my-4">
                                    <a href="#" className="btn border border-secondary px-4 py-3 rounded-pill text-primary w-100">View More</a>
                                </div>
                            </div>




                            <div className="col-lg-12">
                                <div className="position-relative">
                                    <img src="/user-assets/assets/banner-fruits.jpg" className="img-fluid w-100 rounded" alt="" />
                                    <div className="position-absolute" style={{ top: '50%', right: '10px', transform: 'translateY(-50%)' }}>
                                        <h3 className="text-secondary fw-bold">Fresh <br /> Fruits <br /> Banner</h3>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>


                </div>
                <div className="container-fluid py-5 mt-5">
                    <div className="container py-5">
                        <div className="row g-4 mb-5">
                            <h1 className="fw-bold mb-0">Related products</h1>
                            <div className="vesitable">
                                <div className="owl-carousel vegetable-carousel justify-content-center">
                                    {/* You would typically map over an array of products here */}
                                    {/* Example product item */}
                                    <div className="row">
                                        <div className="border border-primary rounded position-relative vesitable-item col-3">
                                            <div className="vesitable-img">
                                                <img src="user-assets/assets/vegetable-item-6.jpg" className="img-fluid w-100 rounded-top" alt="" />
                                            </div>
                                            <div className="text-white bg-primary px-3 py-1 rounded position-absolute" style={{ top: '10px', right: '10px' }}>Vegetable</div>
                                            <div className="p-4 pb-0 rounded-bottom">
                                                <h4>Parsely</h4>
                                                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit sed do eiusmod te incididunt</p>
                                                <div className="d-flex justify-content-between flex-lg-wrap">
                                                    <p className="text-dark fs-5 fw-bold">$4.99 / kg</p>
                                                    <a href="#" className="btn border border-secondary rounded-pill px-3 py-1 mb-4 text-primary">
                                                        <i className="fa fa-shopping-bag me-2 text-primary"></i> Add to cart
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="border border-primary rounded position-relative vesitable-item col-3">
                                            <div className="vesitable-img">
                                                <img src="user-assets/assets/vegetable-item-6.jpg" className="img-fluid w-100 rounded-top" alt="" />
                                            </div>
                                            <div className="text-white bg-primary px-3 py-1 rounded position-absolute" style={{ top: '10px', right: '10px' }}>Vegetable</div>
                                            <div className="p-4 pb-0 rounded-bottom">
                                                <h4>Parsely</h4>
                                                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit sed do eiusmod te incididunt</p>
                                                <div className="d-flex justify-content-between flex-lg-wrap">
                                                    <p className="text-dark fs-5 fw-bold">$4.99 / kg</p>
                                                    <a href="#" className="btn border border-secondary rounded-pill px-3 py-1 mb-4 text-primary">
                                                        <i className="fa fa-shopping-bag me-2 text-primary"></i> Add to cart
                                                    </a>
                                                </div>
                                            </div>
                                        </div>


                                    </div>

                                    {/* Repeat for each product item */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div >

    );
}

export default ProductDetail
