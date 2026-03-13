<template>
  <main>
    <OrderStatOverview />
  </main>
</template>
<script setup lang="ts">
import OrderStatOverview from "@/components/OrderStatOverview.vue";
import { useStatStore } from "@/stores/statStore";
import { onMounted } from "vue";

const statStore = useStatStore();
onMounted(() => {
  statStore.fetchOrderStat();
});
</script>
