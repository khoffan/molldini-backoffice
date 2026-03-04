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
import ShippingTable from '@/components/ShippingTable.vue';
import { onMounted } from 'vue';
import { useShippingStore } from '@/stores/shippingStore';
import type { IShipping } from '@/interface/shippingInterface';

const shippingStore = useShippingStore();

onMounted(() => {
  shippingStore.fetchShippings();
});

const toggleStatus = async (shipping: IShipping) => {
  // เรียก PATCH/PUT เฉพาะส่วน isActive ผ่าน store
  await shippingStore.updateShipping(shipping.id, { isActive: !shipping.isActive });
};

const confirmDelete = async (id: string) => {
  if (confirm('Are you sure you want to delete this shipping method?')) {
    await shippingStore.deleteShiiping(id); // แก้ตัวสะกดตาม store ของคุณ (deleteShiiping)
  }
};
</script>