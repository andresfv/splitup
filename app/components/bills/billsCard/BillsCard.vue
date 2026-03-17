<template>
    <BillsDialog v-model:open="modalOpen" :selectedBill="localBill" />

    <div class="group/card">

      <div class="relative">

            <Button variant="ghost" size="icon-sm"
                class="absolute -right-6 rounded-full cursor-pointer opacity-0 group-hover/card:opacity-100 transition"
                @click="modalOpen = true">
                <EditIcon />
            </Button>

            <ConfirmDialog title="Eliminar factura" description="La factura será eliminado definitivamente"
                @confirm="handleBillDelete(localBill)">
                <Button variant="ghost" size="icon-sm"
                    class="absolute top-6 -right-6 rounded-full cursor-pointer opacity-0 group-hover/card:opacity-100 transition">
                    <TrashIcon />
                </Button>
            </ConfirmDialog>

        </div>

        <Card class="m-1">
            <CardContent>
                <div class="grid grid-cols-1 gap-2">


                        <div class="flex flex-col">
                            <Label>Comercio</Label>
                            <span>{{ selectedPlace?.name || '-' }}</span>
                        </div>
                        
                        <!-- <div class="flex flex-col">
                        </div> -->

                        <div class="flex flex-col">
                            <Label>Fecha</Label>
                            <span>{{ myFormatDate(localBill.date) }}</span>
                        </div>

                        <div class="flex flex-col">
                            <Label>Monto</Label>
                            <span>{{ myFormatCurrency(localBill.amount) }}</span>
                        </div>

                        <div class="flex items-center gap-2 ml-30">
                            <input :id="`active-${localBill.id}`" type="checkbox" v-model="localBill.isPaid"
                            @change="handleBillUpdate()"/>
                            <Label :for="`active-${localBill.id}`">Pagada</Label>
                        </div>
                        
                </div>
            </CardContent>
        </Card>
    </div>
</template>

<script setup lang="ts">
import { useSplitUpStore } from '../../../stores/split-up';
import ConfirmDialog from '~/components/common/confirmDialog/ConfirmDialog.vue';
import { TrashIcon, EditIcon } from 'lucide-vue-next';
import BillsDialog from '~/components/bills/billsDialog/BillsDialog.vue';


const props = defineProps<Props>();

const modalOpen = ref(false);

const selectedPlace = computed(() => {
     if (!localBill.value.placeId) return null;
     
    return splitUpStore.places.find(p =>
        p.id === localBill.value.placeId
    ) || null;
})

const splitUpStore = useSplitUpStore();

interface Props {
    bill: Bill;
}

const localBill = ref({ ...props.bill });



const handleBillUpdate = async () => {
    await splitUpStore.updateBill(localBill.value);
};

const handleBillDelete = async (bill: Bill) => {
    await splitUpStore.deleteBill(bill);
}

watch(
    () => props.bill,
    (newValue) => {
        localBill.value = { ...newValue }
    },
    { immediate: true }
);

onMounted(() => {
    if (splitUpStore.places.length === 0) {
        splitUpStore.getPlaces();
    }
});

</script>

<style scoped></style>
