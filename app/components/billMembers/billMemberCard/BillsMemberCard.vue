<template>
    <div ref="htmlContainerRef" class="w-full bg-secondary shadow-xl rounded-md p-5 text-sm">

        <BillMemberCardHeader :persona="props.member.name" :fechaDesde="fromDate" :fechaHasta="toDate" />

        <div class="border-t border-dashed border-accent-foreground my-4"></div>

        <BillMemberCardBody :billItems="billsByMemberAndBetween" :isExporting/>

        <div class="border-t border-dashed border-accent-foreground my-4"></div>

        <BillMemberCardFooter :montoTotal="billSummary.total" :montoPagado="billSummary.paid" :montoPendiente="billSummary.pending" :isExporting="isExporting"
            @markAsPaid="handleMarkAsPaid" @exportPng="handleExportPng"/>

    </div>
</template>

<script setup lang="ts">
import { convertHtmlToPng } from '~/utils/convertHtmlToPng.js';
import BillMemberCardBody from './BillMemberCardBody.vue'
import BillMemberCardFooter from './BillMemberCardFooter.vue'
import BillMemberCardHeader from './BillMemberCardHeader.vue'

interface Props {
    member: Member;
    fromDate: Date ;
    toDate: Date ;
}

const props = defineProps<Props>();

const splitUpStore = useSplitUpStore();

const htmlContainerRef = ref<HTMLElement | null>(null);
const isExporting = ref(false);

/**
 * Obtiene las facturas del miembro dentro del rango de fechas
 */
const billsByMemberAndBetween = computed<BillMemberDetailsDTO[]>(() => {
    return splitUpStore.getMemberBillItemsBetweenDates(props.member.id, props.fromDate, props.toDate);
});

const handleMarkAsPaid = () => {
    splitUpStore.payAllBillMemberItems( billsByMemberAndBetween.value );
};

const handleExportPng = async () => {
    isExporting.value = true;

    const fileName = `factura_${props.member.name}_${props.fromDate.toISOString().split('T')[0]}_${props.toDate.toISOString().split('T')[0]}.png`;
    await convertHtmlToPng(htmlContainerRef.value, { fileName, backgroundColor: '#171717' });

    isExporting.value = false;
}

const billSummary = computed<BillSummaryDTO>(() => {
    return splitUpStore.getMemberBillSummary(props.member.id, props.fromDate, props.toDate);
});

</script>