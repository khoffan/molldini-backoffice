<template>
  <div class="w-full h-full">
    <router-view v-slot="{ Component }">
      <transition 
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="opacity-0 translate-y-1"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
        mode="out-in"
      >
        <component :is="Component" :key="$route.fullPath" />
      </transition>
    </router-view>
  </div>
</template>
