import type { IBillingSummary } from "./dashboardInterface";

// --- Interface สำหรับข้อมูล Order โดยเฉพาะ (ตาม JSON ล่าสุด) ---
export interface IOrderStats {
    totalSales: number;
    totalOrders: number;
    invoices: IBillingSummary[]; // ใช้ IBillingSummary เดิมได้ เพราะโครงสร้าง status, amount, count ตรงกัน
    recentActivities: IRecentActivity[];
    updatedAt: string;
}

// ปรับ ILatestActivity ให้รับกับ recentActivities ใน JSON ล่าสุด
export interface IRecentActivity {
    receiptNumber: string;
    amount: number;
    paymentMethod: string;
    paidAt: string;
    order: {
        receiverName: string;
    };
}