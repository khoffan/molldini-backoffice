import type { Media } from "./mediaInterface";

export interface IPaymentChild {
    id: string;
    paymentId: string;
    label: string;
    method: string;
    isActive: boolean;
    sortOrder: number;
    createAt: Date | string;
    updateAt: Date | string;
}

export interface IPayment {
    id: string;
    label: string;
    icon?: Media | null;
    method: string;
    isActive: boolean;
    sortOrder: number;
    paymentChilds: IPaymentChild[];
    createAt: Date | string;
    updateAt: Date | string;
}

// --- สำหรับใช้งานใน Form (Request Body) ---

export interface ICreatePaymentChild {
    label: string;
    method: string;
    sortOrder?: number;
}

export interface ICreatePaymentBody {
    label: string;
    method: string;
    icon?: Media;
    children: ICreatePaymentChild[]; // ใช้ mapping เข้า paymentChilds ใน controller
}