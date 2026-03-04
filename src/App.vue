<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import Navbar from "./components/Navbar.vue";
import Sidebar from "./components/SideBar.vue";
import { useAuthStore } from './stores/authStore'
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase/firebase_conf'; 

const authStore = useAuthStore();
const isInitialLoading = ref(true) // เพิ่มเพื่อกันหน้าจอแวบ
let unsubscribe: any;

onMounted(() => {
  unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
    if (!firebaseUser) {
      // ถ้า User Logout ให้เคลียร์ Store
      authStore.clearState();
    }
    // ไม่ต้องสั่ง syncAuth ที่นี่แล้ว เพราะ router.beforeEach จัดการให้ตอนโหลดหน้าแรก
    isInitialLoading.value = false;
  });
});

onUnmounted(() => {
  if (unsubscribe) unsubscribe();
});
</script>

<template>
  <div v-if="isInitialLoading" class="min-h-screen flex items-center justify-center bg-slate-50">
     <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
  </div>

  <div v-else class="min-h-screen">
    <Navbar v-if="authStore.isAuthen" />
    
    <div :class="[authStore.isAuthen ? 'flex' : '']"> 
      <Sidebar v-if="authStore.isAuthen" />

      <main :class="[authStore.isAuthen ? 'flex-1 overflow-y-auto' : 'w-full']">
        <router-view />
      </main>
    </div>
  </div>
</template>