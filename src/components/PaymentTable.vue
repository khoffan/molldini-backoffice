<template>
  <div class="space-y-6">
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-black text-slate-800 tracking-tight">Payment Methods</h1>
        <p class="text-sm text-slate-500 font-medium">จัดการช่องทางการชำระเงินและตัวเลือกย่อยทั้งหมดในระบบ</p>
      </div>
      
      <router-link 
        to="/payments/add"
        class="inline-flex items-center justify-center px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-indigo-100 group"
      >
        <svg class="w-5 h-5 mr-2 transition-transform group-hover:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Add New Method
      </router-link>
    </div>

    <div class="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
      <table class="w-full text-left border-collapse">
        <thead class="bg-slate-50/50 border-b border-slate-100">
          <tr>
            <th class="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-[0.15em] w-24">Order</th>
            <th class="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-[0.15em]">Method Information</th>
            <th class="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-[0.15em]">Status</th>
            <th class="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-[0.15em]">Sub-Channels</th>
            <th class="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-[0.15em] text-right">Actions</th>
          </tr>
        </thead>

        <tbody class="divide-y divide-slate-100">
          <tr v-for="item in payments" :key="item.id" class="hover:bg-slate-50/30 transition-colors group">
            <td class="px-6 py-5">
              <span class="text-xs font-mono font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">
                #{{ item.sortOrder || 0 }}
              </span>
            </td>

            <td class="px-6 py-5">
              <div class="flex items-center space-x-4">
                <div class="h-12 w-12 flex-shrink-0 rounded-xl border border-slate-100 bg-white p-2 shadow-sm flex items-center justify-center">
                  <img v-if="item.icon?.url" :src="item.icon.url" class="h-full w-full object-contain" />
                  <svg v-else class="w-6 h-6 text-slate-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p class="text-sm font-black text-slate-700 leading-tight mb-1">{{ item.label }}</p>
                  <p class="text-[10px] text-slate-400 font-bold font-mono tracking-tight bg-slate-50 px-1.5 py-0.5 rounded inline-block uppercase border border-slate-100">
                    {{ item.method }}
                  </p>
                </div>
              </div>
            </td>

            <td class="px-6 py-5">
              <button 
                @click="$emit('toggle', item.id, item.isActive)"
                :class="[
                  'inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black transition-all shadow-sm border',
                  item.isActive ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-50 text-slate-400 border-slate-200'
                ]"
              >
                <span class="w-1.5 h-1.5 rounded-full mr-2 animate-pulse" :class="item.isActive ? 'bg-emerald-500' : 'bg-slate-300'"></span>
                {{ item.isActive ? 'ACTIVE' : 'DISABLED' }}
              </button>
            </td>

            <td class="px-6 py-5">
              <div class="flex flex-wrap gap-2 max-w-[240px]">
                <span 
                  v-for="child in item.paymentChilds" 
                  :key="child.id"
                  class="text-[9px] font-black bg-indigo-50 text-indigo-500 px-2.5 py-1 rounded-lg border border-indigo-100/50 uppercase tracking-tighter"
                >
                  {{ child.label }}
                </span>
                <span v-if="!item.paymentChilds?.length" class="text-[10px] text-slate-300 font-medium italic">No sub-options</span>
              </div>
            </td>

            <td class="px-6 py-5 text-right">
              <div class="flex justify-end items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <router-link 
                  :to="`/payments/edit/${item.id}`"
                  class="p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all border border-transparent hover:border-indigo-100 shadow-sm hover:shadow-md"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </router-link>
                
                <button 
                  @click="$emit('delete', item.id)"
                  class="p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all border border-transparent hover:border-red-100 shadow-sm hover:shadow-md"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </td>
          </tr>

          <tr v-if="payments.length === 0">
            <td colspan="5" class="px-6 py-20 text-center text-slate-400 font-medium">
              ไม่พบข้อมูลช่องทางชำระเงิน <br/>
              <router-link to="/payments/add" class="text-indigo-500 hover:underline mt-2 inline-block">สร้างช่องทางแรกของคุณ</router-link>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { IPayment } from '@/interface/paymentInterface';

defineProps<{
  payments: IPayment[]
}>();

defineEmits(['delete', 'toggle']);
</script>