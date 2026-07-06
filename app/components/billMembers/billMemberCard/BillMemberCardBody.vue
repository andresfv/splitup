<template>
    <div class="space-y-2">

        <div :class="['font-bold text-center grid', isExporting ? 'grid-cols-3' : 'grid-cols-5']">
            <div>Nombre</div>
            <div>Fecha</div>
            <div>Monto</div>
            <div v-if="!isExporting">Pagado</div>
            <div v-if="!isExporting">Acciones</div>
        </div>

        <BillMemberCardRow
            v-for="item in billItems"
            :key="item.id"
            :billItem="item"
            :isExporting
            @updateBillItem="updateBillItem"
        />

    </div>

</template>

<script setup lang="ts">
import BillMemberCardRow from './BillMemberCardRow.vue';

interface Props {
    billItems: Array<BillMemberDetailsDTO>;
    isExporting: boolean;
}

const props = defineProps<Props>();

const splitUpStore = useSplitUpStore();

function updateBillItem(billItem: BillMemberDetailsDTO) {
    splitUpStore.updateBillItem(billItem);
}

</script>