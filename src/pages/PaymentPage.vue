<script setup lang="ts">
import { onMounted } from "vue";
import { usePaymentStore } from "@/stores/paymentStore";
import { useAlert } from "@/utils/swal";
import PaymentTable from "@/components/PaymentTable.vue";

const paymentStore = usePaymentStore();

onMounted(() => {
  paymentStore.fetchPayments();
});

// const confirmDelete = async (id: string) => {
//   if (confirm('Are you sure you want to delete this payment method?')) {
//     await paymentStore.deletePayment(id);
//   }
// };

const handleDelete = async (id: string) => {
  // เรียกใช้แบบ Confirm
  const result = await useAlert.confirm(
    "คุณแน่ใจหรือไม่?",
    "ข้อมูลลูกทั้งหมดจะถูกลบไปด้วย",
  );

  if (result.isConfirmed) {
    try {
      await paymentStore.deletePayment(id);
      useAlert.toast("ลบข้อมูลสำเร็จ"); // เรียกใช้แบบ Toast
    } catch (error: any) {
      useAlert.error("เกิดข้อผิดพลาด", error.message); // เรียกใช้แบบ Error Popup
    }
  }
};

const handleToggle = async (id: string, currentStatus: boolean) => {
  await paymentStore.toggleStatus(id, currentStatus);
};
</script>

<template>
  <div class="p-6 space-y-6">
    <div
      v-if="paymentStore.loading && paymentStore.payments.length === 0"
      class="text-center"
    >
      Loading...
    </div>

    <PaymentTable
      v-else
      :payments="paymentStore.payments"
      @delete="handleDelete"
      @toggle="handleToggle"
    />
  </div>
</template>
