<script setup lang="ts">
import { computed } from "vue";
import { useStatStore } from "../stores/statStore";
import { storeToRefs } from "pinia";

const statStore = useStatStore();
const { orderStat, loading, error } = storeToRefs(statStore);

// Helper สำหรับจัดการสี Status ของ Invoice
const getInvoiceStatusStyle = (status: string) => {
  switch (status) {
    case "PAID":
      return "bg-emerald-100 text-emerald-700 border-emerald-200";
    case "UNPAID":
      return "bg-rose-100 text-rose-700 border-rose-200";
    default:
      return "bg-slate-100 text-slate-600 border-slate-200";
  }
};

// ฟังก์ชันแปลงรูปแบบวันที่
const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleString("th-TH");
};
</script>

<template>
  <div class="space-y-6">
    <div
      v-if="loading"
      class="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-slate-100 shadow-sm"
    >
      <div
        class="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"
      ></div>
      <p class="text-slate-400 font-medium tracking-wide">
        กำลังวิเคราะห์ข้อมูลออเดอร์...
      </p>
    </div>

    <div
      v-else-if="error"
      class="p-6 bg-rose-50 border border-rose-100 rounded-2xl text-rose-600 flex items-center gap-3"
    >
      <span class="text-2xl">⚠️</span>
      <p class="font-bold">เกิดข้อผิดพลาด: {{ error }}</p>
    </div>

    <template v-else-if="orderStat">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div
          class="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden group"
        >
          <div class="relative z-10">
            <p
              class="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-2"
            >
              ยอดขายรวมทั้งหมด
            </p>
            <h2 class="text-4xl font-black text-slate-800">
              ฿{{ orderStat.totalSales.toLocaleString() }}
            </h2>
            <div
              class="mt-4 inline-flex items-center text-[10px] font-bold px-2 py-1 bg-emerald-50 text-emerald-600 rounded-md"
            >
              ↑ +12.5% จากเดือนที่แล้ว
            </div>
          </div>
          <div
            class="absolute -right-4 -bottom-4 text-8-xl opacity-[0.03] group-hover:scale-110 transition-transform"
          >
            💰
          </div>
        </div>

        <div
          class="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden group"
        >
          <div class="relative z-10">
            <p
              class="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-2"
            >
              จำนวนออเดอร์ทั้งหมด
            </p>
            <h2 class="text-4xl font-black text-slate-800">
              {{ orderStat.totalOrders.toLocaleString() }}
              <span class="text-lg font-bold text-slate-400">รายการ</span>
            </h2>
          </div>
          <div
            class="absolute -right-4 -bottom-4 text-8-xl opacity-[0.03] group-hover:scale-110 transition-transform"
          >
            📦
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div class="space-y-6">
          <div
            class="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm"
          >
            <h3
              class="font-black text-slate-800 mb-6 text-sm uppercase tracking-wider flex items-center gap-2"
            >
              <span class="w-2 h-2 bg-indigo-500 rounded-full"></span>
              สถานะการเรียกเก็บเงิน
            </h3>
            <div class="space-y-3">
              <div
                v-for="invoice in orderStat.invoices"
                :key="invoice.status"
                class="flex items-center justify-between p-4 rounded-2xl border transition-all hover:bg-slate-50"
                :class="getInvoiceStatusStyle(invoice.status)"
              >
                <div>
                  <p class="text-[10px] font-black uppercase opacity-70">
                    {{ invoice.status }}
                  </p>
                  <p class="text-lg font-black leading-tight">
                    ฿{{ invoice.amount.toLocaleString() }}
                  </p>
                </div>
                <div class="text-right">
                  <p class="text-xs font-bold">{{ invoice.count }} รายการ</p>
                </div>
              </div>
            </div>
          </div>

          <div
            class="bg-slate-900 p-6 rounded-3xl text-white shadow-xl shadow-slate-200"
          >
            <p class="text-xs font-bold text-slate-400 mb-2 italic">
              Data Integrity
            </p>
            <p class="text-sm opacity-80 mb-4">อัปเดตข้อมูลล่าสุดเมื่อ:</p>
            <p
              class="text-xs font-mono bg-slate-800 p-2 rounded-lg text-indigo-300"
            >
              {{ formatDate(orderStat.updatedAt) }}
            </p>
          </div>
        </div>

        <div
          class="lg:col-span-2 bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden text-sm"
        >
          <div
            class="px-6 py-5 border-b border-slate-100 flex justify-between items-center"
          >
            <h3
              class="font-black text-slate-800 uppercase tracking-wider text-sm"
            >
              กิจกรรมการรับชำระล่าสุด
            </h3>
            <span
              class="px-3 py-1 bg-slate-100 text-slate-500 text-[10px] font-bold rounded-full"
              >Real-time</span
            >
          </div>
          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="bg-slate-50/50">
                  <th
                    class="px-6 py-4 text-[10px] font-black text-slate-400 uppercase"
                  >
                    เลขที่ใบเสร็จ / ผู้รับ
                  </th>
                  <th
                    class="px-6 py-4 text-[10px] font-black text-slate-400 uppercase text-center"
                  >
                    ช่องทาง
                  </th>
                  <th
                    class="px-6 py-4 text-[10px] font-black text-slate-400 uppercase text-right"
                  >
                    จำนวนเงิน
                  </th>
                  <th
                    class="px-6 py-4 text-[10px] font-black text-slate-400 uppercase text-right"
                  >
                    เวลาที่ชำระ
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-50">
                <tr
                  v-for="activity in orderStat.recentActivities"
                  :key="activity.receiptNumber"
                  class="hover:bg-slate-50/80 transition-colors"
                >
                  <td class="px-6 py-4">
                    <p class="font-bold text-slate-800 truncate w-48">
                      {{ activity.receiptNumber }}
                    </p>
                    <p class="text-[10px] text-slate-400 font-medium">
                      Customer: {{ activity.order.receiverName }}
                    </p>
                  </td>
                  <td class="px-6 py-4 text-center">
                    <span
                      class="px-2 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-bold rounded-md"
                    >
                      {{
                        activity.paymentMethod.replace("_", " ").toUpperCase()
                      }}
                    </span>
                  </td>
                  <td class="px-6 py-4 text-right">
                    <p class="font-black text-slate-800">
                      ฿{{ activity.amount.toLocaleString() }}
                    </p>
                  </td>
                  <td
                    class="px-6 py-4 text-right text-[11px] text-slate-400 font-medium"
                  >
                    {{ formatDate(activity.paidAt) }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div
            v-if="orderStat.recentActivities.length === 0"
            class="p-10 text-center text-slate-400 italic"
          >
            ไม่มีกิจกรรมล่าสุดในขณะนี้
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
