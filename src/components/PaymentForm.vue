<template>
  <div class="max-w-6xl mx-auto space-y-6">
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
      <div class="flex items-center gap-4">
        <button 
          @click="$router.back()" 
          class="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-400 hover:text-slate-600"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        <div>
          <h1 class="text-xl font-black text-slate-800 leading-none">
            {{ isEdit ? 'Edit' : 'New' }} Payment Method
          </h1>
          <p class="text-[11px] font-bold text-slate-400 mt-1 uppercase tracking-wider">
            {{ isEdit ? `ID: ${paymentId}` : 'Configuration' }}
          </p>
        </div>
      </div>
      
      <div class="flex items-center gap-3">
        <button 
          @click="submitForm"
          class="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg shadow-indigo-100 flex items-center disabled:opacity-50"
          :disabled="paymentStore.loading"
        >
          <span v-if="paymentStore.loading" class="animate-spin mr-2">⏳</span>
          {{ isEdit ? 'Update Changes' : 'Create Method' }}
        </button>
      </div>
    </div>

    <div class="grid grid-cols-12 gap-6">
      <div class="col-span-12 lg:col-span-8 space-y-6">
        
        <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div class="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
            <h2 class="text-sm font-black text-slate-700 uppercase tracking-tighter">General Information</h2>
          </div>
          <div class="p-6 grid grid-cols-2 gap-6">
            <div class="col-span-2 md:col-span-1">
              <label class="block text-[11px] font-black text-slate-500 uppercase mb-2 ml-1">Display Label</label>
              <input 
                v-model="form.label" 
                type="text" 
                class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none text-sm font-medium"
                placeholder="e.g. Credit / Debit Card" 
              />
            </div>
            <div class="col-span-2 md:col-span-1">
              <label class="block text-[11px] font-black text-slate-500 uppercase mb-2 ml-1">System Method ID</label>
              <input 
                v-model="form.method" 
                type="text" 
                :disabled="isEdit"
                class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none text-sm font-mono disabled:bg-slate-100 disabled:text-slate-400"
                placeholder="e.g. credit_card" 
              />
            </div>
          </div>
        </div>

        <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div class="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
            <h2 class="text-sm font-black text-slate-700 uppercase tracking-tighter">Sub-Channels / Options</h2>
            <button 
              @click="addChild" 
              type="button" 
              class="text-[11px] font-black bg-indigo-50 text-indigo-600 px-3 py-1.5 rounded-lg hover:bg-indigo-100 transition-colors"
            >
              + ADD OPTION
            </button>
          </div>
          <div class="p-6">
            <div v-if="form.children.length === 0" class="text-center py-10 border-2 border-dashed border-slate-100 rounded-2xl">
              <p class="text-xs font-bold text-slate-400 uppercase tracking-widest">No Sub-channels added yet</p>
            </div>
            
            <div class="space-y-3">
              <div 
                v-for="(child, index) in form.children" 
                :key="index" 
                class="flex items-center gap-4 p-4 bg-slate-50/50 border border-slate-100 rounded-2xl group hover:border-indigo-200 hover:bg-white transition-all"
              >
                <div class="flex-1 grid grid-cols-2 gap-4">
                  <input 
                    v-model="child.label" 
                    placeholder="Bank/Provider Name" 
                    class="bg-transparent border-b border-slate-200 focus:border-indigo-500 px-1 py-2 text-sm font-bold outline-none transition-all"
                  />
                  <input 
                    v-model="child.method" 
                    placeholder="Option ID" 
                    class="bg-transparent border-b border-slate-200 focus:border-indigo-500 px-1 py-2 text-sm font-mono outline-none transition-all"
                  />
                </div>
                <button 
                  @click="removeChild(index)" 
                  class="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-span-12 lg:col-span-4 space-y-6">
        <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div class="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
            <h2 class="text-sm font-black text-slate-700 uppercase tracking-tighter">Method Icon</h2>
          </div>
          <div class="p-8">
            <div 
              class="relative aspect-square w-full max-w-[200px] mx-auto border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center group hover:border-indigo-400 transition-all cursor-pointer bg-slate-50/30 overflow-hidden"
            >
              <img v-if="form.icon?.url" :src="form.icon.url" class="w-full h-full object-contain p-4 transition-transform group-hover:scale-110" />
              <div v-else class="text-center">
                <div class="bg-white p-4 rounded-2xl shadow-sm mb-3 text-slate-300 group-hover:text-indigo-500 transition-colors">
                  <svg class="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Upload Icon</span>
              </div>
            </div>
            <p class="text-[10px] text-slate-400 mt-4 text-center italic font-medium leading-relaxed">
              * Support: SVG, PNG (Transparent)<br/>Recommended size: 512x512 px
            </p>
          </div>
        </div>

        <div class="bg-indigo-600 rounded-2xl p-6 text-white shadow-xl shadow-indigo-200">
          <h3 class="text-sm font-black uppercase tracking-widest mb-2 text-indigo-100">Pro Tip</h3>
          <p class="text-xs font-medium leading-relaxed opacity-90">
            ระบบจะแสดงผลเรียงตาม "Sort Order" ที่ตั้งไว้ในระบบจัดการภาพรวม หากต้องการเปลี่ยนลำดับ ให้ไปที่หน้ารายการหลัก
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { usePaymentStore } from '@/stores/paymentStore'; // 1. Import Store
import type { ICreatePaymentChild } from '@/interface/paymentInterface';


const route = useRoute();
const router = useRouter();


// 2. เรียกใช้งาน Store
const paymentStore = usePaymentStore();

const paymentId = computed(() => route.params.id as string);
const isEdit = computed(() => !!paymentId.value);
console.log(isEdit.value);
console.log(paymentId.value);

const form = reactive({
  label: '',
  method: '',
  icon: null as any, 
  children: [] as ICreatePaymentChild[]
});

onMounted(async () => {
  if (isEdit.value) {
    const data = await paymentStore.fetchPaymentById(paymentId.value);
    if (data) {
      form.label = data.label;
      form.method = data.method;
      form.icon = data.icon ? { url: data.icon.url, path: data.icon.path } : null;
      // Map paymentChilds จาก DB เข้าสู่ children ใน Form
      form.children = data.paymentChilds.map(child => ({
        label: child.label,
        method: child.method,
        sortOrder: child.sortOrder
      }));
    }
  }
});

const addChild = () => form.children.push({ label: '', method: '', sortOrder: form.children.length });
const removeChild = (index: number) => form.children.splice(index, 1);

const submitForm = async () => {
  try {
    if (isEdit.value) {
      // เรียกใช้ action update (ต้องเพิ่มใน store)
      await paymentStore.updatePayment(paymentId.value, form);
      alert('Updated successfully');
    } else {
      await paymentStore.createPayment(form);
      alert('Created successfully');
    }
    router.push('/payments'); // กลับหน้าหลัก
  } catch (error: any) {
    alert(error.message || 'Something went wrong');
  }
};
</script>