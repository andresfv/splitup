<template>
     <div class="flex flex-col sm:flex-row items-center justify-center gap-3 mt-4 mb-4">
       <div class="flex flex-col w-full items-center sm:w-auto">
            <label class="text-xs font-semibold text-gray-600 mb-1 sm:text-center">{{ labelFromDate || 'From:' }}</label>
            <DatePicker v-model="fromDate" :placeholder="'Seleccione una fecha de inicio'"/>
        </div>

        <div class="flex flex-col w-full items-center sm:w-auto">
            <label class="text-xs font-semibold text-gray-600 mb-1 sm:text-center">{{ labelToDate || 'To:' }}</label>
            <DatePicker v-model="toDate" :placeholder="'Seleccione una fecha de fin'"/>
        </div>
    </div>
</template>

<script setup lang="ts">
import DatePicker from '~/components/common/datePicker/DatePicker.vue';

const props = defineProps<Props>();

interface Props {
    labelFromDate?: string;
    labelToDate?: string;
}

const fromDate =  defineModel<Date | null>('fromDate', { type: Date, default: null });
const toDate =  defineModel<Date | null>('toDate', { type: Date, default: null });

</script>

