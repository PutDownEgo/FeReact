
import { z } from 'zod';
export interface Coupon {
    id: number;
    code: string;
    discount: number;
    expiryDate: Date;
    description: string;
    quantity: number;
}



export const CouponSchema = z.object({
    expiryDate: z.date().refine(value => value != null, {
        message: "expiryDate is required",
    }),
    discount: z.number().refine(value => value != null && value > 0, {
        message: "discount is required and must be greater than 0",
    }),

    description: z.string().optional().refine(value => typeof value === 'string' && value.trim() !== '', {
        message: "description is required",
    }),
    quantity: z.number().refine(value => value != null && value > 0, {
        message: "quantity is required and must be greater than 0",
    }),
    userIds: z.array(z.string()).refine(value => value != null && value.length > 0, {
        message: "userIds is required and must contain at least one id",
    }),
});

export type CouponRequest = z.infer<typeof CouponSchema>
