import type { IDashboardData } from "@/interface/dashboardInterface";
import type { IMerchantStatsData } from "@/interface/merchantOverviewInterface";
import type { IOrderStats } from "@/interface/orderStatInterface";
import type { IUserStatsData } from "@/interface/userStatInterface";
import api from "@/lib/api";
import { defineStore } from "pinia";

interface statState {
    overview?: IDashboardData | null,
    orderStat?: IOrderStats | null,
    userStat?: IUserStatsData | null,
    merchantStat?: IMerchantStatsData | null,
    loading: boolean,
    error: string | null,
}

export const useStatStore = defineStore("stat", {
    state: (): statState => ({
        overview: null,
        orderStat: null,
        userStat: null,
        merchantStat: null,
        loading: false,
        error: null,
    }),
    actions: {
        async fetchOverviewStats() {
            this.loading = true;
            try {
                const res = await api.get("/api/v1/stats/overview");
                const data = res.data;
                this.overview = data.data as IDashboardData;
            } catch (e: unknown) {
                this.error = e instanceof Error ? e.message : "Unknown error";
            } finally {
                this.loading = false
            }
        },
        async fetchOrderStat() {
            this.loading = true;
            try {
                const res = await api.get("/api/v1/stats/order");
                const data = res.data;
                this.orderStat = data.data as IOrderStats;
            } catch (e: unknown) {
                this.error = e instanceof Error ? e.message : "Unknown error";
            } finally {
                this.loading = false
            }
        },
        async fetchUserStat() {
            this.loading = true;
            try {
                const res = await api.get("/api/v1/stats/user");
                const data = res.data;
                this.userStat = data.data as IUserStatsData;
            } catch (e: unknown) {
                this.error = e instanceof Error ? e.message : "Unknown error";
            } finally {
                this.loading = false
            }
        },
        async fetchMerchantStat() {
            this.loading = true;
            try {
                const res = await api.get("/api/v1/stats/merchant");
                const data = res.data;
                this.merchantStat = data.data as IMerchantStatsData;
            } catch (e: unknown) {
                this.error = e instanceof Error ? e.message : "Unknown error";
            } finally {
                this.loading = false
            }
        },
    },
});