<script setup lang="ts">
import { ref, computed } from 'vue'
import { useUserStore } from '../stores/userStore'

const userStore = useUserStore()
const user = computed(() => userStore.user)

// สถานะการสลับโหมดภายใน Component
const isEditing = ref(false)
const isSubmitting = ref(false)

// ข้อมูลสำหรับแก้ไข
const formData = ref({
  displayName: user.value?.displayName || '',
  email: user.value?.email || '',
  phoneNumber: user.value?.phoneNumber || ''
})

// ฟังก์ชันสลับโหมด
const toggleEdit = () => {
  if (isEditing.value) {
    // ถ้ากดยกเลิก ให้คืนค่าเดิมจาก Store (กรณีไม่ได้กดบันทึก)
    formData.value.displayName = user.value?.displayName || ''
    formData.value.phoneNumber = '' 
  }
  isEditing.value = !isEditing.value
}

const handleSave = async () => {
  isSubmitting.value = true
  try {
    // จำลองการเรียก API
    await new Promise(resolve => setTimeout(resolve, 1000))
    // เมื่อสำเร็จให้ปิดโหมดแก้ไข
    isEditing.value = false
    alert('บันทึกข้อมูลใหม่เรียบร้อยแล้ว')
  } catch (error) {
    console.error(error)
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="max-w-3xl mx-auto p-4 sm:p-6 font-sans">
    <div class="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      
      <div class="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div class="flex items-center space-x-4">
          <div class="h-14 w-14 rounded-2xl bg-indigo-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-indigo-100">
            <img v-if="user?.image?.url" :src="user.image.url" class="h-full w-full object-cover">
            <span v-else>{{ formData.displayName.charAt(0) }}</span>
          </div>
          <div>
            <h2 class="text-xl font-bold text-slate-800">ข้อมูลบัญชี</h2>
            <p class="text-sm text-slate-500">จัดการข้อมูลส่วนตัวของคุณ</p>
          </div>
        </div>

        <button 
          v-if="!isEditing"
          @click="isEditing = true"
          class="flex items-center justify-center px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:border-indigo-300 hover:text-indigo-600 transition-all shadow-sm"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          แก้ไขโปรไฟล์
        </button>
      </div>

      <form @submit.prevent="handleSave" class="p-6 space-y-8">
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-4 items-start">
          <label class="text-sm font-bold text-slate-500 uppercase tracking-tight pt-2">ชื่อผู้ใช้งาน</label>
          <div class="md:col-span-2">
            <input 
              v-if="isEditing"
              v-model="formData.displayName"
              type="text"
              placeholder="081-034-5543" 
              class="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 outline-none transition-all text-slate-700"
            >
            <div v-else class="text-lg font-medium text-slate-800 py-1.5 border-b border-transparent">
              {{ formData.displayName }}
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-4 items-start">
          <label class="text-sm font-bold text-slate-500 uppercase tracking-tight pt-2">อีเมลติดต่อ</label>
          <div class="md:col-span-2 flex items-center">
            <div class="text-lg font-medium text-slate-800 py-1.5 flex items-center">
              {{ formData.email }}
              <span class="ml-3 px-2 py-0.5 bg-slate-100 text-slate-400 text-[10px] rounded uppercase font-bold tracking-tighter border border-slate-200">
                Locked
              </span>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-4 items-start">
          <label class="text-sm font-bold text-slate-500 uppercase tracking-tight pt-2">เบอร์โทรศัพท์</label>
          <div class="md:col-span-2">
            <input 
              v-if="isEditing"
              v-model="formData.phoneNumber"
              type="text" 
              class="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 outline-none transition-all text-slate-700"
            >
            <div v-else class="text-lg font-medium text-slate-800 py-1.5">
              {{ formData.phoneNumber }}
            </div>
          </div>
        </div>

        <transition
          enter-active-class="transition duration-200 ease-out"
          enter-from-class="opacity-0 translate-y-2"
          enter-to-class="opacity-100 translate-y-0"
        >
          <div v-if="isEditing" class="pt-6 border-t border-slate-100 flex justify-end items-center space-x-4">
            <button 
              type="button" 
              @click="toggleEdit"
              class="text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors"
            >
              ยกเลิก
            </button>
            <button 
              type="submit" 
              :disabled="isSubmitting"
              class="px-10 py-3 bg-slate-900 hover:bg-black text-white text-sm font-bold rounded-xl shadow-lg shadow-slate-200 transition-all active:scale-95 disabled:opacity-50 flex items-center"
            >
              <svg v-if="isSubmitting" class="animate-spin -ml-1 mr-3 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              {{ isSubmitting ? 'กำลังบันทึก...' : 'บันทึกข้อมูล' }}
            </button>
          </div>
        </transition>

      </form>
    </div>
  </div>
</template>