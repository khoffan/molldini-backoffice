<script setup lang="ts">
import { ref } from "vue";
import { useCurrentUser } from "vuefire";

const user = useCurrentUser();

// สมมติฐานข้อมูลสถิติสำหรับหน้าแรก
const stats = ref([
  { label: 'ผู้ใช้งานทั้งหมด', value: '1,284', icon: '👥', color: 'text-blue-600' },
  { label: 'คำสั่งซื้อวันนี้', value: '42', icon: '📦', color: 'text-indigo-600' },
  { label: 'รายการรอยืนยัน', value: '12', icon: '⏳', color: 'text-amber-600' },
  { label: 'Migration Pending', value: '3', icon: '🔄', color: 'text-rose-600' },
]);
</script>

<template>
  <div class="p-4 lg:p-8 bg-slate-50 min-h-full">
    <div class="mx-30">
      <header class="mb-8">
      <p class="text-slate-500 mt-2">
        ยินดีต้อนรับกลับมา, <span class="font-semibold text-indigo-600">{{ user?.email || 'Admin' }}</span>
      </p>
    </header>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
      <div v-for="stat in stats" :key="stat.label" 
        class="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
        <div class="flex items-center justify-between mb-4">
          <span class="text-2xl">{{ stat.icon }}</span>
          <span :class="['font-bold text-2xl', stat.color]">{{ stat.value }}</span>
        </div>
        <p class="text-sm font-medium text-slate-500">{{ stat.label }}</p>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      
      <div class="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div class="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
          <h3 class="font-bold text-slate-800">กิจกรรมล่าสุด</h3>
          <button class="text-xs text-indigo-600 font-semibold hover:underline">ดูทั้งหมด</button>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead class="bg-slate-50">
              <tr>
                <th class="px-6 py-3 text-xs font-bold text-slate-500 uppercase">ผู้ใช้</th>
                <th class="px-6 py-3 text-xs font-bold text-slate-500 uppercase">สถานะ</th>
                <th class="px-6 py-3 text-xs font-bold text-slate-500 uppercase text-right">เวลา</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr v-for="i in 4" :key="i" class="hover:bg-slate-50 transition-colors">
                <td class="px-6 py-4 text-sm text-slate-700 font-medium">user-test-0{{ i }}@mail.com</td>
                <td class="px-6 py-4">
                  <span class="px-2 py-1 text-[10px] font-bold rounded-full bg-green-100 text-green-700 uppercase">Success</span>
                </td>
                <td class="px-6 py-4 text-sm text-slate-400 text-right">{{ i * 5 }} นาทีที่แล้ว</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="space-y-6">
        <div class="bg-indigo-600 rounded-xl p-6 text-white shadow-lg shadow-indigo-200">
          <h3 class="font-bold mb-2 italic">Migration Tool</h3>
          <p class="text-sm text-indigo-100 mb-4 opacity-90">ตรวจสอบรายการข้อมูลตกค้างในระบบ Temp เพื่อทำการ Re-mapping</p>
          <router-link to="/migration-tool" 
            class="inline-block bg-white text-indigo-600 text-xs font-bold px-4 py-2 rounded-lg hover:bg-indigo-50 transition-colors">
            เปิดเครื่องมือย้ายข้อมูล
          </router-link>
        </div>

        <div class="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <h3 class="font-bold text-slate-800 mb-4 text-sm">ลิ้งก์ที่ใช้งานบ่อย</h3>
          <ul class="space-y-3">
            <li><a href="#" class="text-sm text-slate-600 hover:text-indigo-600 flex items-center">➡️ คู่มือการใช้งาน</a></li>
            <li><a href="#" class="text-sm text-slate-600 hover:text-indigo-600 flex items-center">➡️ ตั้งค่า Firebase Auth</a></li>
            <li><a href="#" class="text-sm text-slate-600 hover:text-indigo-600 flex items-center">➡️ ตรวจสอบ Log ระบบ</a></li>
          </ul>
        </div>
      </div>

    </div>
    </div>
  </div>
</template>

<style scoped>
/* สไตล์เฉพาะส่วนสำหรับจัดแต่งเพิ่มเติม */
</style>