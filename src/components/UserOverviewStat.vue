<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useStatStore } from "../stores/statStore";

const statStore = useStatStore();
const { userStat, loading, error } = storeToRefs(statStore);

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("th-TH", {
    style: "currency",
    currency: "THB",
  }).format(value);
};

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleString("th-TH");
};
</script>

<template>
  <div class="space-y-6 p-1">
    <div v-if="loading" class="flex justify-center items-center h-64">
      <div
        class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"
      ></div>
    </div>

    <div
      v-else-if="error"
      class="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100"
    >
      {{ error }}
    </div>

    <template v-else-if="userStat">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <p class="text-slate-500 text-sm font-medium">ผู้ใช้ทั้งหมด</p>
          <h3 class="text-3xl font-bold text-slate-800">
            {{ userStat.activeStatus.totalUsers }}
          </h3>
          <p class="text-xs text-slate-400 mt-2">Account ทั้งหมดในระบบ</p>
        </div>

        <div
          class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 border-l-4 border-l-emerald-500"
        >
          <p class="text-slate-500 text-sm font-medium">Active (24 ชม.)</p>
          <h3 class="text-3xl font-bold text-emerald-600">
            {{ userStat.activeStatus.active24h }}
          </h3>
          <p class="text-xs text-slate-400 mt-2">ผู้ใช้ที่เข้าสู่ระบบล่าสุด</p>
        </div>

        <div
          class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 border-l-4 border-l-blue-500"
        >
          <p class="text-slate-500 text-sm font-medium">สมัครใหม่ (30 วัน)</p>
          <h3 class="text-3xl font-bold text-blue-600">
            {{ userStat.activeStatus.newUsers30d }}
          </h3>
          <p class="text-xs text-slate-400 mt-2">New registration</p>
        </div>

        <div
          class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 border-l-4 border-l-amber-500"
        >
          <p class="text-slate-500 text-sm font-medium">ยอดซื้อเฉลี่ย (AOV)</p>
          <h3 class="text-2xl font-bold text-amber-600">
            {{
              userStat.insights.averageOrderValue.toLocaleString(undefined, {
                maximumFractionDigits: 2,
              })
            }}
          </h3>
          <p class="text-xs text-slate-400 mt-2">บาท ต่อ ออเดอร์</p>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div
          class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col"
        >
          <h4 class="font-bold text-slate-700 mb-4 flex items-center gap-2">
            <span>👥</span> ผู้ใช้แยกตามบทบาท
          </h4>
          <div class="space-y-4 flex-1">
            <div
              v-for="role in userStat.summary"
              :key="role.role"
              class="flex items-center justify-between"
            >
              <div class="flex items-center gap-3">
                <div
                  :class="[
                    'w-2 h-2 rounded-full',
                    role.role === 'ADMIN'
                      ? 'bg-purple-500'
                      : role.role === 'MERCHANT'
                        ? 'bg-orange-500'
                        : 'bg-blue-500',
                  ]"
                ></div>
                <span class="text-sm font-semibold text-slate-600">{{
                  role.role
                }}</span>
              </div>
              <span
                class="text-sm font-bold bg-slate-50 px-3 py-1 rounded-full text-slate-700"
              >
                {{ role.count }} คน
              </span>
            </div>
          </div>
          <div
            class="mt-6 pt-4 border-t border-slate-50 text-[10px] text-slate-400 uppercase tracking-widest"
          >
            Last Updated: {{ formatDate(userStat.updatedAt) }}
          </div>
        </div>

        <div
          class="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden"
        >
          <div class="p-6 border-b border-slate-50">
            <h4 class="font-bold text-slate-700">
              🏆 ลูกค้าที่มียอดสั่งซื้อสูงสุด (Top Spenders)
            </h4>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full text-left">
              <thead class="bg-slate-50">
                <tr>
                  <th
                    class="px-6 py-3 text-xs font-semibold text-slate-500 uppercase"
                  >
                    ชื่อลูกค้า
                  </th>
                  <th
                    class="px-6 py-3 text-xs font-semibold text-slate-500 uppercase"
                  >
                    อีเมล
                  </th>
                  <th
                    class="px-6 py-3 text-xs font-semibold text-slate-500 uppercase text-right"
                  >
                    ยอดซื้อสะสม
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-50">
                <tr
                  v-for="spender in userStat.topSpenders"
                  :key="spender.userId"
                  class="hover:bg-blue-50/30 transition-colors"
                >
                  <td class="px-6 py-4">
                    <div class="font-bold text-slate-700">
                      {{ spender.name }}
                    </div>
                  </td>
                  <td class="px-6 py-4 text-sm text-slate-500">
                    {{ spender.email }}
                  </td>
                  <td class="px-6 py-4 text-right">
                    <div class="font-bold text-blue-600">
                      {{ formatCurrency(spender.totalSpent) }}
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
