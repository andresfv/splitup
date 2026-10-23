<template>
    <div class="text-center">

        <h1 class="text-lg font-bold tracking-widest">
            {{ persona }}
        </h1>

        <div class="mt-4 space-y-1">
            <p>
                <span class="font-bold">Fecha:</span>

                {{ myFormatDate(fechaDesde) }}
                -
                {{ myFormatDate(fechaHasta) }}
            </p>
        </div>

    </div>
</template>

<script setup>
defineProps({
    persona: String,
    fechaDesde: Date,
    fechaHasta: Date
})
</script>