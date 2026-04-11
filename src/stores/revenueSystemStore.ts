import { defineStore } from 'pinia'
import api from '@/lib/api';
import type { SystemRevenueLog, SystemSetting } from '@/interface/systemRevenueInterface';

interface RevenueSystemState {
    isSync: boolean;
    loading: boolean;
    revenueLogs: SystemRevenueLog[];
    settings: SystemSetting | null;
}

export const useRevenueSystemStore = defineStore('revenueSystem', {
    state: (): RevenueSystemState => ({
        isSync: false,
        loading: false,
        revenueLogs: [],
        settings: null,
    }),

    getters: {
        totalRevenue: (state) => state.revenueLogs.reduce((sum, log) => sum + Number(log.revenueAmount), 0),
        totalSalesVolume: (state) => state.revenueLogs.reduce((sum, log) => sum + Number(log.totalAmount), 0),
        totalNetToMerchants: (state) => state.revenueLogs.reduce((sum, log) => sum + Number(log.netToMerchant), 0)
    },

    actions: {
        // 🔄 ฟังก์ชันหลักในการดึงข้อมูลทั้งหมด
        async syncRevenueData() {
            this.loading = true;
            try {
                // เรียก API พร้อมกันเพื่อความเร็ว
                const [logsRes, settingsRes] = await Promise.all([
                    api.get('/api/v1/system/revenue/log'),
                    api.get('/api/v1/system/setting/revenue') // สมมติว่าเป็น endpoint ดึงค่าปัจจุบัน
                ]);

                // 1. จัดการ Revenue Logs
                this.revenueLogs = logsRes.data.map((log: any) => ({
                    ...log,
                    totalAmount: Number(log.totalAmount),
                    revenueAmount: Number(log.revenueAmount),
                    netToMerchant: Number(log.netToMerchant)
                }));

                // 2. จัดการ Settings (ถ้า Backend คืนค่ามาเป็น null ให้เรียกใช้ฟังก์ชัน init)
                if (settingsRes.data) {
                    this.settings = {
                        ...settingsRes.data,
                        feePercentage: Number(settingsRes.data.feePercentage)
                    };
                } else {
                    // ถ้ายังไม่มีข้อมูลในระบบเลย ให้สั่งสร้างค่าเริ่มต้น
                    await this.initializeSettings();
                }

                this.isSync = true;
            } catch (error) {
                console.error('Error syncing revenue system:', error);
            } finally {
                this.loading = false;
            }
        },

        // 🆕 ฟังก์ชันสร้างค่าเริ่มต้น (กรณีเปิดระบบครั้งแรก)
        async initializeSettings() {
            try {
                const res = await api.post('/api/v1/system/setting/revenue', {
                    feePercentage: 5.0 // ค่าเริ่มต้น 5% หรือตามที่คุณต้องการ
                });
                this.settings = {
                    ...res.data,
                    feePercentage: Number(res.data.feePercentage)
                };
            } catch (error) {
                console.error('Failed to initialize system settings:', error);
            }
        },

        // 📝 ฟังก์ชันอัปเดตค่า GP %
        async updateFeePercentage(newFee: number, id: string | undefined) {
            if (!id) {
                await this.initializeSettings();
                return;
            }
            try {
                const res = await api.patch(`/api/v1/system/setting/revenue/${id}`, {
                    feePercentage: newFee
                });

                // อัปเดตใน Store ทันที
                if (this.settings) {
                    this.settings.feePercentage = Number(res.data.feePercentage);
                    this.settings.updatedAt = res.data.updatedAt;
                    this.settings.updatedBy = res.data.updatedBy;
                }

                // แนะนำให้สั่ง sync logs ใหม่ด้วย เพราะเปอร์เซ็นต์ที่เปลี่ยนอาจส่งผลต่อการโชว์ simulation ในอนาคต
                // หรือเพื่อให้ข้อมูลในหน้าจอตรงกับฐานข้อมูลที่สุด
                // await this.syncRevenueData(); 

                return res.data;
            } catch (error) {
                console.error('Update fee failed:', error);
                throw error;
            }
        }
    },
})