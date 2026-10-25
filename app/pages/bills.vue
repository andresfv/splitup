<template>
    <div class="flex justify-center m-3">
        <h1>Lista de Facturas</h1>
    </div>

    <BillsFilterPanel />

    <DateRangePicker v-model:fromDate="fromDate" v-model:toDate="toDate"
        labelFromDate="Desde:" labelToDate="Hasta:" />

     <BillsDialog v-model:open="modalOpen" />

    <div class="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-5 p-4">
        <template v-if="pending">
            <Skeleton v-for="n in 3" :key="n" class="h-80 w-full" />
        </template>
        <BillsCard v-else-if="bills.length > 0" v-for="bill in bills" :key="bill.id" :bill="bill" />
        <div v-else class="col-span-4 text-center text-muted-foreground">
            {{ hasActiveFilters ? 'No se encontraron facturas con los filtros aplicados.' : 'No se encontraron facturas.' }}
        </div>
    </div>

    <MyFabButton @click="modalOpen = true" />

</template>


<script setup lang="ts">
import MyFabButton from '~/components/common/myFabButton/MyFabButton.vue';
import BillsCard from '~/components/bills/billsCard/BillsCard.vue';
import BillsDialog from '~/components/bills/billsDialog/BillsDialog.vue';
import BillsFilterPanel from '~/components/bills/billsFilterPanel/BillsFilterPanel.vue';
import DateRangePicker from '~/components/common/dateRangePicker/dateRangePicker.vue';
import { Skeleton } from '@/components/ui/skeleton';

const modalOpen = ref(false);

const splitUpStore = useSplitUpStore();
const { fromDate, toDate, billsFilter } = storeToRefs(splitUpStore);

const bills = computed(() => splitUpStore.getFilteredBills(fromDate.value, toDate.value));

const hasActiveFilters = computed(() => {
    const { status, placeId, memberId } = billsFilter.value;
    return status !== 'all' || placeId !== null || memberId !== null;
});

const { pending } = await useAsyncData('init-split-data', async () => {
    await splitUpStore.initData();
});

</script>
