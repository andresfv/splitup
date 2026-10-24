<template>

    <div>

        <div class="grid grid-cols-2 font-bold text-base">
            <div>Monto total:</div>
            <div class="text-right">
                {{ myFormatCurrency(montoTotal) }}
            </div>
        </div>

        <div v-if="montoSeleccionados > 0" 
            class="grid grid-cols-2 font-bold text-blue-600 dark:text-blue-400">
            <div>Monto items seleccionados:</div>
            <div class="text-right">
                {{ myFormatCurrency(montoSeleccionados) }}
            </div>
        </div>

        <div class="grid grid-cols-2 font-bold text-base">
            <div>Monto Pagado:</div>
            <div class="text-right">
                {{ myFormatCurrency(montoPagado) }}
            </div>
        </div>

        <div class="grid grid-cols-2 font-bold text-base">
            <div>Monto Pendiente:</div>
            <div class="text-right">
                {{ myFormatCurrency(montoPendiente) }}
            </div>
        </div>

        <div v-if="editMode && !isExporting" class="grid grid-cols-2 gap-2 mt-4">
            <Button variant="outline"
                :size="'sm'"
                title="Cancelar"
                @click="$emit('cancel')">
                Cancelar
            </Button>
            <Button :size="'sm'"
                title="Guardar"
                @click="$emit('save')">
                Guardar
            </Button>
        </div>

    </div>

</template>

<script setup>

defineProps({
    montoTotal: Number,
    montoSeleccionados: Number,
    montoPagado: Number,
    montoPendiente: Number,
    isExporting: Boolean,
    editMode: Boolean
})

defineEmits(['save', 'cancel'])

</script>