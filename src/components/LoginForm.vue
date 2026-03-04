<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { auth } from "../firebase/firebase_conf";
import { useAuthStore } from '../stores/authStore'
import {
  signInWithEmailAndPassword,
} from "firebase/auth";

const authStore = useAuthStore()
const router = useRouter();

const email = ref("");
const password = ref("");
const loading = ref(false);
const errorMsg = ref("");

const handleSubmit = async () => {
  // 1. ป้องกันการกดซ้ำขณะกำลังโหลด
  if (loading.value) return;

  loading.value = true;
  errorMsg.value = "";

  try {
    // 2. Firebase Sign In
    const result = await signInWithEmailAndPassword(auth, email.value, password.value);
    
    // 3. ดึง ID Token ล่าสุด
    const idtoken = await result.user.getIdToken();

    // 4. Sync ข้อมูลกับ Backend Molldini
    // ตัว syncAuth ควรจะตั้งค่า isSync = true ภายใน action เองเมื่อสำเร็จ
    await authStore.syncAuth({ idtoken ,});

    // 5. เมื่อ Sync สำเร็จและได้ข้อมูล User (Role Admin) ครบแล้วค่อยไปหน้าหลัก
    console.log("Login & Sync Success!");
    router.push("/"); 

  } catch (e: any) {
    // จัดการ Error ให้ User อ่านง่ายขึ้น
    if (e.code === 'auth/invalid-credential') {
      errorMsg.value = "อีเมลหรือรหัสผ่านไม่ถูกต้อง";
    } else {
      errorMsg.value = "เกิดข้อผิดพลาด: " + e.message;
    }
    console.error("Login Error:", e);
  } finally {
    loading.value = false;
  }
};

const handleToRegister = () => {
  router.push("/register");
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-slate-50 p-4">
    <div
      class="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-slate-100"
    >
      <div class="text-center mb-8">
        <h1 class="text-2xl font-bold text-slate-800">
          ยินดีต้อนรับกลับมา
        </h1>
        <p class="text-slate-500 text-sm mt-2">
          เข้าสู่ระบบเพื่อจัดการข้อมูลของคุณ
        </p>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1"
            >อีเมล</label
          >
          <input
            v-model="email"
            type="email"
            required
            class="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition"
            placeholder="name@company.com"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1"
            >รหัสผ่าน</label
          >
          <input
            v-model="password"
            type="password"
            required
            class="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition"
            placeholder="••••••••"
          />
        </div>

        <div
          v-if="errorMsg"
          class="text-red-500 text-xs bg-red-50 p-2 rounded text-center"
        >
          {{ errorMsg }}
        </div>

        <button
          :disabled="loading"
          type="submit"
          class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-lg shadow-md transition duration-200 disabled:opacity-50"
        >
          <span v-if="loading">โปรดรอสักครู่...</span>
          <span v-else>{{
             "เข้าสู่ระบบ"
          }}</span>
        </button>
      </form>

      <div class="mt-6 text-center text-sm text-slate-600">
        ต้องการสร้างบัญชีใหม่?
        <button
          @click="handleToRegister"
          class="text-indigo-600 font-bold hover:underline ml-1"
        >
          สมัครสมาชิกที่นี่
        </button>
      </div>
    </div>
  </div>
</template>
