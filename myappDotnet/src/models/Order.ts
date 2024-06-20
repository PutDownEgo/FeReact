import { z } from "zod";
import { Coupon } from './Coupon';

export enum OrderStatus {
    PENDING = "PENDING",
    CONFIRMED = "CONFIRMED",
    SHIPPING = "SHIPPING",
    DELIVERED = "DELIVERED",
    CANCELED = "CANCELED",
    RETURNED = "RETURNED",
    PAID = "PAID"
}


export interface Order {
    id: number;
    customerName: string;
    createdDate: Date;
    email: string;
    phoneNumber: string;
    address: string;
    note: string;
    totalPay: number
    orderItems?: OrderItem[];
    orderStatus?: OrderStatus;
    coupon: Coupon;
}


export interface OrderTableExcel {
    id: number;
    customerName: string;
    createdDate: Date;
    email: string;
    phoneNumber: string;
    address: string;
    note: string;
    totalPay: number
    orderItems?: OrderItem[];
    orderStatus?: OrderStatus;
    coupon: Coupon;
}

export interface OrderItem {
    productName: string;
    productId: number;
    image: string;
    quantity: number;
    price: number;
}

export const OrderItemSchema = z.object({
    productId: z.number().min(1),
    quantity: z.number().min(1, { message: "Quantity must be at least 1" }),
    price: z.number().min(0, { message: "Price must be a non-negative number" }),
});


export const OrderSchema = z.object({
    customerName: z.string().min(1, { message: "Customer name must not be empty" }),
    email: z.string().email({ message: "Invalid email address" }),
    phoneNumber: z.string()
        .min(10, { message: "Phone number must be at least 10 digits long" })
        .regex(/^[0-9]+$/, { message: "Phone number must contain only digits" }),
    address: z.string().min(1, { message: "Address must not be empty" }),
    note: z.string().optional(),
    couponCode: z.string().optional(),
    orderItems: z.array(OrderItemSchema),
});

export type OrderRequest = z.infer<typeof OrderSchema>;

export interface ResultOrder {
    content: Order[];
    pageable: Pageable;
    last: boolean;
    totalPages: number;
    totalElements: number;
    size: number;
    number: number;
    sort: Sort;
    first: boolean;
    numberOfElements: number;
    empty: boolean;
}
export interface Pageable {
    pageNumber: number;
    pageSize: number;
    sort: Sort;
    offset: number;
    paged: boolean;
    unpaged: boolean;
}

export interface Sort {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
}