import { UserRole, type AppUser } from '../interface/userInterface'
import { defineStore } from 'pinia'
import api from '../lib/api'
import { auth } from '../firebase/firebase_conf'
import { errorReturn } from '../utils/errorReturn'
import { signOut } from 'firebase/auth'


export interface authState {
    auth: AppUser | null
    loading: boolean
    error: string | null,
    isSync: boolean
    fullname: string | null
}


export const useAuthStore = defineStore('auth', {
    state: (): authState => ({
        auth: null,
        loading: false,
        error: null,
        isSync: false,
        fullname: null
    }),
    actions: {
        clearState() {
            this.auth = null
            this.loading = false
            this.error = null
            this.isSync = false
            this.fullname = null
        },
        setFullname(fullname: string) {
            this.fullname = fullname
        },
        async syncAuth({ idtoken }: { idtoken: string }) {
            this.loading = true
            try {
                const role = UserRole.ADMIN
                const res = await api.post("/api/v1/users/me", {
                    role,
                    fullname: this.fullname
                }, {
                    headers: {
                        Authorization: `Bearer ${idtoken}`,
                    },
                });
                const rawData = res.data;
                // 💡 Mapping ข้อมูลตรงนี้เลย
                const appUser: AppUser = {
                    uid: rawData.uid,
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
                    addresses: [],
                    orders: [],
                    userDevices: [],
                };
                this.isSync = true
                this.auth = appUser
            } catch (e: unknown) {
                const errStr = errorReturn(e)
                this.loading = false
                this.error = errStr
            } finally {
                this.loading = false
            }
        },
        async logout() {
            try {
                await signOut(auth)
                this.clearState()
            } catch (e: unknown) {
                const errStr = errorReturn(e)
                this.loading = false
                this.error = errStr
            } finally {
                this.loading = false
            }
        }
    },
    getters: {
        isAuthen: (state) => !!state.auth,
        isAdmin: (state) => state.auth?.role === UserRole.ADMIN,
    }
})