// 1. สรุปจำนวนผู้ใช้แยกตามบทบาท
export interface IUserRoleSummary {
    role: 'ADMIN' | 'USER' | 'MERCHANT' | string;
    count: number;
}

// 2. สถานะการเคลื่อนไหวของผู้ใช้
export interface IUserActiveStatus {
    totalUsers: number;
    active24h: number;
    newUsers30d: number;
}

// 3. สถิติอุปกรณ์ที่ใช้งาน
export interface IDeviceStat {
    type: string | null;
    count: number;
}

// 4. ข้อมูลลูกค้าที่มียอดซื้อสูงสุด
export interface ITopSpender {
    userId: string;
    name: string;
    email: string;
    totalSpent: number;
}

// 5. ข้อมูลเชิงลึก (KPIs)
export interface IUserInsights {
    averageOrderValue: number;
    totalOrders: number;
}

// 6. โครงสร้างหลักภายใน Data ของ User Stats
export interface IUserStatsData {
    summary: IUserRoleSummary[];
    activeStatus: IUserActiveStatus;
    devices: IDeviceStat[];
    topSpenders: ITopSpender[];
    insights: IUserInsights;
    updatedAt: string; // ISO Date String
}