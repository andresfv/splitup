<template>
    <Dialog :open="open" @update:open="handleClose">
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Agregar Factura</DialogTitle>
            </DialogHeader>
            
            <form @submit.prevent="handleSubmit">
                <div class="space-y-4">
                    <div>
                         <Label>
                            Comercio
                        </Label>

                        <AutoComplete v-model="billPlace"/>
                    </div>

                    <div>
                        <Label>
                            Fecha
                        </Label>

                        <DatePicker v-model="billDate" :placeholder="'Seleccione una fecha'" />
                    </div>

                    <div>
                        <Label>
                            Monto
                        </Label>

                        <MoneyInput v-model="billAmount" 
                        :placeholder="'Ingrese el monto de la factura'" />
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
import AutoComplete from '~/components/common/autoComplete/AutoComplete.vue';
import DatePicker from '~/components/common/datePicker/DatePicker.vue';
import MoneyInput from '~/components/common/moneyInput/MoneyInput.vue';


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

const handleClose = () => {
    emit('update:open', false);
    billPlace.value = {} as Place;
    billDate.value = null; 
    billAmount.value = 0;
};

const handleSubmit = async () => {
    try {
        if (!props.selectedBill) {
            await splitUpStore.addBill({
                placeId: billPlace.value.id,
                date: billDate.value,
                amount: billAmount.value,
                isPaid: false,
            } as Bill);
        } else {
            await splitUpStore.updateBill({
                id: props.selectedBill.id,
                placeId: billPlace.value.id,
                date: billDate.value,
                amount: billAmount.value,
                isPaid: props.selectedBill.isPaid,
            } as Bill);
        }
        
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
    }else {
        billPlace.value = {} as Place;
        billDate.value = null; 
        billAmount.value = 0;
    }
});

</script>
