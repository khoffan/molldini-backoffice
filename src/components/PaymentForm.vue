<template>
  <div class="max-w-6xl mx-auto space-y-6 pb-20">
    <div
      class="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm"
    >
      <div class="flex items-center gap-4">
        <button
          @click="$router.back()"
          class="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-400"
        >
          <svg
            class="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
        </button>
        <div>
          <h1 class="text-xl font-black text-slate-800 leading-none">
            {{ isEdit ? "แก้ไข" : "เพิ่ม" }} ช่องทางชำระเงิน
          </h1>
          <p
            class="text-[11px] font-bold text-slate-400 mt-1 uppercase tracking-wider"
          >
            {{ isEdit ? `ID: ${paymentId}` : "Omise Configuration" }}
          </p>
        </div>
      </div>

      <button
        @click="submitForm"
        :disabled="paymentStore.loading"
        class="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg shadow-indigo-100 disabled:opacity-50"
      >
        {{
          paymentStore.loading
            ? "กำลังบันทึก..."
            : isEdit
              ? "บันทึกการเปลี่ยนแปลง"
              : "สร้างช่องทาง"
        }}
      </button>
    </div>

    <div class="grid grid-cols-12 gap-6">
      <div class="col-span-12 lg:col-span-8 space-y-6">
        <div
          class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
        >
          <div class="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
            <h2 class="text-sm font-black text-slate-700 uppercase">
              ข้อมูลทั่วไป
            </h2>
          </div>
          <div class="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                class="block text-[11px] font-black text-slate-500 uppercase mb-2 ml-1"
                >ประเภทการชำระ (Omise Method)</label
              >
              <select
                v-model="form.method"
                @change="handleMethodChange"
                :disabled="isEdit"
                class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-500/10 outline-none text-sm font-bold disabled:bg-slate-100 appearance-none"
              >
                <option value="" disabled>เลือกประเภท...</option>
                <option
                  v-for="m in OMISE_METHODS"
                  :key="m.value"
                  :value="m.value"
                >
                  {{ m.label }}
                </option>
              </select>
            </div>
            <div>
              <label
                class="block text-[11px] font-black text-slate-500 uppercase mb-2 ml-1"
                >ชื่อที่แสดงหน้าเว็บ (Label)</label
              >
              <input
                v-model="form.label"
                type="text"
                placeholder="เช่น โมบายแบงก์กิ้ง"
                class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-500/10 outline-none text-sm font-medium"
              />
            </div>
          </div>
        </div>

        <div
          v-if="form.method === 'credit_card'"
          class="bg-indigo-50/50 border-2 border-dashed border-indigo-200 rounded-2xl p-10 text-center"
        >
          <div
            class="bg-white w-12 h-12 rounded-xl shadow-sm flex items-center justify-center mx-auto mb-3"
          >
            <svg
              class="w-6 h-6 text-indigo-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
              />
            </svg>
          </div>
          <h4 class="text-indigo-900 font-black text-sm uppercase">
            Credit Card Mode
          </h4>
          <p class="text-indigo-600/70 text-xs mt-2 font-medium">
            ระบบจะใช้แบบฟอร์มมาตรฐานของ Omise ในการรับชำระผ่านบัตร
          </p>
        </div>

        <div
          v-else-if="form.method"
          class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
        >
          <div
            class="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center"
          >
            <h2 class="text-sm font-black text-slate-700 uppercase">
              ช่องทางย่อย / ธนาคาร
            </h2>
            <div class="flex gap-2">
              <button
                v-if="form.method === 'mobile_banking'"
                @click="syncOmiseBanks"
                type="button"
                class="text-[10px] font-black bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-lg border border-emerald-100 hover:bg-emerald-100 transition-colors"
              >
                🔄 SYNC OMISE BANKS
              </button>
              <button
                @click="addChild"
                type="button"
                class="text-[10px] font-black bg-indigo-50 text-indigo-600 px-3 py-1.5 rounded-lg hover:bg-indigo-100 transition-colors"
              >
                + เพิ่มแถว
              </button>
            </div>
          </div>
          <div class="p-6 space-y-3">
            <div
              v-if="form.children.length === 0"
              class="text-center py-8 border-2 border-dashed border-slate-100 rounded-2xl text-slate-400 text-xs font-bold uppercase"
            >
              ไม่มีข้อมูลช่องทางย่อย
            </div>

            <div
              v-for="(child, index) in form.children"
              :key="index"
              class="flex items-center gap-4 p-4 bg-slate-50/40 border border-slate-100 rounded-2xl hover:border-indigo-200 hover:bg-white transition-all group shadow-sm shadow-transparent hover:shadow-indigo-50"
            >
              <div class="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="space-y-1">
                  <span
                    class="text-[9px] font-black text-slate-400 uppercase ml-1"
                    >Display Label</span
                  >
                  <input
                    v-model="child.label"
                    placeholder="เช่น ธนาคารกสิกรไทย"
                    class="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm font-bold outline-none focus:border-indigo-500 transition-all"
                  />
                </div>
                <div class="space-y-1">
                  <span
                    class="text-[9px] font-black text-slate-400 uppercase ml-1"
                    >Omise Source ID</span
                  >
                  <input
                    v-model="child.method"
                    placeholder="เช่น mobile_banking_kbank"
                    class="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm font-mono outline-none focus:border-indigo-500 transition-all"
                  />
                </div>
              </div>
              <div class="pt-5">
                <button
                  @click="removeChild(index)"
                  class="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                >
                  <svg
                    class="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-span-12 lg:col-span-4 space-y-6">
        <div
          class="bg-white rounded-2xl border border-slate-200 p-8 text-center shadow-sm"
        >
          <span
            class="block text-[11px] font-black text-slate-400 uppercase mb-4 tracking-widest"
            >Method Icon</span
          >
          <div
            class="w-32 h-32 mx-auto bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-300 group hover:border-indigo-300 transition-colors cursor-pointer"
          >
            <svg
              class="w-8 h-8 mb-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span class="text-[9px] font-black uppercase">Upload</span>
          </div>
          <p class="mt-4 text-[10px] text-slate-400 italic">
            รองรับไฟล์ SVG หรือ PNG โปร่งใส
          </p>
        </div>

        <div
          class="bg-indigo-600 rounded-2xl p-6 text-white shadow-xl shadow-indigo-100"
        >
          <div class="flex items-center gap-3 mb-3">
            <div class="p-2 bg-white/20 rounded-lg">
              <svg
                class="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 class="text-xs font-black uppercase tracking-wider">Pro Tip</h3>
          </div>
          <p class="text-[11px] leading-relaxed opacity-80">
            สำหรับการตั้งค่า <strong>Mobile Banking</strong> คุณต้องระบุ Source
            ID ให้ตรงตามที่ Omise กำหนด (เช่น <code>mobile_banking_scb</code>)
            เพื่อให้ระบบสามารถเรียกใช้งาน App ธนาคารในมือถือลูกค้าได้โดยตรง
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { usePaymentStore } from "@/stores/paymentStore";
import { useAlert } from "@/utils/swal";
import type {
  ICreatePaymentBody,
  ICreatePaymentChild,
} from "@/interface/paymentInterface";

const route = useRoute();
const router = useRouter();
const paymentStore = usePaymentStore();

const paymentId = computed(() => route.params.id as string);
const isEdit = computed(() => !!paymentId.value);

// เก็บข้อมูลตามโครงสร้างเดิมของคุณเป๊ะๆ
const form: ICreatePaymentBody = reactive({
  label: "",
  method: "",
  icon: undefined,
  children: [] as ICreatePaymentChild[],
});

// ข้อมูลจริงจาก Omise Document
const OMISE_METHODS = [
  { label: "บัตรเครดิต / เดบิต", value: "credit_card", isCard: true },
  { label: "พร้อมเพย์ (PromptPay)", value: "promptpay", isCard: false },
  {
    label: "โมบายแบงก์กิ้ง (Mobile Banking)",
    value: "mobile_banking",
    isCard: false,
  },
  { label: "แรบบิท ไลน์เพย์", value: "rabbit_linepay", isCard: false },
  // แยก TrueMoney ออกเป็น 2 หัวข้อหลักตามวิธีการชำระเงิน
  {
    label: "ทรูมันนี่ จัมป์แอป (TrueMoney JumpApp)",
    value: "truemoney_jumpapp",
    isCard: false,
  },
  {
    label: "ทรูมันนี่ คิวอาร์ (TrueMoney QR)",
    value: "truemoney_qr",
    isCard: false,
  },
  { label: "ShopeePay", value: "shopeepay", isCard: false },
];

const MOBILE_BANKS = [
  { label: "ธนาคารกสิกรไทย (K PLUS)", method: "mobile_banking_kbank" },
  { label: "ธนาคารไทยพาณิชย์ (SCB Easy)", method: "mobile_banking_scb" },
  { label: "ธนาคารกรุงเทพ (Bualuang mBanking)", method: "mobile_banking_bbl" },
  { label: "ธนาคารกรุงไทย (KTB NEXT)", method: "mobile_banking_ktb" },
  { label: "ธนาคารกรุงศรีอยุธยา (KMA)", method: "mobile_banking_bay" },
];

onMounted(async () => {
  if (isEdit.value) {
    const data = await paymentStore.fetchPaymentById(paymentId.value);
    if (data) {
      form.label = data.label;
      form.method = data.method;
      // Map ข้อมูลลูกตามโครงสร้างเดิม
      form.children = data.paymentChilds.map((c) => ({
        label: c.label,
        method: c.method,
        sortOrder: c.sortOrder,
      }));
    }
  }
});

const handleMethodChange = () => {
  const selected = OMISE_METHODS.find((m) => m.value === form.method);
  // ถ้าไม่ใช่การ Edit ให้เปลี่ยน Label อัตโนมัติตามประเภทที่เลือก
  if (selected && !isEdit.value) form.label = selected.label;
  // เคลียร์ค่าลูกทุกครั้งที่เปลี่ยนประเภทหลัก
  form.children = [];
};

const syncOmiseBanks = () => {
  // ใช้ข้อมูลจาก MOBILE_BANKS เข้าไปใน form.children โดยตรงตามโครงสร้างคุณ
  form.children = MOBILE_BANKS.map((b, i) => ({
    label: b.label,
    method: b.method,
    sortOrder: i,
  }));
  useAlert.toast("ซิงค์ข้อมูลธนาคารสำเร็จ");
};

const addChild = () => {
  form.children.push({
    label: "",
    method: "",
    sortOrder: form.children.length,
  });
};

const removeChild = (index: number) => {
  form.children.splice(index, 1);
};

const submitForm = async () => {
  try {
    if (isEdit.value) {
      await paymentStore.updatePayment(paymentId.value, form);
      useAlert.toast("อัปเดตข้อมูลสำเร็จ");
    } else {
      await paymentStore.createPayment(form);
      useAlert.toast("สร้างช่องทางสำเร็จ");
    }
    router.push("/payments");
  } catch (err: any) {
    useAlert.error("บันทึกไม่สำเร็จ", err.message);
  }
};
</script>

<style scoped>
/* ซ่อน Arrow ของ Select ในบาง Browser เพื่อความคลีน */
select {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2394a3b8'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 1rem center;
  background-size: 1.25rem;
}
</style>
