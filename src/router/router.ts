import { useUserStore } from "..//stores/userStore";
import { getCurrentUser } from "../firebase/utils/getCurrentuser";
import { useAuthStore } from "../stores/authStore";
import {
    createRouter,
    createWebHistory,
    type RouteRecordRaw,
} from "vue-router";

const routes: Array<RouteRecordRaw> = [
    {
        path: "/",
        name: "Home",
        component: () => import("../pages/HomePage.vue"),
        meta: { requiresAuth: true },
    },
    {
        path: "/profile",
        name: "Profile",
        component: () => import("../pages/ProfioleSettingPage.vue"),
        meta: { requiresAuth: true },
    },
    {
        path: "/login",
        name: "Login",
        component: () => import("../pages/LoginPage.vue"),
        meta: { guardOnly: true },
    },
    {
        path: "/register",
        name: "Register",
        component: () => import("../pages/RegisterPage.vue"),
        meta: { guardOnly: true },
    },
    {
        path: "/payments",
        name: "payment",
        component: () => import("../layout/BaseLayout.vue"),
        children: [
            {
                path: "",
                name: "payment-list",
                component: () => import("../pages/PaymentPage.vue"),
                meta: { guardOnly: true },
            },
            {
                path: "add",
                name: "payment-add",
                component: () => import("../pages/AddPaymentPage.vue"),
                meta: { guardOnly: true },
            },
            {
                path: "edit/:id",
                name: "payment-edit",
                component: () => import("../pages/EditPaymentPage.vue"),
                meta: { guardOnly: true },
            },
        ],
        meta: { guardOnly: true },

    },
    {
        path: "/shippings",
        name: "shipping",
        component: () => import("../layout/BaseLayout.vue"),
        children: [
            {
                path: "",
                name: "shipping-list",
                component: () => import("../pages/ShippingPage.vue"),
                meta: { guardOnly: true },
            },
            {
                path: "add",
                name: "shipping-add",
                component: () => import("../pages/AddShippingPage.vue"),
                meta: { guardOnly: true },
            },
            {
                path: "edit/:id",
                name: "shipping-edit",
                component: () => import("../pages/EditShippingPage.vue"),
                meta: { guardOnly: true },
            },
        ],
        meta: { guardOnly: true },
    },
    {
        // ดักทางเดินมั่ว (404) ที่คุยกันไว้ใน React
        path: "/:pathMatch(.*)*",
        redirect: "/",
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach(async (to, from, next) => {
    const authStore = useAuthStore();
    const userStore = useUserStore();

    // 1. รอสถานะจาก Firebase (ถ้ายังไม่มีการ Sync หรือยังไม่ได้โหลด)
    if (!authStore.isAuthen && !authStore.isSync) {
        console.log("router.beforeEach: Syncing Auth...");
        const user: any = await getCurrentUser();
        if (user) {
            const idtoken = await user.getIdToken();
            await authStore.syncAuth({ idtoken });
        } else {
            // ถ้าไม่มี User ให้ตั้งค่าว่า Sync เสร็จแล้ว (แต่เป็น null)
            authStore.isSync = true;
        }
    }
    await userStore.fetchUser();

    const requiresAuth: boolean = to.matched.some((record) => record.meta.requiresAuth);
    const guestOnly: boolean = to.matched.some((record) => record.meta.guardOnly);

    const isAuthPage = to.path === '/login' || to.path === '/register';


    if (requiresAuth && !authStore.isAuthen) {
        // ถ้าหน้านี้ต้องใช้สิทธิ์ แต่ไม่ได้ Login -> ไปหน้า Login
        next('/login')
    } else if (guestOnly && authStore.isAuthen && isAuthPage) {
        // ถ้า Login อยู่แล้วแต่จะเข้าหน้า Login/Register -> ไปหน้า Home
        next('/')
    } else {
        // ไปหน้าตามปกติ
        next()
    }
})

export default router;
