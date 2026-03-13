<script setup lang="ts">
import { onMounted } from "vue";
import { useStatStore } from "../stores/statStore";
import UserOverviewStat from "@/components/UserOverviewStat.vue";

const statStore = useStatStore();

onMounted(() => {
  statStore.fetchUserStat();
});
</script>

<template>
  <div class="p-6">
    <header class="mb-8">
      <h1 class="text-2xl font-black text-slate-800 italic">USER ANALYTICS</h1>
      <p class="text-slate-500 text-sm">
        ข้อมูลเชิงลึกและพฤติกรรมของผู้ใช้งานในระบบ
      </p>
    </header>

    <UserOverviewStat />
  </div>
</template>
