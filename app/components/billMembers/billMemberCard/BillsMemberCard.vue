<template>
    <div class="relative">

        <div v-if="!isExporting" class="absolute top-3 right-3">
            <MyDropdownMenu>
                <DropdownMenuItem class="cursor-pointer" :disabled="editMode || !billsByMemberAndBetween.length"
                    @select="enableEditMode">
                    <EditIcon />
                    Editar
                </DropdownMenuItem>
                <DropdownMenuItem class="cursor-pointer" :disabled="editMode || billSummary.pending <= 0"
                    @select="handleMarkAsPaid">
                    <CheckCheckIcon />
                    Marcar todo como pagado
                </DropdownMenuItem>
                <DropdownMenuItem class="cursor-pointer" :disabled="editMode" @select="handleExportPng">
                    <ImageDownIcon />
                    Exportar
                </DropdownMenuItem>
            </MyDropdownMenu>
        </div>

        <div ref="htmlContainerRef" class="w-full bg-secondary shadow-xl rounded-md p-5 text-sm">

            <div class="px-8">
                <BillMemberCardHeader :persona="props.member.name" :fechaDesde="fromDate" :fechaHasta="toDate" />
            </div>

            <div class="border-t border-dashed border-accent-foreground my-4"></div>

            <BillMemberCardBody :billItems="billsByMemberAndBetween" :isExporting :editMode :drafts />

            <div class="border-t border-dashed border-accent-foreground my-4"></div>

            <BillMemberCardFooter :montoTotal="billSummary.total"
                :montoPagado="billSummary.paid" :montoPendiente="billSummary.pending"
                :isExporting="isExporting"
                :editMode="editMode"
                :montoSeleccionados="billMembersSelectedAmount"
                @save="saveEdit" @cancel="cancelEdit"/>

        </div>

    </div>
</template>

<script setup lang="ts">
import { convertHtmlToPng } from '~/utils/convertHtmlToPng.js';
import { EditIcon, CheckCheckIcon, ImageDownIcon } from '@lucide/vue';
import MyDropdownMenu from '~/components/common/myDropdownMenu/MyDropdownMenu.vue';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import BillMemberCardBody from './BillMemberCardBody.vue'
import BillMemberCardFooter from './BillMemberCardFooter.vue'
import BillMemberCardHeader from './BillMemberCardHeader.vue'

interface Props {
    member: Member;
    fromDate: Date ;
    toDate: Date ;
}

const props = defineProps<Props>();

const splitUpStore = useSplitUpStore();

const htmlContainerRef = ref<HTMLElement | null>(null);
const isExporting = ref(false);

//Modo edición en bloque: los cambios se guardan en drafts hasta confirmar con Guardar
const editMode = ref(false);
const drafts = ref<Record<number, BillItemDraftDTO>>({});

/**
 * Obtiene las facturas del miembro dentro del rango de fechas
 */
const billsByMemberAndBetween = computed<BillMemberDetailsDTO[]>(() => {
    return splitUpStore.getMemberBillItemsBetweenDates(props.member.id, props.fromDate, props.toDate);
});

const handleMarkAsPaid = () => {
    splitUpStore.payAllBillMemberItems( billsByMemberAndBetween.value );
};

const handleExportPng = async () => {
    isExporting.value = true;

    const fileName = `factura_${props.member.name}_${props.fromDate.toISOString().split('T')[0]}_${props.toDate.toISOString().split('T')[0]}.png`;
    await convertHtmlToPng(htmlContainerRef.value, { fileName, backgroundColor: '#171717' });

    isExporting.value = false;
}

function enableEditMode() {
    drafts.value = Object.fromEntries(
        billsByMemberAndBetween.value.map(item => [item.id, { amount: item.amount, isPaid: item.isPaid }])
    );
    editMode.value = true;
}

function cancelEdit() {
    editMode.value = false;
    drafts.value = {};
}

async function saveEdit() {
    //Solo se envían las facturas que cambiaron
    const changedItems: BillMemberDetailsDTO[] = [];

    for (const item of billsByMemberAndBetween.value) {
        const draft = drafts.value[item.id];
        if (!draft) continue;

        const roundedAmount = roundNumber(draft.amount, { decimals: 0 });

        if (roundedAmount !== item.amount || draft.isPaid !== item.isPaid) {
            changedItems.push({ ...item, amount: roundedAmount, isPaid: draft.isPaid });
        }
    }

    await splitUpStore.updateBillItems(changedItems);

    cancelEdit();
}

const billSummary = computed<BillSummaryDTO>(() => {
    return splitUpStore.getMemberBillSummary(props.member.id, props.fromDate, props.toDate);
});

const billMembersSelectedAmount = computed<number>(() => {
    let billMembersSelectedAmount = 0;
    const billMembersSelected = splitUpStore.billMembersSelected.filter(billItem => billItem.memberId === props.member.id);

    for (const billItem of billMembersSelected) {
            billMembersSelectedAmount += billItem.amount;
    }
    return billMembersSelectedAmount;
});

</script>
