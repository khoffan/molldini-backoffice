<template>
  <div>
    <header class="mb-8">
      <h1 class="text-2xl font-black text-slate-800 italic">
        MERCHANT ANALYTICS
      </h1>
      <p class="text-slate-500 text-sm">
        ข้อมูลเชิงลึกและพฤติกรรมของผู้ใช้งานในระบบ
      </p>
    </header>
    <main>
      <MerchantStatOverview />
    </main>
  </div>
</template>
<script setup lang="ts">
import MerchantStatOverview from "@/components/MerchantStatOverview.vue";
import { useStatStore } from "@/stores/statStore";
import { onMounted } from "vue";

const statStore = useStatStore();
onMounted(() => {
  statStore.fetchMerchantStat();
});
</script>
