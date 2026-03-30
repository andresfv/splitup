<template>
    <div class="w-full bg-secondary shadow-xl rounded-md p-5 text-sm">

        <BillMemberCardHeader :persona="props.member.name" :fechaDesde="fromDate" :fechaHasta="toDate" />

        <div class="border-t border-dashed border-black my-4"></div>

        <BillMemberCardBody :billItems="billsByMemberAndBetween" />

        <div class="border-t border-dashed border-black my-4"></div>

        <BillMemberCardFooter :montoTotal="billSummary.total" :montoPagado="billSummary.paid" :montoPendiente="billSummary.pending" />

    </div>
</template>

<script setup lang="ts">
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

/**
 * Obtiene las facturas del miembro dentro del rango de fechas
 */
const billsByMemberAndBetween = computed(() => {
    return splitUpStore.getMemberBillItemsBetweenDates(props.member.id, props.fromDate, props.toDate);
});

const billSummary = computed<BillSummaryDTO>(() => {
    return splitUpStore.getMemberBillSummary(props.member.id, props.fromDate, props.toDate);
});

</script>