<script setup lang="ts">
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/authStore.ts";
import { computed, ref } from "vue";
import BaseDropdown from "./BaseDropdown.vue";
const router = useRouter();
const authStore = useAuthStore();

const isOpen = ref(false);

const user = computed(() => authStore.auth);
const handleLogout = async () => {
  try {
    console.log("Logging out...");
    // เรียก logout ตัวเดียวพอ (เพราะข้างในเราทำ clearState ไว้แล้ว)
    await authStore.logout();

    console.log("Logout success, redirecting...");
    // ใช้ replace แทน push เพื่อไม่ให้ User กด Back กลับมาหน้า Admin ได้
    router.replace("/login");
  } catch (error) {
    console.error("Logout failed:", error);
  }
};

const goToProfile = () => {
  router.push("/profile");
};
</script>

<template>
  <nav class="bg-white border-b border-slate-200 sticky top-0 z-50 h-14 flex items-center">
    <div class="w-full px-4">
      <div class="flex justify-between items-center">
        <div class="flex items-center space-x-4">
          <div class="flex items-center group cursor-pointer" @click="router.push('/')">
            <div class="bg-indigo-600 text-white w-8 h-8 flex items-center justify-center rounded font-bold text-sm shadow-sm group-hover:bg-indigo-700 transition-colors">
              M
            </div>
            <span class="ml-2.5 font-bold text-slate-800 tracking-tight text-sm uppercase">
              Molldini <span class="text-indigo-600">Admin</span>
            </span>
          </div>

          <div class="hidden md:flex items-center border-l border-slate-200 ml-4 pl-4">
            <span class="text-xs font-medium text-slate-400">System Control v1.0</span>
          </div>
        </div>

        <div class="flex items-center space-x-2">
          <button class="p-2 text-slate-400 hover:text-indigo-600 hover:bg-slate-50 rounded-full transition-all relative">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span class="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>

          <template v-if="user">
            <BaseDropdown width="w-52">
              <template #trigger="{ isOpen }">
                <button class="flex items-center space-x-2 pl-2 pr-1 py-1 rounded-lg hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                  <div class="text-right hidden sm:block">
                    <p class="text-xs font-bold text-slate-700 leading-none mb-0.5">
                      {{ user.displayName }}
                    </p>
                    <p class="text-[10px] text-slate-400 font-medium leading-none">
                      Admin Role
                    </p>
                  </div>
                  
                  <div class="h-8 w-8 rounded bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xs overflow-hidden shadow-sm">
                    <img v-if="user.image?.url" :src="user.image.url" class="h-full w-full object-cover" />
                    <span v-else>{{ user.displayName?.charAt(0) }}</span>
                  </div>
                </button>
              </template>

              <template #content="{ close }">
                <div class="p-1">
                  <div class="px-3 py-2 border-b border-slate-50 mb-1">
                    <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Signed in as</p>
                    <p class="text-xs font-semibold text-slate-800 truncate">{{ user.email }}</p>
                  </div>
                  
                  <button @click="goToProfile(); close()" class="w-full flex items-center px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-indigo-600 rounded transition-colors group">
                    <svg class="w-4 h-4 mr-2.5 text-slate-400 group-hover:text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Profile Setting
                  </button>

                  <div class="my-1 border-t border-slate-50"></div>

                  <button @click="handleLogout(); close()" class="w-full flex items-center px-3 py-2 text-xs font-medium text-red-500 hover:bg-red-50 rounded transition-colors group">
                    <svg class="w-4 h-4 mr-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Sign Out
                  </button>
                </div>
              </template>
            </BaseDropdown>
          </template>
        </div>
      </div>
    </div>
  </nav>
</template>

<style scoped>
/* ใช้สไตล์เพิ่มในกรณีที่ต้องการปรับแต่งเล็กน้อยที่ Tailwind ทำไม่ได้ */
.router-link-active {
  font-weight: 600;
}
</style>
