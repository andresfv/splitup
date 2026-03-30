<template>
    <div class="flex justify-center m-3">
        <h1>Lista de Facturas</h1>
    </div>

     <BillsDialog v-model:open="modalOpen" />
    <!-- TODO: Si no hay registros mostrar un mensaje de que no hay facturas -->
    <div class="grid grid-cols-4 gap-5">
        <BillsCard v-for="bill in bills" :key="bill.id" :bill="bill" />
    </div>

    <MyFabButton @click="modalOpen = true" />

</template>


<script setup lang="ts">
import MyFabButton from '~/components/common/myFabButton/MyFabButton.vue';
import BillsCard from '~/components/bills/billsCard/BillsCard.vue';
import BillsDialog from '~/components/bills/billsDialog/BillsDialog.vue';

const modalOpen = ref(false);

const splitUpStore = useSplitUpStore();
const bills = computed(() => splitUpStore.bills);

await useAsyncData('init-split-data', async () => {
    await splitUpStore.initData();
});

</script>