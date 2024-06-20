import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import useCustomToast from '../../../util/UseCustomToast';
import { useShoppingCart } from '../../../context/ShoppingCartContext';
import { useForm } from 'react-hook-form';

function PaymentResult() {
    const location = useLocation();
    const navigate = useNavigate();
    const showToast = useCustomToast()
    const { reset } = useForm();
    const { clearCart } = useShoppingCart();
    const [message, setMessage] = useState("");


    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const status = queryParams.get('status');

        if (status === 'success') {
            showToast("Payment successful", 'success');
            clearCart();
            setMessage("Thank you for your order!");
        } else if (status === 'failed') {
            showToast("Payment failed", 'error');
            setMessage("Payment failed. Please try again.");
        }
        navigate("/home")

    }, []);

    return (
        null
    );
}

export default PaymentResult