<template>

    <div>

        <div class="grid grid-cols-2 font-bold text-base">
            <div>Monto total:</div>
            <div class="text-right">
                {{ myFormatCurrency(montoTotal) }}
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

    </div>

</template>

<script setup>
defineProps({
    montoTotal: Number,
    montoPagado: Number,
    montoPendiente: Number
})
</script>