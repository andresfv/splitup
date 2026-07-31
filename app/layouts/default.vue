<!--
  Layout por defecto de la aplicación.
-->
<template>

  <Toaster position="top-right" :expand="true" :close-button="true" close-button-position="top-right" rich-colors />

  <SidebarProvider>
    <MySidebar />
    <SidebarInset>
      <div class="min-h-screen transition-colors duration-300">
        <header class="flex items-center justify-between p-4">
          <SidebarTrigger />
          <ThemeToggle />
        </header>
        <slot />
      </div>
    </SidebarInset>
  </SidebarProvider>
</template>

<script setup lang="ts">
import { Toaster } from 'vue-sonner';
import ThemeToggle from '~/components/common/themeToggle/ThemeToggle.vue';
import MySidebar from '~/components/common/mySideBar/MySidebar.vue';


</script>