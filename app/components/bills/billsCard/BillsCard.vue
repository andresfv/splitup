<template>
    <BillsDialog v-model:open="modalOpen" :selectedBill="localBill" />

   <div class="relative">

        <div class="hidden md:flex flex-col gap-1 absolute top-3 right-3">
            <Button variant="ghost" size="icon-sm" class="flex items-center gap-1 text-sm shadow-sm rounded-full cursor-pointer"
                @click="modalOpen = true">
                <EditIcon />
            </Button>

            <ConfirmDialog title="Eliminar factura" description="La factura será eliminada definitivamente"
                @confirm="handleBillDelete(localBill)">
                <Button variant="ghost" size="icon-sm" class="flex items-center gap-1 text-sm shadow-sm rounded-full cursor-pointer">
                    <TrashIcon />
                </Button>
            </ConfirmDialog>
        </div>


        <div class="w-full bg-secondary shadow-xl rounded-md p-6 text-sm md:pr-12 pb-4 md:pb-3">
            <div>
                <div class="text-center min-w-0 wrap-break-words">
                    <div class="text-base font-bold tracking-widest">
                        <span>{{ selectedPlace?.name || '-' }}</span>
                    </div>
                </div>

                <div class="border-t border-dashed border-accent-foreground my-4" />

                <div class="grid grid-cols-2 text-base">
                    <span>Fecha:</span>
                    <div class="text-right min-w-0 wrap-break-words">{{ myFormatDate(localBill.date) }}</div>
                </div>

                <div class="grid grid-cols-2 text-base">
                    <span>Monto:</span>
                    <div class="text-right min-w-0 wrap-break-words">{{ myFormatCurrency(billSumary.total) }}</div>
                </div>

                <div class="grid grid-cols-2 text-base">
                    <div>Monto Pagado:</div>
                    <div class="text-right min-w-0 wrap-break-words">
                        {{ myFormatCurrency(billSumary.paid) }}
                    </div>
                </div>

                <div class="grid grid-cols-2 font-bold text-base">
                    <div>Monto Pendiente:</div>
                    <div class="text-right">
                        {{ myFormatCurrency(billSumary.pending) }}
                    </div>
                </div>

                <div class="border-t border-dashed border-accent-foreground my-4" />

                <div class="text-base text-center">
                    <div v-if="selectedMemberNames.length">Personas asignadas a la factura</div>
                    <div v-else>No hay personas asignadas a la factura...</div>
                    <MyTagsInput :modelValue="selectedMemberNames" :disabled="true" v-if="selectedMemberNames.length" />
                </div>

                <div class="mt-4 mb-4 text-center text-xl">
                    <span v-if="billSumary.pending > 0" class="text-red-500">Pendiente</span>
                    <span v-else-if="billSumary.pending == 0" class="text-green-500">Pagada</span>
                    <span v-else class="text-yellow-500">Sobrepagada</span>
                </div>

                <div class="flex flex-row justify-end gap-3 md:hidden">
                     <Button class="shadow-sm cursor-pointer"
                          @click="modalOpen = true">
                          <EditIcon />
                          Editar
                      </Button>
          
                      <ConfirmDialog title="Eliminar factura" description="La factura será eliminada definitivamente"
                          @confirm="handleBillDelete(localBill)">
                          <Button class="shadow-sm cursor-pointer">
                              <TrashIcon />
                              Eliminar
                          </Button>
                      </ConfirmDialog>
                  </div>
            </div>
        </div>

    </div>
</template>

<script setup lang="ts">
import { useSplitUpStore } from '../../../stores/split-up';
import ConfirmDialog from '~/components/common/confirmDialog/ConfirmDialog.vue';
import { TrashIcon, EditIcon } from '@lucide/vue';
import BillsDialog from '~/components/bills/billsDialog/BillsDialog.vue';
import MyTagsInput from '~/components/common/myTagsInput/MyTagsInput.vue';

const props = defineProps<Props>();

interface Props {
    bill: Bill;
}

const modalOpen = ref(false);

const splitUpStore = useSplitUpStore();

const selectedPlace = computed(() => {
     if (!localBill.value.placeId) return null;
     
    return splitUpStore.places.find(p =>
        p.id === localBill.value.placeId
    ) || null;
});

//Indice de miembros para mostrar los nombres de los miembros seleccionados
const membersMap = computed(() => {
    return new Map(localMembers.value.map(m => [m.id, m]));
});

//Lista de nombres de miembros seleccionados para mostrar en la tarjeta
const selectedMemberNames = computed(() => {
 return localBillMembers.value
        .filter(p => p.billId === localBill.value.id)
        .map(p => membersMap.value.get(p.memberId))
        .filter(Boolean)
        .map(member => member!.name);
});

const localBillMembers = computed(() => splitUpStore.billMembers);
const localMembers = computed(() => splitUpStore.members);

const localBill = ref({ ...props.bill });

const billSumary = computed<BillSummaryDTO>(() => splitUpStore.getBillSumary(localBill.value.id));

const handleBillDelete = async (bill: Bill) => {
    await splitUpStore.deleteBill(bill);
};

watch(
    () => props.bill,
    (newValue) => {
        localBill.value = { ...newValue }
    },
    { immediate: true }
);


</script>

<style scoped></style>
