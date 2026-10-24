<template>

    <div :class="containerClass" @click="selectItem">

        <div class="min-w-0 wrap-break-words">
            {{ props.billItem.placeName }}
        </div>

        <div>
            {{ myFormatDate(props.billItem.date) }}
        </div>

        <div>
            <span v-if="!editMode || !draft">{{ myFormatCurrency(props.billItem.amount) }}</span>
            <MoneyInput v-else v-model="draft.amount"
                        :placeholder="'Ingrese el monto de la factura'"
                         class="w-20 ml-1"/>
        </div>

        <div v-if="!isExporting">
            <div v-if="!editMode || !draft">
                <span v-if="props.billItem.isPaid" class="text-green-500">
                    ✓
                </span>

                <span v-if="!props.billItem.isPaid" class="text-red-500">
                    X
                </span>
            </div>

            <div v-else>
                <input type="checkbox" v-model="draft.isPaid" class="ml-2" />
            </div>
        </div>

    </div>

</template>

<script setup lang="ts">
import MoneyInput from '~/components/common/moneyInput/MoneyInput.vue';

interface Props {
    billItem: BillMemberDetailsDTO;
    isExporting: boolean;
    editMode: boolean;
    draft?: BillItemDraftDTO;
}

const props = defineProps<Props>();
const isBillItemSelected = ref<boolean>(false);

const containerClass = computed(() => [
  'grid',
  'text-center',
  props.editMode ? '' : 'cursor-pointer',
  props.isExporting ? 'grid-cols-3' : 'grid-cols-4',
  isBillItemSelected.value ? 'font-bold text-blue-600 dark:text-blue-400'
                            : props.editMode ? '' : 'hover:font-semibold hover:text-blue-600 dark:hover:text-blue-400',
]);

const emit = defineEmits<{
    selectItem: [billItem: BillMemberDetailsDTO];
}>();

function selectItem() {
    //En modo edición no se seleccionan filas, para no interferir con los campos editables
    if (props.editMode) return;

    isBillItemSelected.value = !isBillItemSelected.value;

    //Solo actualiza la propiedad isSelected del billItem, el resto de las propiedades permanecen igual
    const selectedBillItem: BillMemberDetailsDTO = {
        ...props.billItem,
        isSelected: isBillItemSelected.value,
    };

    emit('selectItem', selectedBillItem);
}

</script>
