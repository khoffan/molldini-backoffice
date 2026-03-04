import type { Merchant } from '../interface/merchantInterface'
import api from '../lib/api'
import { errorReturn } from '@/utils/errorReturn'
import { defineStore } from 'pinia'

export interface merchatState {
    merchants: Merchant[] | null
    loading: boolean
    error: string | null
}


export const merchantStore = defineStore('merchant', {
    state: (): merchatState => ({
        merchants: null,
        loading: false,
        error: null
    }),
    actions: {
        async fetchMerchnat() {
            this.loading = true;
            try {
                const res = await api.get("/api/v1/merchants");
                const data = res.data as Merchant[];
                this.merchants = data;
            } catch (e: unknown) {
                const errStr = errorReturn(e)
                this.loading = false
                this.error = errStr
            }
        }
    }
})