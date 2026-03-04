<template>
  <div class="space-y-6">
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-black text-slate-800 tracking-tight">Shipping Methods</h1>
        <p class="text-sm text-slate-500 font-medium">จัดการตัวเลือกการจัดส่ง ราคา และเงื่อนไขโปรโมชั่นส่งฟรี</p>
      </div>
      
      <router-link 
        to="/shippings/add"
        class="inline-flex items-center justify-center px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-indigo-100 group"
      >
        <svg class="w-5 h-5 mr-2 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
        </svg>
        Add Shipping Method
      </router-link>
    </div>

    <div class="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
      
      <table class="w-full text-left border-collapse">
        <thead class="bg-slate-50/50 border-b border-slate-100">
          <tr>
            <th class="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-[0.15em] w-20">Order</th>
            <th class="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-[0.15em]">Provider & Service</th>
            <th class="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-[0.15em]">Pricing (฿)</th>
            <th class="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-[0.15em]">Free Condition</th>
            <th class="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-[0.15em]">Status</th>
            <th class="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-[0.15em] text-right">Actions</th>
          </tr>
        </thead>

        <tbody class="divide-y divide-slate-100">
          <tr v-for="item of shippings" :key="item.id" class="hover:bg-slate-50/30 transition-colors group">
            <td class="px-6 py-5">
              <span class="text-xs font-mono font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded">
                #{{ item.sortOrder }}
              </span>
            </td>

            <td class="px-6 py-5">
              <div class="flex items-center space-x-4">
                <div class="h-12 w-12 flex-shrink-0 rounded-xl border border-slate-100 bg-white p-2 shadow-sm flex items-center justify-center overflow-hidden">
                  <img v-if="item.image?.url" :src="item.image.url" class="h-full w-full object-contain" />
                  <span v-else class="text-[10px] font-bold text-slate-300">LOGO</span>
                </div>
                <div>
                  <p class="text-sm font-black text-slate-700 leading-tight mb-0.5">{{ item.name }}</p>
                  <div class="flex items-center gap-2">
                    <span class="text-[10px] font-bold text-indigo-500 uppercase tracking-tighter">{{ item.provider }}</span>
                    <span class="text-[10px] text-slate-400">•</span>
                    <span class="text-[10px] text-slate-400 font-medium italic">{{ item.estimatedDays }}</span>
                  </div>
                </div>
              </div>
            </td>

            <td class="px-6 py-5">
              <div class="flex flex-col">
                <span class="text-sm font-bold text-slate-700">฿{{ item.price.toLocaleString() }}</span>
                <span class="text-[10px] text-slate-400 font-medium">Min. ฿{{ item.minOrderAmount }}</span>
              </div>
            </td>

            <td class="px-6 py-5">
              <div v-if="item.freeShippingThreshold" class="inline-flex items-center bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-100">
                <span class="text-[10px] font-black text-emerald-600 uppercase">Free at ฿{{ item.freeShippingThreshold }}</span>
              </div>
              <span v-else class="text-[10px] text-slate-300 font-medium italic">No free option</span>
            </td>

            <td class="px-6 py-5">
              <button 
                @click="$emit('toggle', item)"
                :class="[
                  'inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black transition-all border shadow-sm',
                  item.isActive ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-50 text-slate-400 border-slate-200'
                ]"
              >
                <span class="w-1.5 h-1.5 rounded-full mr-2" :class="item.isActive ? 'bg-emerald-500' : 'bg-slate-300'"></span>
                {{ item.isActive ? 'ON SERVICE' : 'PAUSED' }}
              </button>
            </td>

            <td class="px-6 py-5 text-right">
              <div class="flex justify-end items-center space-x-2 opacity-0 group-hover:opacity-100 transition-all duration-200">
                <router-link 
                  :to="`/shippings/edit/${item.id}`"
                  class="p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all border border-transparent hover:border-indigo-100"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </router-link>
                
                <button 
                  @click="$emit('delete', item.id)"
                  class="p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all border border-transparent hover:border-red-100"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { IShipping } from '@/interface/shippingInterface';

defineProps<
  {
    shippings: IShipping[]
  }
>()

defineEmits(['delete', 'toggle'])


</script>