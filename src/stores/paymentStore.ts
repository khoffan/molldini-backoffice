import api from '@/lib/api';
import type { ICreatePaymentBody, IPayment } from '../interface/paymentInterface';
import { defineStore } from 'pinia';
import { AxiosError } from 'axios';

interface paymentState {
    payments: IPayment[]
    loading: boolean
    error: string | null
}

export const usePaymentStore = defineStore('payment', {
    state: (): paymentState => ({
        payments: [],
        loading: false,
        error: null
    }),
    actions: {
        async fetchPayments() {
            this.loading = true;
            try {
                const res = await api.get('/api/v1/payments');
                const paymentOrder = (res.data as IPayment[]).sort((a, b) => a.sortOrder - b.sortOrder);
                this.payments = paymentOrder;
            } catch (e: any) {
                this.loading = false;
                this.error = e.message;
            } finally {
                this.loading = false;
            }
        },

        async fetchPaymentById(id?: string) {
            this.loading = true;
            try {
                const res = await api.get('/api/v1/payments/' + id);
                const paymentOrder = (res.data as IPayment);
                console.log(paymentOrder);
                return paymentOrder;
            } catch (e: any) {
                this.loading = false;
                this.error = e.message;
            } finally {
                this.loading = false;
            }
        },

        async updatePayment(id: string, payment: ICreatePaymentBody) {
            try {
                const res = await api.put(`/api/v1/payments/${id}/update`, payment);
                const paymentData = res.data as IPayment;
                const index = this.payments.findIndex(p => p.id === id);
                if (index !== -1) {
                    this.payments[index] = paymentData;
                }
                return { success: true };
            } catch (e: any) {
                this.error = e.message;
                throw e;
            }
        },

        async createPayment(payment: ICreatePaymentBody) {
            try {
                const res = await api.post('/api/v1/payments', payment);
                const paymentData = res.data as IPayment;
                this.payments.push(paymentData);
                // เรียงใหม่หลังเพิ่ม
                this.payments.sort((a, b) => a.sortOrder - b.sortOrder);
                return { success: true };
            } catch (e: any) {
                if (e instanceof AxiosError) {
                    this.error = e.response?.data.message;
                    throw e.response?.data.message;
                }
                this.error = "เกิดข้อผิดพลาด";
                throw "เกิดข้อผิดพลาด";
            }
        },

        async deletePayment(id: string) {
            try {
                await api.delete(`/api/v1/payments/${id}/delete`);
                this.payments = this.payments.filter(p => p.id !== id);
            } catch (e: any) {
                this.error = e.message;
            }
        },

        // แถม: ฟังก์ชันสำหรับเปิด-ปิดการใช้งาน (Soft Update)
        async toggleStatus(id: string, currentStatus: boolean) {
            try {
                await api.patch(`/api/v1/payments/${id}/status`, { isActive: !currentStatus });
                const index = this.payments.findIndex(p => p.id === id);
                if (index !== -1) {
                    this.payments[index]!.isActive = !currentStatus;
                }
            } catch (e: any) {
                this.error = e.message;
            }
        }
    }
});