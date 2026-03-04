import type { Media } from "./mediaInterface";


// Interface หลักสำหรับ Shipping
export interface IShipping {
    id: string;
    name: string;
    provider: string; // Unique
    description: string;
    price: number;
    estimatedDays: string;
    minOrderAmount: number;
    freeShippingThreshold: number | null; // รองรับ Optional จาก Int?
    sortOrder: number;
    isActive: boolean;
    image?: Media | null; // Media?
    createAt: Date | string; // Date เมื่อมาจาก Backend, string เมื่อเป็น JSON
    updateAt: Date | string;
}

/**
 * สำหรับตอนสร้างข้อมูลใหม่ (มักจะไม่ส่ง id, createAt, updateAt)
 */
export interface ICreateShippingBody {
    name: string;
    provider: string;
    description: string;
    price: number;
    estimatedDays: string;
    minOrderAmount?: number;
    freeShippingThreshold?: number | null;
    sortOrder?: number;
    isActive?: boolean;
    image?: { url: string; path: string } | null;
}

export interface IUpdateShippingBody extends Partial<ICreateShippingBody> { }