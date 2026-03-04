<template>
  <aside class="w-48 bg-white border-r border-slate-200 h-[calc(100vh-64px)] sticky top-16 hidden md:block">
    <div class="p-4 space-y-2">
      <p class="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4 px-3">Main Menu</p>
      
      <nav class="space-y-1">
        <router-link 
          v-for="item in menuItems" 
          :key="item.path"
          :to="item.path"
          class="flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors group"
          :class="[$route.path === item.path ? 'bg-blue-50 text-blue-600' : 'text-slate-600 hover:bg-slate-50']"
        >
          <span class="text-xl">{{ item.icon }}</span>
          <span class="font-medium">{{ item.name }}</span>
        </router-link>
      </nav>

      <hr class="my-6 border-slate-100" />

      <p class="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4 px-3">System Setup</p>
      <nav class="space-y-1">
        <router-link to="/shippings" class="flex items-center space-x-3 px-3 py-2 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors font-medium" active-class="bg-blue-50 text-blue-600">
          <span>🚚</span> <span>Shipping</span>
        </router-link>
        <router-link to="/payments" class="flex items-center space-x-3 px-3 py-2 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors font-medium" active-class="bg-blue-50 text-blue-600">
          <span>💳</span> <span>Payments</span>
        </router-link>
      </nav>
    </div>
  </aside>
</template>

<script setup lang="ts">
const menuItems = [
  { name: 'Dashboard', path: '/dashboard', icon: '📊' },
  { name: 'Orders', path: '/orders', icon: '📦' },
  { name: 'Merchants', path: '/merchants', icon: '🏪' },
  { name: 'Users', path: '/users', icon: '👤' },
];
</script>
