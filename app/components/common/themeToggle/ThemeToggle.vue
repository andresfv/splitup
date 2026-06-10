<script setup lang="ts">
import { useTheme } from '@/composables/useTheme'
import { Sun, Moon } from '@lucide/vue';

const { theme, toggle } = useTheme()
</script>

<template>
  <button
    @click="toggle"
    class="relative flex items-center w-14 h-8 rounded-full 
           bg-zinc-300 dark:bg-zinc-700 
           transition-colors duration-300"
  >
    <!-- Círculo -->
    <span
      class="absolute left-1 top-1 w-6 h-6 rounded-full 
             bg-white dark:bg-zinc-900 
             shadow-md transform transition-transform duration-300"
      :class="theme === 'dark' ? 'translate-x-6' : 'translate-x-0'"
    />

    <!-- Iconos -->
    <Sun
      class="absolute left-2 w-4 h-4 text-yellow-500 transition-opacity duration-300"
      :class="theme === 'dark' ? 'opacity-0' : 'opacity-100'"
    />

    <Moon
      class="absolute right-2 w-4 h-4 text-blue-400 transition-opacity duration-300"
      :class="theme === 'dark' ? 'opacity-100' : 'opacity-0'"
    />
  </button>
</template>
