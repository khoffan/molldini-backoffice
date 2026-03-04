<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

// 1. เพิ่มการประกาศ Slots Type ตรงนี้
defineSlots<{
  trigger(props: { isOpen: boolean }): any
  content(props: { close: () => void }): any
}>()

const props = defineProps({
  align: {
    type: String,
    default: 'right'
  },
  width: {
    type: String,
    default: 'w-48'
  }
})

const isOpen = ref(false)
const dropdownRef = ref<HTMLElement | null>(null)

const toggle = () => (isOpen.value = !isOpen.value)
const close = () => (isOpen.value = false)

const handleClickOutside = (e: MouseEvent) => {
  if (dropdownRef.value && !dropdownRef.value.contains(e.target as Node)) {
    close()
  }
}

onMounted(() => window.addEventListener('click', handleClickOutside))
onUnmounted(() => window.removeEventListener('click', handleClickOutside))

defineExpose({ close })
</script>

<template>
  <div class="relative inline-block text-left" ref="dropdownRef">
    <div @click="toggle" class="cursor-pointer">
      <slot name="trigger" :isOpen="isOpen"></slot>
    </div>

    <transition
      enter-active-class="transition duration-100 ease-out"
      enter-from-class="transform scale-95 opacity-0"
      enter-to-class="transform scale-100 opacity-100"
      leave-active-class="transition duration-75 ease-in"
      leave-from-class="transform scale-100 opacity-100"
      leave-to-class="transform scale-95 opacity-0"
    >
      <div 
        v-if="isOpen"
        :class="[
          'absolute z-50 mt-2 bg-white rounded-lg shadow-lg border border-slate-100 py-1 focus:outline-none',
          width,
          align === 'right' ? 'right-0' : 'left-0'
        ]"
      >
        <slot name="content" :close="close"></slot>
      </div>
    </transition>
  </div>
</template>