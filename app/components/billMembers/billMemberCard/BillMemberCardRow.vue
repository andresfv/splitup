<template>

    <div :class="containerClass" @click="selectItem">

        <div class="min-w-0 wrap-break-words">
            {{ props.billItem.placeName }}
        </div>

        <div>
            {{ myFormatDate(props.billItem.date) }}
        </div>

        <div>
            <span v-if="!editMode">{{ myFormatCurrency(props.billItem.amount) }}</span>
            <MoneyInput v-else v-model="billItemAmount" 
                        ref="moneyInputRef"
                        :placeholder="'Ingrese el monto de la factura'" 
                         class="w-20 ml-1"/>
        </div>

        <div v-if="!isExporting">
            <div v-if="!editMode">
                <span v-if="props.billItem.isPaid" class="text-green-500">
                    ✓
                </span>

                <span v-if="!props.billItem.isPaid" class="text-red-500">
                    X
                </span>
            </div>

            <div v-else>
                <input type="checkbox" v-model="billItemIsPaid" class="ml-2" />
            </div>
        </div>
        
        <div v-if="!isExporting">
            <Button v-if="!editMode" class="cursor-pointer hover:scale-110 transition" 
                :size="'sm'" @click="enableEditMode">
                <EditIcon />
            </Button>

            <Button v-if="editMode" class="cursor-pointer hover:scale-110 transition mb-1"
            :size="'sm'" @click="updateBillItem()">
                <CheckIcon /> 
            </Button>

            <Button v-if="editMode" class="cursor-pointer hover:scale-110 transition"
            :size="'sm'" @click="editMode = false">
                <CancelIcon /> 
            </Button>
        </div>

    </div>

</template>

<script setup lang="ts">
import CancelIcon from '~/components/icons/CancelIcon.vue';
import CheckIcon from '~/components/icons/CheckIcon.vue';
import EditIcon from '~/components/icons/EditIcon.vue';
import MoneyInput from '~/components/common/moneyInput/MoneyInput.vue';

interface Props {
    billItem: BillMemberDetailsDTO;
    isExporting: boolean;
}

const props = defineProps<Props>();
const isBillItemSelected = ref<boolean>(false);

const containerClass = computed(() => [
  'grid',
  'text-center',
  'cursor-pointer',
  props.isExporting ? 'grid-cols-3' : 'grid-cols-5',
  isBillItemSelected.value ? 'font-bold text-blue-600 dark:text-blue-400' 
                            : 'hover:font-semibold hover:text-blue-600 dark:hover:text-blue-400',
]);

const emit = defineEmits<{
    updateBillItem: [billItem: BillMemberDetailsDTO];
    selectItem: [billItem: BillMemberDetailsDTO];
}>();

const moneyInputRef = ref<InstanceType<typeof MoneyInput> | null>(null);

function enableEditMode() {
    billItemAmount.value = props.billItem.amount;

    editMode.value = true;
    nextTick(() => {
        moneyInputRef.value?.$el?.focus();
    });
}

function updateBillItem() {

    const roundedAmount = roundNumber(billItemAmount.value, { decimals: 0 });

    const updatedBillItem: BillMemberDetailsDTO = {
        ...props.billItem,
        amount: roundedAmount,
        isPaid: billItemIsPaid.value
    };

    editMode.value = false;

    emit('updateBillItem', updatedBillItem);
}

function selectItem() {
    isBillItemSelected.value = !isBillItemSelected.value;

    //Solo actualiza la propiedad isSelected del billItem, el resto de las propiedades permanecen igual
    const selectedBillItem: BillMemberDetailsDTO = {
        ...props.billItem,
        isSelected: isBillItemSelected.value,
    };

    emit('selectItem', selectedBillItem);
}

const editMode = ref(false);

const billItemAmount = ref(props.billItem.amount)
const billItemIsPaid = ref(props.billItem.isPaid)

</script>