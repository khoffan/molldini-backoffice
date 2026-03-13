export interface ILowStockItem {
    name: string;
    stock: number;
    merchant: string;
}

export interface IMerchantRanking {
    merchantId: string;
    merchantName: string;
    revenue: number;
    orderCount: number;
}

export interface IRecentSubOrder {
    subOrderId: string;
    mainOrderId: string;
    merchant: string;
    amount: number;
    status: 'PENDING' | 'DELIVERED' | 'CANCELLED' | string;
    date: string;
}

export interface IMerchantStatsData {
    totalMerchants: number;
    inventory: {
        totalSkus: number;
        totalStockRemaining: number;
        lowStockItems: ILowStockItem[];
    };
    rankings: IMerchantRanking[];
    recentActivities: IRecentSubOrder[];
    updatedAt: string;
}