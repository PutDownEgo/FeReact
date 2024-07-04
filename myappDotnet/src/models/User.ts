import { z } from 'zod';


export const GenderEnum = z.enum(['MALE', 'FEMALE', 'OTHER']);



export const UserRequestSchema = z.object({
    username: z.string()
        .min(8, { message: "Username must be at least 8 characters long" }),
    password: z.string()
        .min(8, { message: "Password must be at least 8 characters long" })
        .refine(value => /[a-z]/.test(value), {
            message: "Password must contain at least one lowercase letter ('a'-'z')",
            path: ['password']
        })
        .refine(value => /[A-Z]/.test(value), {
            message: "Password must contain at least one uppercase letter ('A'-'Z')",
            path: ['password']
        })
        .refine(value => /\W|_/.test(value), {
            message: "Password must contain at least one non-alphanumeric character",
            path: ['password']
        }),
    firstName: z.string()
        .min(1, { message: "First name must not be empty" }),
    lastName: z.string()
        .min(1, { message: "Last name must not be empty" }),
    email: z.string()
        .email({ message: "Invalid email address" }),
    phoneNumber: z.string()
        .min(10, { message: "Phone number must be at least 10 digits long" })
        .regex(/^[0-9]+$/, "Phone number must contain only digits"),
    dateOfBirth: z.date()
        .refine((date) => date <= new Date(), {
            message: "Date of birth must be a past date."
        }),
    gender: z.enum(['FEMALE', 'MALE', 'OTHER'])
});

export type UserRequest = z.infer<typeof UserRequestSchema>;

export enum UserStatus {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE"
}

export enum Gender {
    MALE = "MALE",
    FEMALE = "FEMALE",
    OTHER = "OTHER"
}


export enum Role {
    USER = "USER",
    ADMIN = "ADMIN",
    STAFF = "STAFF",
}



export type User = {
    id: string;
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    gender: Gender;
    address: string;
    dateOfBirth: Date;
    status: UserStatus;
    avatar: string;
    roles?: Role;
}


export const UpdateUserRequestSchema = z.object({
    firstName: z.string()
        .min(1, { message: "First name must not be empty" }),
    lastName: z.string()
        .min(1, { message: "Last name must not be empty" }),
    emailAddress: z.string()
        .email({ message: "Invalid email address" }),
    address: z.string()
        .min(1, { message: "Address must not be empty" }),
    phoneNumber: z.string()
        .min(10, { message: "Phone number must be at least 10 digits long" })
        .regex(/^[0-9]+$/, "Phone number must contain only digits"),
    dateOfBirth: z.date()
        .refine((date) => {
            const eighteenYearsAgo = new Date();
            eighteenYearsAgo.setFullYear(eighteenYearsAgo.getFullYear() - 18);
            return date <= eighteenYearsAgo;
        }, {
            message: "You must be at least 18 years old."
        }),
    gender: GenderEnum,
    status: z.nativeEnum(UserStatus)
});

export type UpdateUserRequest = z.infer<typeof UpdateUserRequestSchema>;


export const NewSystemUserSchema = UpdateUserRequestSchema.extend({
    username: z.string()
        .min(1, { message: "Username must not be empty" }),
    password: z.string()
        .min(8, { message: "Password must be at least 8 characters long" }),
    roles: z.nativeEnum(Role)
});

export type NewSystemUserRequest = z.infer<typeof NewSystemUserSchema>;

export const UpdateSystemUserSchema = UpdateUserRequestSchema.extend({
    username: z.string()
        .min(1, { message: "Username must not be empty" }),
    password: z.string()
        .min(8, { message: "Password must be at least 8 characters long" }),
    roles: z.nativeEnum(Role)
});

export type UpdateSystemUserRequest = z.infer<typeof UpdateSystemUserSchema>;