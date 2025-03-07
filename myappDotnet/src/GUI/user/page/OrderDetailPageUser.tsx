import {
    MDBCard,
    MDBCardBody,
    MDBCardFooter,
    MDBCardHeader,
    MDBCardImage,
    MDBCol,
    MDBContainer,
    MDBProgress,
    MDBProgressBar,
    MDBRow,
    MDBTypography,
} from "mdb-react-ui-kit";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getOrderById, updateOrder } from "../../../api/OrderApi";
import useCurrencyFormatter from "../../../hooks/useCurrencyFormatter";
import { Order, OrderStatus } from '../../../models/Order';
import useCustomToast from "../../../util/UseCustomToast";



function OrderDetailPageUser() {
    const { orderId } = useParams();
    const formatCurrency = useCurrencyFormatter();
    const [order, setOrder] = useState<Order>();
    const orderIdNumber = Number(orderId) || 0;
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const showToastMessage = useCustomToast();
    const [orderStatus, setOrderStatus] = useState<OrderStatus[]>([OrderStatus.CANCELED, OrderStatus.DELIVERED, OrderStatus.PENDING]);
    const [selectedStatus, setSelectedStatus] = useState<OrderStatus>(order?.orderStatus || OrderStatus.PENDING);
    useEffect(() => {
        const fetchOrder = async () => {
            const data = await fetchOrderById(orderIdNumber);
            if (data) {
                setOrder(data);
                countTheMoneyDiscount();
            } else {
                showToastMessage("Failed to fetch order", "error");
                navigate("/user/orders")
            }
        };

        fetchOrder();

    }, [orderId]);






    const countTheMoneyDiscount = () => {
        if (!order?.coupon?.discount || order?.coupon?.discount === 0) {
            return 0;
        }

        const originalMoney = countTheOriginalMoney()
        return originalMoney - (order?.totalPay || 0);
    }

    const countTheOriginalMoney = () => {
        let discount = 0
        if (order?.coupon?.discount)
            discount = order?.coupon?.discount

        return order?.totalPay ? order.totalPay / (1 - discount) : 0;
    }

    const fetchOrderById = async (orderId: number) => {
        try {
            const response = await getOrderById(orderId);
            console.log("Order detail:", response.result);
            return response.result;

        } catch (error) {
            console.error("Failed to fetch products:", error);
        }
    };

    const updateOrderStatus = async (orderId: number, status: OrderStatus) => {
        try {
            setIsLoading(true);
            const response = await updateOrder(orderId, status);
            setOrder(response.result);
            showToastMessage("Update order successfully", "success");
            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
            showToastMessage("Failed to update order", "error");
            console.error("Failed to update order:", error);
        }
    }


    const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newStatus = e.target.value as OrderStatus;
        setSelectedStatus(newStatus);
        updateOrderStatus(orderIdNumber, newStatus);
    };



    return (
        <>

            <MDBContainer className="py-5 h-100">
                <MDBRow className="justify-content-center align-items-center h-100">
                    <MDBCol lg="10" xl="8">
                        <MDBCard style={{ borderRadius: "10px" }}>
                            <MDBCardHeader className="px-4 py-5 d-flex align-items-center ">
                                <MDBTypography tag="h5" className="text-muted mb-0">
                                    Thanks for your Order, <span style={{ color: "#a8729a" }}>{order?.customerName}</span>!
                                </MDBTypography>

                            </MDBCardHeader>
                            <MDBCardBody className="p-4">
                                <div className="d-flex justify-content-between align-items-center mb-4">
                                    {order?.coupon?.code ? <p className="small text-muted mb-0">
                                        Receipt Voucher : {order?.coupon?.code}
                                    </p> : null}

                                </div>

                                {
                                    order && order.orderItems?.map((item, index) => {
                                        return (
                                            <MDBCard key={index} className="shadow-0 border mb-4">
                                                <MDBCardBody>
                                                    <MDBRow>
                                                        <MDBCol md="2">
                                                            <MDBCardImage
                                                                src={item?.image}
                                                                fluid
                                                                alt="Item"
                                                            />
                                                        </MDBCol>
                                                        <MDBCol
                                                            md="2"
                                                            className="text-center d-flex justify-content-center align-items-center"
                                                        >
                                                            <p className="text-muted mb-0">{item?.productName}</p>
                                                        </MDBCol>
                                                        <MDBCol
                                                            md="2"
                                                            className="text-center d-flex justify-content-center align-items-center"
                                                        >
                                                            <p className="text-muted mb-0 small">Kilogram</p>
                                                        </MDBCol>
                                                        <MDBCol
                                                            md="2"
                                                            className="text-center d-flex justify-content-center align-items-center"
                                                        >
                                                            <p className="text-muted mb-0 small">
                                                                {formatCurrency(item.price)}/Kg
                                                            </p>
                                                        </MDBCol>
                                                        <MDBCol
                                                            md="2"
                                                            className="text-center d-flex justify-content-center align-items-center"
                                                        >
                                                            <p className="text-muted mb-0 small">Qty: {item.quantity}</p>
                                                        </MDBCol>
                                                        <MDBCol
                                                            md="2"
                                                            className="text-center d-flex justify-content-center align-items-center"
                                                        >
                                                            <p className="text-muted mb-0 small">{formatCurrency(item.price * item.quantity)}</p>
                                                        </MDBCol>
                                                    </MDBRow>
                                                    <hr
                                                        className="mb-4"
                                                        style={{ backgroundColor: "#e0e0e0", opacity: 1 }}
                                                    />
                                                    <MDBRow className="align-items-center">
                                                        <MDBCol md="2">
                                                            <p className="text-muted mb-0 small">Track Order</p>
                                                        </MDBCol>
                                                        <MDBCol md="10">
                                                            <MDBProgress
                                                                style={{ height: "6px", borderRadius: "16px" }}
                                                            >
                                                                <MDBProgressBar
                                                                    style={{
                                                                        borderRadius: "16px",
                                                                        backgroundColor: "#81c408",
                                                                    }}
                                                                    width={65}
                                                                    valuemin={0}
                                                                    valuemax={100}
                                                                />
                                                            </MDBProgress>
                                                            <div className="d-flex justify-content-around mb-1">
                                                                <p className="text-muted mt-1 mb-0 small ms-xl-5">
                                                                    Out for delivary
                                                                </p>
                                                                <p className="text-muted mt-1 mb-0 small ms-xl-5">
                                                                    Delivered
                                                                </p>
                                                            </div>
                                                        </MDBCol>
                                                    </MDBRow>
                                                </MDBCardBody>
                                            </MDBCard>
                                        )
                                    })
                                }


                                <div className="d-flex justify-content-between pt-2">
                                    <p className="fw-bold mb-0">Order Details</p>
                                    <div className="text-left">
                                        <p className="text-muted mb-0">
                                            <span className="fw-bold me-4">Total</span> {formatCurrency(countTheOriginalMoney())}
                                        </p>
                                    </div>
                                </div>

                                <div className="d-flex justify-content-between pt-2">
                                    <p className="text-muted mb-0">Invoice Number : {order?.id}</p>
                                    <div className="text-left">
                                        <p className="text-muted mb-0">
                                            <span className="fw-bold me-4">Discount</span> {formatCurrency(countTheMoneyDiscount())}
                                        </p>
                                    </div>
                                </div>
                                <div className="d-flex justify-content-between pt-2">
                                    <p className="text-muted mb-0">
                                        <span className="">Status: </span> {order?.orderStatus}
                                    </p>
                                </div>

                                <div className="d-flex justify-content-between pt-2">
                                    <p className="text-muted mb-0">
                                        Invoice Date : {order?.createdDate ? new Date(order.createdDate).toLocaleDateString() : ''}
                                    </p>
                                </div>
                                <div className="d-flex justify-content-between pt-2">
                                    <p className="text-muted mb-0">
                                        Address : {order?.address}
                                    </p>
                                </div>

                                <div className="d-flex justify-content-between mb-5 pt-2">
                                    {order?.coupon?.code ? (
                                        <p className="text-muted mb-0 w-50">
                                            Receipts Voucher : {order?.coupon?.code}
                                        </p>
                                    ) : null}
                                    {/* <p className="text-muted mb-0">
                                                    <span className="fw-bold me-4">Delivery Charges</span>{" "}
                                                    Free
                                                </p> */}
                                </div>
                            </MDBCardBody>
                            <MDBCardFooter
                                className="border-0 px-4 py-5"
                                style={{
                                    backgroundColor: "#81c408",
                                    borderBottomLeftRadius: "10px",
                                    borderBottomRightRadius: "10px",
                                }}
                            >
                                <MDBTypography
                                    tag="h5"
                                    className="d-flex align-items-center justify-content-end text-white text-uppercase mb-0"
                                >
                                    Total paid: <span className="total-paid h2 mb-0 ms-2">{formatCurrency(order?.totalPay || 0)}</span>
                                </MDBTypography>
                            </MDBCardFooter>
                        </MDBCard>
                    </MDBCol>
                </MDBRow>
            </MDBContainer>

        </>

    );
}


export default OrderDetailPageUser;