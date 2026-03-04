<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { auth } from '../firebase/firebase_conf';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useAuthStore } from '../stores/authStore';

const router = useRouter();
const loading = ref(false);
const authStore = useAuthStore()
const form = reactive({
  fullName: '',
  email: '',
  password: '',
  confirmPassword: '',
});

const handleRegisterAdmin = async () => {
  loading.value = true;
  // Logic: สมัครสมาชิกและมอบสิทธิ์ Admin ทันที (Backend handle role: 'ADMIN')
  console.log('Registering Admin User:', form.fullName);

  try {
    authStore.setFullname(form.fullName)
    const result = await createUserWithEmailAndPassword(auth, form.email, form.password);

    const idtoken = await result.user.getIdToken();
    await authStore.syncAuth({ idtoken });

    router.push('/');
  } catch(e: any) {
    console.log(e.message);
    loading.value = false;
    alert(e.message);
    return;
  }
  loading.value = false;
  router.push('/login');

};
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-slate-100 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg border border-slate-200">
      
      <div class="text-center">
        <div class="mx-auto h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
          <span class="text-blue-600 font-bold text-xl">M</span>
        </div>
        <h2 class="mt-4 text-3xl font-extrabold text-slate-900 tracking-tight">
          Admin Registration
        </h2>
        <p class="mt-2 text-sm text-slate-500">
          สร้างบัญชีผู้ดูแลระบบ <span class="font-semibold text-slate-700">Molldini Backoffice</span>
        </p>
      </div>

      <div class="bg-amber-50 border-l-4 border-amber-400 p-4 rounded">
        <div class="flex">
          <div class="ml-3">
            <p class="text-xs text-amber-700">
              <strong>หมายเหตุ:</strong> บัญชีนี้สำหรับเข้าใช้งานระบบหลังบ้านเท่านั้น ไม่สามารถใช้สั่งซื้อสินค้าในหน้าเว็บไซต์หลักได้
            </p>
          </div>
        </div>
      </div>

      <form class="mt-6 space-y-5" @submit.prevent="handleRegisterAdmin">
        <div class="rounded-md shadow-sm space-y-4">
          <div>
            <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">ชื่อ-นามสกุล</label>
            <input 
              v-model="form.fullName"
              type="text" required 
              class="appearance-none relative block w-full px-3 py-3 border border-slate-300 placeholder-slate-400 text-slate-900 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              placeholder="Administrator Name"
            />
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">อีเมลแอดมิน</label>
            <input 
              v-model="form.email"
              type="email" required 
              class="appearance-none relative block w-full px-3 py-3 border border-slate-300 placeholder-slate-400 text-slate-900 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              placeholder="admin@molldini.com"
            />
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">รหัสผ่าน</label>
            <input 
              v-model="form.password"
              type="password" required 
              class="appearance-none relative block w-full px-3 py-3 border border-slate-300 placeholder-slate-400 text-slate-900 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              placeholder="••••••••"
            />
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">ยืนยันรหัสผ่าน</label>
            <input 
              v-model="form.confirmPassword"
              type="password" required 
              class="appearance-none relative block w-full px-3 py-3 border border-slate-300 placeholder-slate-400 text-slate-900 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              placeholder="••••••••"
            />
          </div>
        </div>

        <div>
          <button 
            type="submit"
            :disabled="loading"
            class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-lg text-white bg-slate-900 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 transition-all disabled:opacity-50"
          >
            <span v-if="loading">กำลังสร้างบัญชีแอดมิน...</span>
            <span v-else>สร้างบัญชี Admin</span>
          </button>
        </div>

        <div class="text-center">
          <router-link to="/login" class="text-sm font-medium text-blue-600 hover:text-blue-500">
            มีบัญชีแอดมินแล้ว? เข้าสู่ระบบ
          </router-link>
        </div>
      </form>
    </div>
  </div>
</template>