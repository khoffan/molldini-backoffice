import type { IShipping, IUpdateShippingBody } from '@/interface/shippingInterface';
import api from '@/lib/api';
import { defineStore } from 'pinia';

interface shippingState {
    shippings: IShipping[]
    loading: boolean
    error: string | null
}

export const useShippingStore = defineStore('shiping', {
    state: (): shippingState => ({
        shippings: [],
        loading: false,
        error: null
    }),
    actions: {
        async fetchShippings() {
            this.loading = true;
            try {
                const res = await api.get('/api/v1/shippings');
                this.shippings = res.data as IShipping[];
            } catch (e: any) {
                this.loading = false;
                this.error = e.message;
            }
        },

        async createShipping(shipping: IShipping) {
            try {
                const res = await api.post('/api/v1/shippings', shipping);
                this.shippings.push(res.data as IShipping);
                return { success: true };
            } catch (e: any) {
                this.loading = false;
                this.error = e.message;
            }
        },

        async updateShipping(id: string, shipping: IUpdateShippingBody) {
            try {
                const res = await api.put(`/api/v1/shippings/${id}`, shipping);
                const index = this.shippings.findIndex(s => s.id === id);
                if (index !== -1) {
                    this.shippings[index] = res.data as IShipping;
                }
                return { success: true };
            } catch (e: any) {
                this.loading = false;
                this.error = e.message;
            }
        },

        async deleteShiiping(id: string) {
            try {
                await api.delete(`/api/v1/shippings/${id}`);
                this.shippings = this.shippings.filter(s => s.id !== id);
            } catch (e: any) {
                this.loading = false;
                this.error = e.message;
            }
        }
    }
});