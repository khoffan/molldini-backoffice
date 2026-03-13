<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useStatStore } from "../stores/statStore";

const statStore = useStatStore();
const { merchantStat, loading } = storeToRefs(statStore);

const getStatusClass = (status: string) => {
  switch (status) {
    case "PENDING":
      return "bg-amber-100 text-amber-700";
    case "DELIVERED":
      return "bg-emerald-100 text-emerald-700";
    default:
      return "bg-slate-100 text-slate-600";
  }
};
</script>

<template>
  <div class="space-y-6">
    <div v-if="loading" class="py-20 text-center text-slate-400">
      กำลังโหลดข้อมูลร้านค้า...
    </div>

    <template v-else-if="merchantStat">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <p
            class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1"
          >
            ร้านค้าทั้งหมด
          </p>
          <h3 class="text-3xl font-black text-slate-800">
            {{ merchantStat.totalMerchants }}
            <span class="text-sm font-medium">แห่ง</span>
          </h3>
        </div>

        <div class="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <p
            class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1"
          >
            จำนวน SKU ทั้งหมด
          </p>
          <h3 class="text-3xl font-black text-slate-800">
            {{ merchantStat.inventory.totalSkus }}
            <span class="text-sm font-medium">รายการ</span>
          </h3>
        </div>

        <div
          class="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm border-b-4 border-b-indigo-500"
        >
          <p
            class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1"
          >
            สต็อกคงเหลือรวม
          </p>
          <h3 class="text-3xl font-black text-indigo-600">
            {{ merchantStat.inventory.totalStockRemaining.toLocaleString() }}
            <span class="text-sm font-medium text-slate-400">ชิ้น</span>
          </h3>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <h4
            class="font-black text-slate-800 mb-4 flex items-center gap-2 text-sm uppercase"
          >
            <span class="p-1.5 bg-rose-100 rounded-lg text-rose-600 text-xs"
              >⚠️</span
            >
            สินค้าสต็อกใกล้หมด
          </h4>
          <div
            v-if="merchantStat.inventory.lowStockItems.length === 0"
            class="py-10 text-center text-slate-400 text-sm italic"
          >
            ยังไม่มีสินค้าที่สต็อกใกล้หมด
          </div>
          <ul v-else class="space-y-3">
            <li
              v-for="item in merchantStat.inventory.lowStockItems"
              :key="item.name"
              class="flex justify-between items-center p-3 bg-slate-50 rounded-xl"
            >
              <span class="text-sm font-medium text-slate-700">{{
                item.name
              }}</span>
              <span class="text-xs font-black text-rose-500"
                >{{ item.stock }} ชิ้น</span
              >
            </li>
          </ul>
        </div>

        <div class="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <h4
            class="font-black text-slate-800 mb-4 flex items-center gap-2 text-sm uppercase"
          >
            <span class="p-1.5 bg-amber-100 rounded-lg text-amber-600 text-xs"
              >⭐</span
            >
            อันดับร้านค้าขายดี
          </h4>
          <div
            v-if="merchantStat.rankings.length === 0"
            class="py-10 text-center text-slate-400 text-sm italic"
          >
            ยังไม่มีข้อมูลอันดับยอดขาย
          </div>
          <div v-else class="space-y-3"></div>
        </div>
      </div>

      <div
        class="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden"
      >
        <div
          class="px-6 py-4 border-b border-slate-100 flex justify-between items-center"
        >
          <h4
            class="font-black text-slate-800 text-sm uppercase tracking-wider"
          >
            รายการขายย่อยล่าสุด (Sub Orders)
          </h4>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-left text-sm">
            <thead>
              <tr class="bg-slate-50/50">
                <th
                  class="px-6 py-4 text-[10px] font-black text-slate-400 uppercase"
                >
                  Sub Order ID / ร้านค้า
                </th>
                <th
                  class="px-6 py-4 text-[10px] font-black text-slate-400 uppercase text-center"
                >
                  สถานะ
                </th>
                <th
                  class="px-6 py-4 text-[10px] font-black text-slate-400 uppercase text-right"
                >
                  ยอดเงิน
                </th>
                <th
                  class="px-6 py-4 text-[10px] font-black text-slate-400 uppercase text-right"
                >
                  วันที่
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-50">
              <tr
                v-for="act in merchantStat.recentActivities"
                :key="act.subOrderId"
                class="hover:bg-slate-50/50"
              >
                <td class="px-6 py-4">
                  <p class="font-bold text-slate-800 text-xs">
                    {{ act.subOrderId.split("-")[0] }}...
                  </p>
                  <p
                    class="text-[10px] text-indigo-500 font-bold uppercase tracking-tight"
                  >
                    {{ act.merchant }}
                  </p>
                </td>
                <td class="px-6 py-4 text-center">
                  <span
                    :class="getStatusClass(act.status)"
                    class="px-2 py-0.5 rounded text-[10px] font-black"
                  >
                    {{ act.status }}
                  </span>
                </td>
                <td class="px-6 py-4 text-right font-black text-slate-700">
                  ฿{{ act.amount.toLocaleString() }}
                </td>
                <td
                  class="px-6 py-4 text-right text-[10px] text-slate-400 font-medium"
                >
                  {{ new Date(act.date).toLocaleDateString() }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </template>
  </div>
</template>
