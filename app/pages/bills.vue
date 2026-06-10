<template>
    <div class="flex justify-center m-3">
        <h1>Lista de Facturas</h1>
    </div>

    <DateRangePicker v-model:fromDate="fromDate" v-model:toDate="toDate" 
        labelFromDate="Desde:" labelToDate="Hasta:" />

     <BillsDialog v-model:open="modalOpen" />
     
    <div class="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-5 p-4">
        <BillsCard v-if="bills.length > 0" v-for="bill in bills" :key="bill.id" :bill="bill" />
        <div v-else class="col-span-4 text-center text-muted-foreground">
            No se encontraron facturas.
        </div>
    </div>

    <MyFabButton @click="modalOpen = true" />

</template>


<script setup lang="ts">
import MyFabButton from '~/components/common/myFabButton/MyFabButton.vue';
import BillsCard from '~/components/bills/billsCard/BillsCard.vue';
import BillsDialog from '~/components/bills/billsDialog/BillsDialog.vue';
import DateRangePicker from '~/components/common/dateRangePicker/dateRangePicker.vue';

const modalOpen = ref(false);

const splitUpStore = useSplitUpStore();
const { fromDate, toDate } = storeToRefs(splitUpStore);

const bills = computed(() => splitUpStore.getBillsBetweenDates(fromDate.value, toDate.value));
        
await useAsyncData('init-split-data', async () => {
    await splitUpStore.initData();
});

</script>