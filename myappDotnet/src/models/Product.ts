
import { z } from 'zod';
import { CategoryStatus } from './Category';
export type Product = {
    id: number;
    name: string;
    price: number;
    salePrice: number;
    description: string;
    image: string;
    category?: Category;
    categoryId: number;
    slug: string;
    productStatus: ProductStatus;
    quantity: number;
    ratings?: number;

}
export enum ProductStatus {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE"
}





export const ProductRequestSchema = z.object({
    name: z.string()
        .min(5, { message: "Name must be at least 5 characters long" })
        .regex(/^(?![\d]+$).*$/, "Name must not be a number"),
    salePrice: z.number()
        .min(0, { message: "Price must be a non-negative number" }),
    price: z.number()
        .min(0, { message: "Price must be a non-negative number" }),
    description: z.string()
        .min(5, { message: "Description must be at least 5 characters long" }),
    categoryId: z.number()
        .int()
        .positive({ message: "CategoryId must be a positive integer" }),
    productStatus: z.enum([ProductStatus.ACTIVE, ProductStatus.INACTIVE]),
    quantity: z.number()
        .int()
        .min(1, { message: "Quantity must be at least 1" })
});

export type ProductRequest = z.infer<typeof ProductRequestSchema>;

export const UpdateProductRequestSchema = z.object({
    id: z.number()
        .int()
        .positive({ message: "Id must be a positive integer" }),
    name: z.string()
        .min(5, { message: "Name must be at least 5 characters long" })
        .regex(/^(?![\d]+$).*$/, "Name must not be a number"),
    salePrice: z.number()
        .min(0, { message: "Price must be a non-negative number" }),
    price: z.number()
        .min(0, { message: "Price must be a non-negative number" }),
    description: z.string()
        .min(5, { message: "Description must be at least 5 characters long" }),
    categoryId: z.number()
        .int()
        .positive({ message: "CategoryId must be a positive integer" }),
    productStatus: z.enum([ProductStatus.ACTIVE, ProductStatus.INACTIVE]),
    quantity: z.number()
        .int()
        .min(1, { message: "Quantity must be at least 1" })
});

export type UpdateProductRequest = z.infer<typeof UpdateProductRequestSchema>;




export type ResponseData<T> = {
    code: number;
    result: T[];
}

export type ResponseData1<T> = {
    code: number;
    result: T;
    message?: string;
}

export enum ProductType {
    All = "All Products",
    Vegetables = "Vegetables",
    Fruits = "Fruits",
    Bread = "Bread",
    Meat = "Meat"
}

export interface Category {
    id: number;
    name: string;
    description: string;
    status: CategoryStatus;
}



export interface ProductTable {
    id: number;
    name: string;
    image: string;
    category: {
        name: string;
    };
    slug: string;
    price: number;
    salePrice: number;
    quantity: number;
}


export interface ProductSearchString {
    name: string;
    image: string;
    slug: string;
}


export type MostSoldProduct = {
    product: Product;
    totalQuantitySold: number;
}

export type SalesByCategory = {
    categoryName: string;
    totalRevenue: number;
}

