<template>
    <div class="space-y-2">

        <div class="grid grid-cols-5 font-bold text-center">
            <div>Nombre</div>
            <div>Fecha</div>
            <div>Monto</div>
            <div>Pagado</div>
            <div>Acciones</div>
        </div>

        <BillMemberCardRow
            v-for="item in billItems"
            :key="item.id"
            :billItem="item"
            @updateBillItem="updateBillItem"
        />

    </div>

</template>

<script setup lang="ts">
import BillMemberCardRow from './BillMemberCardRow.vue';

interface Props {
    billItems: Array<BillItemDTO>;
}

const props = defineProps<Props>();

const splitUpStore = useSplitUpStore();

function updateBillItem(billItem: BillItemDTO) {
    splitUpStore.updateBillItem(billItem);
}

</script>