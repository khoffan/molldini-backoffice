<script setup lang="ts">
import { onMounted, computed } from "vue";
import { useCurrentUser } from "vuefire";
import { useStatStore } from "../stores/statStore";
import { storeToRefs } from "pinia"; // เพิ่มสิ่งนี้เพื่อรักษา Reactivity

const user = useCurrentUser();
const statStore = useStatStore();

// ดึงข้อมูลออกมาจาก Store แบบ Reactive
const { overview: dashboardData, loading, error } = storeToRefs(statStore);

onMounted(() => {
  statStore.fetchOverviewStats();
});

// คำนวณข้อมูลสำหรับ Card ด้านบน โดยดึงจาก overview.overview
const statsCards = computed(() => {
  if (!dashboardData?.value) return [];

  const o = dashboardData.value.overview;
  console.log(o);
  return [
    {
      label: "รายได้รวม",
      value: `฿${o.revenue.toLocaleString()}`,
      icon: "💰",
      color: "text-emerald-600",
    },
    {
      label: "คำสั่งซื้อทั้งหมด",
      value: o.orders.toLocaleString(),
      icon: "📦",
      color: "text-indigo-600",
    },
    {
      label: "ผู้ใช้งาน",
      value: o.users.toLocaleString(),
      icon: "👥",
      color: "text-blue-600",
    },
    {
      label: "ร้านค้าในระบบ",
      value: o.merchants.toLocaleString(),
      icon: "🏪",
      color: "text-purple-600",
    },
  ];
});

const getStatusClass = (status: string) => {
  switch (status) {
    case "PAID":
      return "bg-green-100 text-green-700";
    case "UNPAID":
      return "bg-rose-100 text-rose-700";
    case "PENDING":
      return "bg-amber-100 text-amber-700";
    default:
      return "bg-slate-100 text-slate-700";
  }
};
</script>

<template>
  <div class="p-4 lg:p-8 bg-slate-50 min-h-screen">
    <div class="max-w-7xl mx-auto">
      <div
        v-if="loading && !dashboardData"
        class="flex items-center justify-center h-64"
      >
        <p class="text-slate-400 font-bold animate-pulse">กำลังโหลดข้อมูล...</p>
      </div>

      <div
        v-else-if="error"
        class="bg-rose-50 border border-rose-200 p-4 rounded-xl text-rose-600"
      >
        เกิดข้อผิดพลาด: {{ error }}
      </div>

      <template v-else-if="dashboardData">
        <header class="mb-8 flex justify-between items-end">
          <div>
            <h1
              class="text-2xl font-black text-slate-800 uppercase tracking-tight"
            >
              Dashboard Overview
            </h1>
            <p class="text-slate-500 text-sm mt-1">
              ยินดีต้อนรับกลับมา,
              <span class="font-semibold text-indigo-600">{{
                user?.email || "Admin"
              }}</span>
            </p>
          </div>
          <div class="text-right hidden md:block">
            <p
              class="text-[10px] font-bold text-slate-400 uppercase tracking-widest"
            >
              Last Updated
            </p>
            <p class="text-xs text-slate-500 font-medium">
              {{ new Date(dashboardData.updatedAt).toLocaleString() }}
            </p>
          </div>
        </header>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div
            v-for="stat in statsCards"
            :key="stat.label"
            class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all group"
          >
            <div class="flex items-center justify-between mb-4">
              <div
                class="p-3 bg-slate-50 rounded-xl group-hover:bg-indigo-50 transition-colors"
              >
                <span class="text-2xl">{{ stat.icon }}</span>
              </div>
              <span :class="['font-black text-2xl', stat.color]">{{
                stat.value
              }}</span>
            </div>
            <p
              class="text-xs font-bold text-slate-400 uppercase tracking-wider"
            >
              {{ stat.label }}
            </p>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div class="lg:col-span-2 space-y-8">
            <div
              class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
            >
              <div
                class="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-white"
              >
                <h3
                  class="font-black text-slate-800 text-sm uppercase tracking-wider"
                >
                  ออเดอร์ล่าสุด
                </h3>
                <button
                  class="text-xs text-indigo-600 font-bold hover:underline"
                >
                  Manage Orders
                </button>
              </div>
              <div class="overflow-x-auto">
                <table class="w-full text-left border-collapse">
                  <thead>
                    <tr class="bg-slate-50/50">
                      <th
                        class="px-6 py-3 text-[10px] font-black text-slate-400 uppercase"
                      >
                        Order ID
                      </th>
                      <th
                        class="px-6 py-3 text-[10px] font-black text-slate-400 uppercase text-right"
                      >
                        ยอดชำระ
                      </th>
                      <th
                        class="px-6 py-3 text-[10px] font-black text-slate-400 uppercase text-center"
                      >
                        สถานะ
                      </th>
                      <th
                        class="px-6 py-3 text-[10px] font-black text-slate-400 uppercase text-right"
                      >
                        วันที่
                      </th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-slate-100">
                    <tr
                      v-for="act in dashboardData.latestActivities"
                      :key="act.id"
                      class="hover:bg-slate-50 transition-colors group"
                    >
                      <td class="px-6 py-4 text-xs text-slate-600 font-mono">
                        {{ act.id.slice(0, 8) }}...
                      </td>
                      <td
                        class="px-6 py-4 text-sm text-slate-800 font-black text-right"
                      >
                        ฿{{ act.totalPrice.toLocaleString() }}
                      </td>
                      <td class="px-6 py-4 text-center">
                        <span
                          :class="[
                            'px-2 py-1 text-[9px] font-black rounded-lg uppercase',
                            getStatusClass(act.status),
                          ]"
                        >
                          {{ act.status }}
                        </span>
                      </td>
                      <td
                        class="px-6 py-4 text-[11px] text-slate-400 text-right font-medium"
                      >
                        {{ new Date(act.createdAt).toLocaleDateString() }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div
              class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
            >
              <div class="px-6 py-4 border-b border-slate-100 bg-white">
                <h3
                  class="font-black text-slate-800 text-sm uppercase tracking-wider"
                >
                  สินค้าขายดี (Top 5)
                </h3>
              </div>
              <div class="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div
                  v-for="item in dashboardData.topSelling"
                  :key="item.variantId || item.name"
                  class="flex items-center gap-4 p-4 border border-slate-100 rounded-xl hover:border-indigo-200 transition-all"
                >
                  <div
                    class="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center text-xl"
                  >
                    👟
                  </div>
                  <div>
                    <h4 class="text-sm font-bold text-slate-800">
                      {{ item.name }}
                    </h4>
                    <p class="text-[10px] font-bold text-indigo-600 uppercase">
                      ขายแล้ว {{ item.quantity }} ชิ้น
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="space-y-6">
            <div
              class="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm"
            >
              <h3
                class="font-black text-slate-800 mb-6 text-sm uppercase tracking-wider"
              >
                สรุปการเรียกเก็บเงิน
              </h3>
              <div class="space-y-4">
                <div
                  v-for="bill in dashboardData.billing"
                  :key="bill.status"
                  class="p-4 rounded-xl border-l-4"
                  :class="
                    bill.status === 'PAID'
                      ? 'bg-emerald-50 border-emerald-500'
                      : 'bg-rose-50 border-rose-500'
                  "
                >
                  <div class="flex justify-between items-center mb-1">
                    <span
                      :class="[
                        'text-[10px] font-black uppercase',
                        bill.status === 'PAID'
                          ? 'text-emerald-700'
                          : 'text-rose-700',
                      ]"
                    >
                      {{ bill.status === "PAID" ? "ชำระแล้ว" : "ค้างชำระ" }} ({{
                        bill.count
                      }}
                      รายการ)
                    </span>
                  </div>
                  <p class="text-xl font-black text-slate-800">
                    ฿{{ bill.amount.toLocaleString() }}
                  </p>
                </div>
              </div>
            </div>

            <div
              class="bg-indigo-600 rounded-2xl p-6 text-white shadow-xl shadow-indigo-100 relative overflow-hidden group"
            >
              <div class="relative z-10">
                <h3 class="font-black mb-2 italic text-lg uppercase">
                  System Sync
                </h3>
                <p
                  class="text-xs text-indigo-100 mb-6 opacity-90 leading-relaxed"
                >
                  ตรวจสอบและปรับปรุงสถานะรายการค้างชำระให้เป็นปัจจุบัน
                </p>
                <button
                  class="w-full bg-white text-indigo-600 text-[10px] font-black px-4 py-3 rounded-xl hover:bg-indigo-50 transition-all uppercase tracking-widest"
                >
                  จัดการรายการ
                </button>
              </div>
              <div
                class="absolute -right-8 -bottom-8 w-32 h-32 bg-indigo-500 rounded-full opacity-20 group-hover:scale-110 transition-transform"
              ></div>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>
