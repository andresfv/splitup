<template>
    <Dialog :open="open" @update:open="handleClose">
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Agregar Factura</DialogTitle>
               <DialogDescription>
                    Complete los datos para agregar una nueva factura.
                </DialogDescription>
            </DialogHeader>
            
            <form @submit.prevent="handleSubmit">
                <div class="space-y-4">
                    <div>
                         <Label>
                            Comercio
                        </Label>

                        <PlaceAutoComplete v-model="billPlace"/>
                    </div>

                    <div>
                        <Label>
                            Fecha
                        </Label>

                        <DatePicker v-model="billDate" :placeholder="'Seleccione una fecha'" required="true"/>
                    </div>

                    <div>
                        <Label>
                            Monto
                        </Label>

                        <MoneyInput v-model="billAmount" 
                        :placeholder="'Ingrese el monto de la factura'" required="true"/>
                    </div>

                    <div>
                        <Label>
                            Personas
                        </Label>

                        <MembersMultiSelect v-model="members"/>
                    </div>
                </div>
                
                <DialogFooter class="mt-6">
                    <Button type="button" variant="outline" @click="handleClose">
                        Cancelar
                    </Button>
                    <Button type="submit">
                        Aceptar
                    </Button>
                </DialogFooter>
            </form>
        </DialogContent>
    </Dialog>
</template>

<script setup lang="ts">
import DatePicker from '~/components/common/datePicker/DatePicker.vue';
import MoneyInput from '~/components/common/moneyInput/MoneyInput.vue';
import PlaceAutoComplete from '../placeAutoComplete/PlaceAutoComplete.vue';
import MembersMultiSelect from '~/components/members/membersMultiSelect/MembersMultiSelect.vue';


interface Props {
    open: boolean;
    selectedBill?: Bill | null;
}

const props = defineProps<Props>();
const emit = defineEmits<{
    'update:open': [value: boolean];
}>();

const splitUpStore = useSplitUpStore();

const billPlace = ref<Place>({} as Place);
const billDate = ref<Date | null>(null);
const billAmount = ref(0);
const members = ref<Member[]>([]);

const handleClose = () => {
    emit('update:open', false);
    billPlace.value = {} as Place;
    billDate.value = null;
    billAmount.value = 0;
    members.value = [];
};

const handleSubmit = async () => {
    try {
        if (!props.selectedBill) {
            await splitUpStore.addBill({
                placeId: billPlace.value.id,
                date: billDate.value,
                amount: billAmount.value,
            } as Bill);

        } else {
            await splitUpStore.updateBill({
                id: props.selectedBill.id,
                placeId: billPlace.value.id,
                date: billDate.value,
                amount: billAmount.value,
            } as Bill);
        }
        
        await addMemberToBill(members.value, props.selectedBill as Bill);
        
        splitUpStore.getBills();

        handleClose();

    } catch (error) {
        console.error('Error agregando nuevo participante:', error);
    }
};

watch(props, (newProps) => {
    if(newProps.selectedBill){
        billPlace.value = splitUpStore.places.find(p => p.id === newProps.selectedBill?.placeId) || {} as Place;
        billDate.value = newProps.selectedBill?.date ? new Date(newProps.selectedBill.date) : null;
        billAmount.value = newProps.selectedBill?.amount || 0;
        members.value = loadSelectedMembers.value;
    }else {
        billPlace.value = {} as Place;
        billDate.value = null; 
        billAmount.value = 0;
        members.value = [];
    }
});

/**
 * Agrega o elimina miembros de una factura según la selección actual.
 * @param selectedMembers 
 * @param bill 
 */
const addMemberToBill = async (selectedMembers: Member[], bill: Bill) => {
    if(!selectedMembers || !bill) return;

    const dbSelectedMembers = localBillMembers.value
        .filter(bm => bm.billId === bill.id);

    const currentIds = new Set(dbSelectedMembers.map(bm => bm.memberId)); //Mapea el ID de miembros actualmente asociados a la factura en la base de datos
    const newIds = new Set(selectedMembers.map(m => m.id)); //Mapea el ID de miembros seleccionados actualmente en la interfaz
    const toAdd = selectedMembers.filter(m => !currentIds.has(m.id)); //Crea una lista de miembros seleccionados que no están en la base de datos
    const toRemove = dbSelectedMembers.filter(bm => !newIds.has(bm.memberId)); //Crea una lista de miembros en la base de datos que no están seleccionados

    if (toAdd.length === 0 && toRemove.length === 0) return;

    for (const newBillMember of toAdd) {
        await splitUpStore.addBillMember(
            {
                billId: bill.id,
                memberId: newBillMember.id,
                amount: 0,
            } as BillMember
        );
    }

    for (const deletedBillMember of toRemove) {
        await splitUpStore.deleteBillMember(deletedBillMember);
    }

    await splitUpStore.getBillMembers();
}

const localBillMembers = computed(() => splitUpStore.billMembers);
const localMembers = computed(() => splitUpStore.members);

//Indice de miembros para mostrar los nombres de los miembros seleccionados
const membersMap = computed(() => {
    return new Map(localMembers.value.map(m => [m.id, m]));
});

const loadSelectedMembers = computed(() => {
    if(!props.selectedBill?.id) {
        return [];
    }

 return localBillMembers.value
        .filter(p => p.billId === props.selectedBill!.id)
        .map(p => membersMap.value.get(p.memberId))
        .filter(Boolean) as Member[];
});


</script>
