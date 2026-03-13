<template>
  <main>
    <ShippingTable
      :shippings="shippingStore.shippings"
      @delete="confirmDelete"
      @toggle="toggleStatus"
    />
  </main>
</template>
<script setup lang="ts">
import ShippingTable from "@/components/ShippingTable.vue";
import { onMounted } from "vue";
import { useShippingStore } from "@/stores/shippingStore";
import { useAlert } from "@/utils/swal";
import type { IShipping } from "@/interface/shippingInterface";

const shippingStore = useShippingStore();

onMounted(() => {
  shippingStore.fetchShippings();
});

const toggleStatus = async (shipping: IShipping) => {
  // เรียก PATCH/PUT เฉพาะส่วน isActive ผ่าน store
  await shippingStore.updateShipping(shipping.id, {
    isActive: !shipping.isActive,
  });
};

const confirmDelete = async (id: string) => {
  const result = await useAlert.confirm(
    "คุณแน่ใจหรือไม่?",
    "ข้อมูลลูกทั้งหมดจะถูกลบไปด้วย",
  );

  if (result.isConfirmed) {
    try {
      await shippingStore.deleteShiiping(id); // แก้ตัวสะกดตาม store ของคุณ (deleteShiiping)
      useAlert.toast("ลบข้อมูลสำเร็จ");
    } catch (e: any) {
      useAlert.toast(e.message, "error");
    }
  }
};
</script>
