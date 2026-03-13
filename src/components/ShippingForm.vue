<template>
  <div class="max-w-6xl mx-auto space-y-6">
    <div
      class="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm sticky top-0 z-20 backdrop-blur-md bg-white/90"
    >
      <div class="flex items-center gap-4">
        <button
          @click="$router.back()"
          class="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-400 hover:text-slate-600"
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
            {{ isEdit ? "Edit" : "New" }} Shipping Method
          </h1>
          <p
            class="text-[11px] font-bold text-slate-400 mt-1 uppercase tracking-wider"
          >
            Logistics & Delivery Configuration
          </p>
        </div>
      </div>

      <div class="flex items-center gap-3">
        <button
          @click="submitForm"
          class="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg shadow-indigo-100 flex items-center disabled:opacity-50"
          :disabled="shippingStore.loading"
        >
          <span v-if="shippingStore.loading" class="animate-spin mr-2">⏳</span>
          {{ isEdit ? "Save Changes" : "Create Shipping" }}
        </button>
      </div>
    </div>

    <div class="grid grid-cols-12 gap-6">
      <div class="col-span-12 lg:col-span-8 space-y-6">
        <div
          class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
        >
          <div class="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
            <h2
              class="text-sm font-black text-slate-700 uppercase tracking-tighter"
            >
              Service Details
            </h2>
          </div>
          <div class="p-6 space-y-5">
            <div class="grid grid-cols-2 gap-5">
              <div class="col-span-2 md:col-span-1">
                <label
                  class="block text-[11px] font-black text-slate-500 uppercase mb-2 ml-1"
                  >Shipping Name</label
                >
                <input
                  v-model="form.name"
                  type="text"
                  class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none text-sm font-medium"
                  placeholder="e.g. Kerry Express (Next Day)"
                />
              </div>
              <div class="col-span-2 md:col-span-1">
                <label
                  class="block text-[11px] font-black text-slate-500 uppercase mb-2 ml-1"
                  >Estimated Days</label
                >
                <input
                  v-model="form.estimatedDays"
                  type="text"
                  class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none text-sm font-medium"
                  placeholder="e.g. 1-2 business days"
                />
              </div>
            </div>
            <div>
              <label
                class="block text-[11px] font-black text-slate-500 uppercase mb-2 ml-1"
                >Description</label
              >
              <textarea
                v-model="form.description"
                rows="3"
                class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none text-sm font-medium"
                placeholder="Describe this service to your customers..."
              ></textarea>
            </div>
          </div>
        </div>

        <div
          class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
        >
          <div class="px-6 py-4 border-b border-slate-100 bg-emerald-50/30">
            <h2
              class="text-sm font-black text-emerald-700 uppercase tracking-tighter"
            >
              Pricing & Thresholds
            </h2>
          </div>
          <div class="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label
                class="block text-[11px] font-black text-slate-500 uppercase mb-2 ml-1"
                >Shipping Fee (฿)</label
              >
              <div class="relative">
                <span
                  class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs"
                  >฿</span
                >
                <input
                  v-model.number="form.price"
                  type="number"
                  class="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono font-bold outline-none focus:border-emerald-500 transition-all"
                />
              </div>
            </div>
            <div>
              <label
                class="block text-[11px] font-black text-slate-500 uppercase mb-2 ml-1"
                >Min Order (฿)</label
              >
              <div class="relative">
                <span
                  class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs"
                  >฿</span
                >
                <input
                  v-model.number="form.minOrderAmount"
                  type="number"
                  class="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono font-bold outline-none focus:border-emerald-500 transition-all"
                />
              </div>
            </div>
            <div>
              <label
                class="block text-[11px] font-black text-slate-500 uppercase mb-2 ml-1"
                >Free Delivery At (฿)</label
              >
              <div class="relative">
                <span
                  class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs"
                  >฿</span
                >
                <input
                  v-model.number="form.freeShippingThreshold"
                  type="number"
                  placeholder="No free"
                  class="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono font-bold outline-none focus:border-emerald-500 transition-all"
                />
              </div>
            </div>
            <p
              class="col-span-full text-[10px] text-slate-400 font-medium italic"
            >
              * หากยอดสั่งซื้อถึงเกณฑ์ที่กำหนด ระบบจะปรับค่าจัดส่งเป็น 0
              บาทโดยอัตโนมัติ
            </p>
          </div>
        </div>
      </div>

      <div class="col-span-12 lg:col-span-4 space-y-6">
        <div
          class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
        >
          <div class="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
            <h2
              class="text-sm font-black text-slate-700 uppercase tracking-tighter"
            >
              Logistics Provider
            </h2>
          </div>
          <div class="p-6">
            <label
              class="block text-[11px] font-black text-slate-500 uppercase mb-2 ml-1"
              >Provider Type</label
            >
            <select
              v-model="form.provider"
              :disabled="isEdit"
              class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none focus:border-indigo-500 transition-all disabled:opacity-50"
            >
              <option value="">Select Provider</option>
              <option value="FLASH">Flash Express</option>
              <option value="KERRY">Kerry Express</option>
              <option value="J&T">J&T Express</option>
              <option value="THAIPOST">Thailand Post</option>
              <option value="CUSTOM">Other / Custom</option>
            </select>
          </div>
        </div>

        <div
          class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
        >
          <div class="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
            <h2
              class="text-sm font-black text-slate-700 uppercase tracking-tighter"
            >
              Provider Logo
            </h2>
          </div>
          <div class="p-6">
            <div
              class="relative aspect-video w-full border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center group hover:border-indigo-400 transition-all cursor-pointer bg-slate-50/30 overflow-hidden mb-4"
            >
              <img
                v-if="form.image"
                :src="form.image"
                class="w-full h-full object-contain p-4 transition-transform group-hover:scale-105"
              />
              <div v-else class="text-center">
                <svg
                  class="w-8 h-8 mx-auto text-slate-300"
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
              </div>
            </div>
            <label
              class="block text-[11px] font-black text-slate-500 uppercase mb-2 ml-1"
              >Direct Image URL</label
            >
            <input
              v-model="form.image"
              type="text"
              placeholder="https://image-path.png"
              class="w-full px-3 py-2 text-[10px] bg-slate-50 border border-slate-200 rounded-lg font-mono outline-none focus:border-indigo-500"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAlert } from "@/utils/swal";
import { useShippingStore } from "@/stores/shippingStore";

const route = useRoute();
const router = useRouter();
const shippingStore = useShippingStore();

const shippingId = computed(() => route.params.id as string);
const isEdit = computed(() => !!shippingId.value);

const form = reactive({
  name: "",
  provider: "",
  description: "",
  price: 0,
  estimatedDays: "",
  minOrderAmount: 0,
  freeShippingThreshold: null as number | null,
  image: "",
});

onMounted(async () => {
  if (isEdit.value) {
    // สมมติว่าคุณมี action fetchById ใน store หรือกรองจาก list
    // ในที่นี้แนะนำให้หาจาก shippings ใน store ที่โหลดมาแล้ว
    const data = shippingStore.shippings.find((s) => s.id === shippingId.value);
    if (data) {
      Object.assign(form, {
        name: data.name,
        provider: data.provider,
        description: data.description,
        price: data.price,
        estimatedDays: data.estimatedDays,
        minOrderAmount: data.minOrderAmount,
        freeShippingThreshold: data.freeShippingThreshold,
        image: data.image?.url || "",
      });
    }
  }
});

const submitForm = async () => {
  if (!form.name || !form.provider) return alert("Please fill required fields");

  try {
    // เตรียม Payload ให้ตรงกับ Interface (จัดการเรื่อง image เล็กน้อย)
    const payload = {
      ...form,
      image: form.image ? { url: form.image, path: "shipping_logos" } : null,
    };

    if (isEdit.value) {
      await shippingStore.updateShipping(shippingId.value, payload);
      useAlert.toast("Shipping updated successfully", "success");
    } else {
      await shippingStore.createShipping(payload as any);
      useAlert.toast("Shipping created successfully", "success");
    }

    router.push("/shippings");
  } catch (error: any) {
    console.error(error);
    useAlert.error("Error", "Something went wrong");
  }
};
</script>
