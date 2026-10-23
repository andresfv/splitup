<template>

    <div class="flex justify-center m-3">
        <h1>Facturas por Persona</h1>
    </div>

  <div class="text-center mt-4 mb-4">

        <DateRangePicker v-model:fromDate="fromDate" v-model:toDate="toDate" labelFromDate="Desde:"
            labelToDate="Hasta:" />

        <!-- <ConfirmDialog title="Dividir Facturas" description="Los montos de las facturas dentro del rango de fechas seleccionado se dividirán 
            en partes iguales entre los miembros asociados a cada factura. ¿Desea continuar?"
            @confirm="splitUpStore.splitBillAmountsEquallyBetweenMembers(fromDate!, toDate!)">
            <Button class="ml-4" :size="'sm'" :disabled="!fromDate || !toDate"
                title="Dividir facturas en partes iguales">
                <DivideIcon />
            </Button>
        </ConfirmDialog> -->

    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-5 p-4">
        <BillMemberCard v-for="member in members" :key="member.id" :member="member" :fromDate="fromDate"
            :toDate="toDate" v-if="fromDate && toDate" />
    </div>

</template>

<script setup lang="ts">
import BillMemberCard from '~/components/billMembers/billMemberCard/BillsMemberCard.vue';
// import DatePicker from '~/components/common/datePicker/DatePicker.vue';
// import DivideIcon from '~/components/icons/DivideIcon.vue';
// import ConfirmDialog from '~/components/common/confirmDialog/ConfirmDialog.vue';
import DateRangePicker from '~/components/common/dateRangePicker/dateRangePicker.vue';

const splitUpStore = useSplitUpStore();
const members = computed(() => splitUpStore.members);

const { fromDate, toDate } = storeToRefs(splitUpStore);

await useAsyncData('init-split-data', async () => {
    await splitUpStore.initData();
});

</script>