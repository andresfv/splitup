<script setup lang="ts">
import type { NuxtError } from '#app';

defineProps({
  error: Object as () => NuxtError,
});

const tryAgain = () => location.reload();
</script>

<template>
  <div
    class="flex min-h-screen items-center justify-center overflow-hidden bg-background px-6 py-16 text-foreground"
  >
    <div class="max-w-xl space-y-6 text-center">

      <h1 class="text-[4rem] font-bold text-destructive">
        Status: {{ error!.status || 'Error' }}
      </h1>

      <p class="text-lg font-semibold text-foreground">
        {{ error!.statusText }}
      </p>

      <div class="flex justify-center gap-4">
        <Button variant="secondary" @click="tryAgain"> Recargar página </Button>
      </div>
    </div>
  </div>
</template>
