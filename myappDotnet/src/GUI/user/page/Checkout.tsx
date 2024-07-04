import React, { useEffect, useMemo, useState } from 'react'
import '../styles/PayBtn.css'
import { useShoppingCart } from '../../../context/ShoppingCartContext';
import { Product } from '../../../models/Product';
import { getListProductByIds } from '../../../api/ProductApi';
import CartItem from '../components/CartItem';
import LocationSelector from '../../../util/LocationSelector';
import { Order, OrderRequest, OrderSchema } from '../../../models/Order';
import { createOrder, createOrderWithPayment } from '../../../api/OrderApi';
import useCustomToast from '../../../util/UseCustomToast';
import useCurrencyFormatter from '../../../hooks/useCurrencyFormatter';
import { useAuth } from '../../../context/AuthContext';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { User } from '../../../models/User';
import ReactLoading from 'react-loading';
import { useNavigate } from 'react-router-dom';
import { getCouponByCode } from '../../../api/CouponApi';
import { Coupon } from '../../../models/Coupon';



const Checkout = () => {
    const { user } = useAuth();


    const currentcyFormat = useCurrencyFormatter();
    const [products, setProducts] = useState<Product[]>([]);
    const { cartItems, doSetCoupon, clearCart } = useShoppingCart();
    const [address, setAddress] = useState('');
    const showToast = useCustomToast();
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const [discount, setDiscount] = useState<number>(0);
    const [couponCode, setCouponCode] = useState<string>("");
    const [paymentMethod, setPaymentMethod] = useState('defaultPaymentMethod');



    const { control, register, handleSubmit, reset, formState: { errors }, setValue } = useForm<OrderRequest>({
        mode: 'all',
        resolver: zodResolver(OrderSchema),
        defaultValues: {
            customerName: '',
            email: '',
            phoneNumber: '',
            address: '',
            note: '',
            orderItems: [],
            couponCode: ''
        }
    });


    useEffect(() => {
        if (user)
            setOrderDetail(user as User)

        if (cartItems.length === 0) {
            showToast("Cart is empty", 'error');
            navigate('/cart');
        }
    }, [user]);


    useEffect(() => {
        const ids = cartItems.map(item => item.id);
        if (ids.length === 0) {
            setProducts([]);
            return;
        }
        getListProductByIds(ids).then((data) => {
            setProducts(data.result);
        });

    }, [cartItems]);


    useEffect(() => {
        if (products.length > 0) {
            const orderItems = cartItems.map(item => {
                const product = products.find(p => p.id === item.id);
                return {
                    productId: item.id,
                    quantity: item.quantity,
                    price: product ? product.price : 0
                };
            });
            setValue('orderItems', orderItems);
        }
    }, [products, cartItems]);

    const setOrderDetail = (user: User) => {
        setValue('customerName', user.firstName + ' ' + user.lastName);
        setValue('email', user.email);
        setValue('phoneNumber', user.phoneNumber);
        setValue('address', user.address);
        setAddress(user.address);
    }


    const subtotal = useMemo(() => {
        return cartItems.reduce((total, item) => {
            const product = products.find(p => p.id === item.id);

            return total + (product ? product.price * item.quantity : 0);
        }, 0);
    }, [cartItems, products]);

    const handlePaymentMethodChange = (event: any) => {
        setPaymentMethod(event.target.value);
    };


    const onSubmit = async (data: OrderRequest) => {
        setIsLoading(true);

        try {

            if (paymentMethod === 'pay') {
                const response = await createOrder(data as Order);
                if (response.code === 1000) {
                    showToast("Order successfully", 'success');
                    resetFormState();
                    clearCart();
                } else {
                    showToast("Error order", 'error');
                }
                navigate("/home")
            } else if (paymentMethod === 'vnpay') {

                const paymentUrl = await createOrderWithPayment(data as Order);
                console.log(paymentUrl)
                window.location.href = paymentUrl as string;
            } else {
                showToast("Please select the payment medthod", 'warning');
            }
        } catch (error) {
            showToast("Error order", 'error');
        }


        setIsLoading(false);
    };

    const resetFormState = () => {
        reset();
        setProducts([]);
        localStorage.setItem('cartItems', JSON.stringify([]));
    };

    const handleChangeCoupon = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCouponCode(e.target.value);
    }

    const handleCountDiscount = (subtotal: number, coupon: Coupon | null) => {
        if (!coupon) return 0;
        setDiscount(subtotal * coupon.discount);
    }



    const applyCoupon = async (code: string) => {
        try {
            const response = await getCouponByCode(code);

            setValue('couponCode', code);
            doSetCoupon(response.result);
            handleCountDiscount(subtotal, response.result);
            showToast("Coupon applied", 'success');
        } catch (error) {
            showToast("Coupon not found", 'error');
        }
    }


    return (
        <div className="container-fluid py-5">
            <div className="container py-5">
                <h1 className="mb-4">Billing details</h1>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="row g-5">
                        <div className="col-md-12 col-lg-6 col-xl-6">

                            <div className="form-item w-100">
                                <label className="form-label my-3">Customer Name<sup>*</sup></label>
                                <input
                                    {...register("customerName")}
                                    type="text" className="form-control"
                                />
                                {errors.customerName &&
                                    <div className="text-danger small">{errors.customerName.message}</div>}
                            </div>
                            <div className="form-item">
                                <label className="form-label my-3">Address <sup>*</sup></label>
                                <LocationSelector onAddressChange={setAddress} />
                                <input
                                    {...register("address")}
                                    value={address}
                                    onChange={e => {
                                        setValue("address", e.target.value);
                                    }}
                                    type="text" className="form-control" placeholder='Your Address'
                                />
                                {errors.address &&
                                    <div className="text-danger small">{errors.address.message}</div>}
                            </div>

                            <div className="form-item">
                                <label className="form-label my-3">Mobile Phone<sup>*</sup></label>
                                <input
                                    {...register("phoneNumber")}
                                    type="tel" className="form-control"
                                />
                                {errors.phoneNumber &&
                                    <div className="text-danger small">{errors.phoneNumber.message}</div>}
                            </div>
                            <div className="form-item">
                                <label className="form-label my-3">Email<sup>*</sup></label>
                                <input
                                    {...register("email")}
                                    type="email" className="form-control" />
                                {errors.email &&
                                    <div className="text-danger small">{errors.email.message}</div>}
                            </div>
                            <div className="form-item">
                                <label className="form-label my-3">Notes</label>
                                <textarea
                                    {...register("note")}
                                    className="form-control" spellCheck="false" cols={30} rows={11} placeholder="Order Notes (Optional)"></textarea>
                                {errors.note &&
                                    <div className="text-danger small">{errors.note.message}</div>}
                            </div>
                        </div>
                        <div className="col-md-12 col-lg-6 col-xl-6">
                            <div className="table-responsive">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th scope="col">Products</th>
                                            <th scope="col">Name</th>
                                            <th scope="col">Price</th>
                                            <th scope="col">Quantity</th>
                                            <th scope="col">Total</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {cartItems.map((item) => {
                                            const product = products.find(product => product.id === item.id);
                                            if (!product) return null;
                                            return <CartItem key={item.id} product={product} quantity={item.quantity} readonly={true} />;
                                        })}

                                        {/* <tr>
                                            <th scope="row"></th>
                                            <td className="py-5"></td>
                                            <td className="py-5"></td>
                                            <td className="py-5">
                                                <p className="mb-0 text-dark py-3">Subtotal</p>
                                            </td>
                                            <td className="py-5">
                                                <div className="py-3 border-bottom border-top">
                                                    <p className="mb-0 text-dark">{currentcyFormat(subtotal)}</p>
                                                </div>
                                            </td>
                                        </tr> */}
                                        <tr>
                                            <td colSpan={12} className="py-5">
                                                <div className="flex justify-align-content-center align-align-items-center">
                                                    <input
                                                        onChange={handleChangeCoupon}
                                                        style={{ border: "none", outline: "solid 1px #81c408", paddingLeft: "10px", width: "68%" }}
                                                        type="text"
                                                        className="border-0 border-bottom rounded me-3 py-3 mb-4"
                                                        placeholder="Coupon Code"
                                                    />
                                                    <button
                                                        onClick={() => applyCoupon(couponCode)}
                                                        className="btn border-secondary rounded-pill px-4 py-3 text-primary"
                                                        type="button"
                                                    >
                                                        Apply Coupon
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <th scope="row"></th>
                                            <td className="py-5"></td>
                                            <td className="py-5"></td>
                                            <td className="py-5">
                                                <p className="mb-0 text-dark py-4">Total</p>
                                            </td>
                                            <td className="py-5">
                                                <div className="py-4 border-bottom border-top">
                                                    <p className="mb-0 text-dark">{currentcyFormat(subtotal - discount)}</p>
                                                </div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            <div className="form-check my-3">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name="payment"
                                    id="payment-1"
                                    value="pay"
                                    onChange={handlePaymentMethodChange}
                                />
                                <label className="form-check-label" htmlFor="payment-1">Pay When Receiving</label>
                            </div>
                            <div className="form-check my-3">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name="payment"
                                    id="payment-3"
                                    value="vnpay"
                                    onChange={handlePaymentMethodChange}
                                />
                                <label className="form-check-label" htmlFor="payment-3">VNPay</label>
                            </div>
                            <button type="submit" className="Btn">
                                Pay
                                <svg className="svgIcon" viewBox="0 0 576 512">
                                    <path d="M512 80c8.8 0 16 7.2 16 16v32H48V96c0-8.8 7.2-16 16-16H512zm16 144V416c0 8.8-7.2 16-16 16H64c-8.8 0-16-7.2-16-16V224H528zM64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H512c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H64zm56 304c-13.3 0-24 10.7-24 24s10.7 24 24 24h48c13.3 0 24-10.7 24-24s-10.7-24-24-24H120zm128 0c-13.3 0-24 10.7-24 24s10.7 24 24 24H360c13.3 0 24-10.7 24-24s-10.7-24-24-24H248z" />
                                </svg>
                            </button>
                        </div>
                    </div>
                    {isLoading && (
                        <div style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundColor: 'rgba(0, 0, 0, 0.5)',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            zIndex: 10
                        }}>
                            <ReactLoading type="spin" color="#ffebcd" height={'10%'} width={'10%'} />
                        </div>
                    )}
                </form>
            </div >
        </div >
    );
}

export default Checkout