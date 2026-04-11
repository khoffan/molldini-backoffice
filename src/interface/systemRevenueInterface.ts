export const SysLogStatus = {
    PENDING: "PENDING",
    COMPLETED: "COMPLETED",
    FAILED: "FAILED",
    REFUNDED: "REFUNDED",
} as const;

// สร้าง Type จาก Object เพื่อใช้ระบุ Type ใน Interface
export type SysLogStatus = typeof SysLogStatus[keyof typeof SysLogStatus];

export interface SystemSetting {
    id: string;
    feePercentage: number; // จาก Decimal ใน DB -> number ใน Frontend
    createdAt: string | Date;
    updatedAt: string | Date;
    updatedBy?: string | null;
}

export interface SystemRevenueLog {
    id: string;
    orderId: string;
    subOrderId: string;
    totalAmount: number;     // ยอดขายรวมของ SubOrder นั้นๆ
    feePercentage: number;   // ค่า % ที่ใช้คำนวณ ณ เวลานั้น (เช่น 5.0)
    revenueAmount: number;   // กำไรที่ระบบได้รับ (Fee Amount)
    netToMerchant: number;   // เงินสุทธิที่ต้องโอนให้ร้านค้า
    status: SysLogStatus;
    createdAt: string | Date;
    updatedAt: string | Date;

    // Optional: ถ้ามีการดึง Relation มาด้วย
    subOrder?: any; // หรือระบุเป็น SubOrder interface ที่คุณมี
    order?: any;    // หรือระบุเป็น Order interface
}