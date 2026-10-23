<template>
    <Dialog :open="open" @update:open="handleClose">
        <DialogContent @pointer-down-outside.prevent>
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
                        :placeholder="'Ingrese el monto de la factura'" 
                        required="true"/>
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
                        Cerrar
                    </Button>
                    <Button type="submit">
                        Guardar
                    </Button>
                </DialogFooter>
            </form>
        </DialogContent>
    </Dialog>
</template>

<script setup lang="ts">
import { toast } from 'vue-sonner';
import DatePicker from '~/components/common/datePicker/DatePicker.vue';
import MoneyInput from '~/components/common/moneyInput/MoneyInput.vue';
import MembersMultiSelect from '~/components/members/membersMultiSelect/MembersMultiSelect.vue';
import PlaceAutoComplete from '../placeAutoComplete/PlaceAutoComplete.vue';


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
    if (!billPlace.value?.id) {
        toast.error('El comercio es requerido');
        return;
    }
    if (!billDate.value) {
        toast.error('La fecha es requerida');
        return;
    }
    if (!billAmount.value || billAmount.value <= 0) {
        toast.error('El monto debe ser mayor a cero');
        return;
    }

    try {
        let bill = props.selectedBill;
        const isNewBill = bill == null;

        billAmount.value = roundNumber(billAmount.value, { decimals: 0 });

        if (bill == null) {
           bill = await splitUpStore.addBill({
                placeId: billPlace.value.id,
                date: billDate.value,
                amount: billAmount.value,
            } as Bill);

        } else {
            await splitUpStore.updateBill({
                id: bill.id,
                placeId: billPlace.value.id,
                date: billDate.value,
                amount: billAmount.value,
            } as Bill);
        }
        
        await addMemberToBill(members.value, bill);
        
        splitUpStore.getBills();

        if(isNewBill){
            //Limpia los campos del formulario después de guardar excepto el de fecha
            billPlace.value = {} as Place;
            billAmount.value = 0;
            members.value = [];
        }else {
            handleClose();
        }

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
const addMemberToBill = async (selectedMembers: Member[], bill: Bill | undefined) => {

    if(!selectedMembers || !bill) return;
    
    const dbSelectedMembers = localBillMembers.value.filter(bm => bm.billId === bill.id);
        
    if (selectedMembers.length === 0 && dbSelectedMembers.length === 0) return;

    //Primero eliminamos todos los miembros de la factura en DB
    for (const deletedBillMember of dbSelectedMembers) {
        await splitUpStore.deleteBillMember(deletedBillMember);
    }

    //Luego agregamos todos los miembros seleccionados en interfaz a la factura en DB
    for (const newBillMember of selectedMembers) {
        await splitUpStore.addBillMember(
            {
                billId: bill.id,
                memberId: newBillMember.id,
                amount: roundNumber(bill.amount / selectedMembers.length, { decimals: 0 }), //Distribuye el monto de la factura entre los miembros seleccionados
            } as BillMember
        );
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
