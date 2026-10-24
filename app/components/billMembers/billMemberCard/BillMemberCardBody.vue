<template>
    <div class="space-y-2">

        <div :class="['font-bold text-center grid', isExporting ? 'grid-cols-3' : 'grid-cols-4']">
            <div>Nombre</div>
            <div>Fecha</div>
            <div>Monto</div>
            <div v-if="!isExporting">Pagado</div>
        </div>

        <BillMemberCardRow
            v-for="item in billItems"
            :key="item.id"
            :billItem="item"
            :isExporting
            :editMode
            :draft="drafts[item.id]"
            @selectItem="selectBillItem"
        />

    </div>

</template>

<script setup lang="ts">
import BillMemberCardRow from './BillMemberCardRow.vue';

interface Props {
    billItems: Array<BillMemberDetailsDTO>;
    isExporting: boolean;
    editMode: boolean;
    drafts: Record<number, BillItemDraftDTO>;
}

const props = defineProps<Props>();

const splitUpStore = useSplitUpStore();

function selectBillItem(billItem: BillMemberDetailsDTO) {
    splitUpStore.addBillMemberToSelected(billItem);
}

</script>
