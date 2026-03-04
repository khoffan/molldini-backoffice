import type { AppUser } from '../interface/userInterface';
import api from '../lib/api';
import { errorReturn } from '../utils/errorReturn';
import { defineStore } from 'pinia';

export interface userState {
    user: AppUser | null
    loading: boolean
    error: string | null
}

export const useUserStore = defineStore('user', {
    state: (): userState => ({
        user: null,
        loading: false,
        error: null
    }),
    actions: {
        async fetchUser() {
            this.loading = true;
            try {
                const response = await api.get(`/api/v1/profile`);
                const rawData = response.data;

                const appUser: AppUser = {
                    uid: rawData.id,
                    providerId: rawData.provider,
                    email: rawData.email,
                    role: rawData.role,
                    firstName: rawData.firstName,
                    lastName: rawData.lastName,
                    displayName: rawData.name,
                    image: rawData.image,
                    emailVerified: rawData.emailVerified,
                    phoneNumber: rawData.phoneNumber,
                    createdAt: rawData.createdAt,
                    lastLogin: rawData.lastLogin,
                    addresses: rawData.addresses,
                    orders: rawData.orders, userDevices: rawData.userDevices,
                };
                console.log("user profile =>", appUser)
                this.user = appUser;
            } catch (e: unknown) {
                const errStr = errorReturn(e)
                this.loading = false
                this.error = errStr
            }
        }
    }
});