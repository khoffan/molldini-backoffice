// 1. ข้อมูลภาพรวม (KPIs)
export interface IOverviewStats {
    revenue: number;
    orders: number;
    users: number;
    merchants: number;
}

// 2. ข้อมูลการเรียกเก็บเงินแยกตามสถานะ
export interface IBillingSummary {
    status: 'PAID' | 'UNPAID' | string;
    amount: number;
    count: number;
}

// 3. ข้อมูลสินค้าขายดี
export interface ITopSellingProduct {
    variantId: string | null;
    name: string;
    quantity: number;
}

// 4. กิจกรรมหรือออเดอร์ล่าสุด
export interface ILatestActivity {
    id: string;
    receiverName: string;
    totalPrice: number;
    createdAt: string; // ISO Date String
    status: 'PENDING' | 'SUCCESS' | 'CANCELLED' | string;
}

// 5. โครงสร้างหลักภายใน Data
export interface IDashboardData {
    overview: IOverviewStats;
    billing: IBillingSummary[];
    topSelling: ITopSellingProduct[];
    latestActivities: ILatestActivity[];
    updatedAt: string;
}


