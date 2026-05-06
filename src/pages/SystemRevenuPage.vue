<script setup lang="ts">
import { ref, onMounted, computed, watch } from "vue";
import { useRevenueSystemStore } from "../stores/revenueSystemStore";
import Swal from "sweetalert2";

const store = useRevenueSystemStore();
const localFee = ref(0);
const isUpdating = ref(false);

// 1. ดึงข้อมูลทั้งหมดเมื่อโหลดหน้า (Settings + Logs)
onMounted(async () => {
  await store.syncRevenueData();
  // ถ้าหลังจาก sync แล้วมีค่า settings ให้เซ็ตลง localFee
  if (store.settings) {
    localFee.value = store.settings.feePercentage;
  }
});

// 2. Watch เพื่อคอยซิงค์ค่าจาก Store ลง Input (กรณีมีการ Sync ข้อมูลใหม่จากที่อื่น)
watch(
  () => store.settings?.feePercentage,
  (newVal) => {
    if (newVal !== undefined) {
      localFee.value = newVal;
    }
  },
  { immediate: true },
);

// 3. Simulation การคำนวณ (ใช้ 1,000 เป็นยอดตั้งต้น)
const calculatedFee = computed(() => {
  const fee = (1000 * (localFee.value / 100)).toFixed(2);
  return fee;
});

// 4. ฟังก์ชันสำหรับการอัปเดตค่า GP
const handleUpdate = async () => {
  // ป้องกันการกรอกค่าที่ติดลบหรือไม่เหมาะสม
  if (localFee.value < 0 || localFee.value > 100) {
    Swal.fire("Warning", "กรุณาระบุค่าธรรมเนียมระหว่าง 0 - 100%", "warning");
    return;
  }

  isUpdating.value = true;
  try {
    // เรียกใช้ Action ใหม่ที่ส่ง PATCH ไปยัง Endpoint /setting/revenue
    await store.updateFeePercentage(localFee.value, store.settings?.id);

    Swal.fire({
      icon: "success",
      title: "Updated!",
      text: "ระบบได้ทำการบันทึกค่าธรรมเนียมใหม่แล้ว",
      timer: 1500,
      showConfirmButton: false,
    });
  } catch (error) {
    console.error("Update error:", error);
    Swal.fire({
      icon: "error",
      title: "Update Failed",
      text: "ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้",
    });
  } finally {
    isUpdating.value = false;
  }
};
</script>

<template>
  <div class="p-6 max-w-4xl mx-auto">
    <header class="mb-8">
      <h1 class="text-2xl font-bold text-slate-800">System Revenue Settings</h1>
      <p class="text-slate-500">
        จัดการค่าธรรมเนียมระบบและสัดส่วนรายได้ของแพลตฟอร์ม
      </p>
    </header>

    <div
      v-if="store.loading && !store.isSync"
      class="flex justify-center py-10"
    >
      <div class="text-center">
        <div
          class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"
        ></div>
        <span class="text-slate-400">Loading system data...</span>
      </div>
    </div>

    <div v-else class="grid gap-6">
      <div
        class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden"
      >
        <div class="p-6 border-b border-slate-100 bg-slate-50/50">
          <h2 class="font-semibold text-slate-700 flex items-center">
            <span class="mr-2">📈</span> Platform Commission (GP)
          </h2>
        </div>

        <div class="p-6 space-y-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="font-medium text-slate-800">Global Service Fee</p>
              <p class="text-sm text-slate-500">
                ค่าธรรมเนียมเริ่มต้นที่จะหักจากทุก Sub-Order ของร้านค้า
              </p>
            </div>
            <div class="flex items-center space-x-3">
              <div class="relative">
                <input
                  v-model.number="localFee"
                  type="number"
                  step="0.1"
                  min="0"
                  max="100"
                  class="w-24 pl-4 pr-8 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-right font-semibold"
                />
                <span class="absolute right-3 top-2 text-slate-400">%</span>
              </div>
              <button
                @click="handleUpdate"
                :disabled="isUpdating"
                class="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium min-w-[80px]"
              >
                {{ isUpdating ? "Saving..." : "Update" }}
              </button>
            </div>
          </div>

          <hr class="border-slate-100" />

          <div class="bg-blue-50 p-4 rounded-lg border border-blue-100">
            <p class="text-sm text-blue-800 font-semibold mb-2">
              💡 ตัวอย่างการคำนวณรายได้ (Revenue Simulation)
            </p>
            <div class="text-xs text-blue-700 space-y-1">
              <div class="flex justify-between">
                <span>ยอดขายของร้านค้า:</span>
                <span>1,000.00 THB</span>
              </div>
              <div class="flex justify-between">
                <span>หักค่าธรรมเนียมระบบ ({{ localFee || 0 }}%):</span>
                <span>- {{ calculatedFee }} THB</span>
              </div>
              <div
                class="flex justify-between font-bold border-t border-blue-200 pt-1 mt-1"
              >
                <span>เงินโอนให้ร้านค้าสุทธิ:</span>
                <span>{{ (1000 - Number(calculatedFee)).toFixed(2) }} THB</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        class="bg-white rounded-xl border border-slate-200 shadow-sm p-6 opacity-60"
      >
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <span class="text-2xl">🏦</span>
            <div>
              <p class="font-medium text-slate-800 italic">
                Withdrawal Fee (Coming Soon)
              </p>
              <p class="text-sm text-slate-500">
                ค่าธรรมเนียมการถอนเงินจาก Wallet ของร้านค้า
              </p>
            </div>
          </div>
          <div class="bg-slate-100 px-3 py-1 rounded text-xs text-slate-400">
            Locked
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
