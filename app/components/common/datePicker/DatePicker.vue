<template>
  <Popover v-slot="{ close }">
    <PopoverTrigger as-child>
      <Button
        variant="outline"
        :class="cn('w-[240px] justify-start text-left font-normal', !date && 'text-muted-foreground')"
      >
        <CalendarIcon />
        {{ date ? df.format(date.toDate(getLocalTimeZone())) : props.placeholder || '' }}
      </Button>
    </PopoverTrigger>
    <PopoverContent class="w-auto p-0" align="start">
      <Calendar
         v-model="date"
        :default-placeholder="defaultPlaceholder"
        :min-value="minValueDV"
        :max-value="maxValueDV"
        :week-starts-on="props.weekStartsOn ?? 1"
        @update:model-value="close"
      />
    </PopoverContent>
  </Popover>
</template>

<script setup lang="ts">
import type { DateValue } from '@internationalized/date';
import { DateFormatter, fromDate, getLocalTimeZone, toCalendarDate, today } from '@internationalized/date';
import { cn } from '@/lib/utils';
import { CalendarIcon } from '@lucide/vue';

interface Props {
    modelValue: Date | null;
    placeholder?: string;
    locale?: string;
    minValue?: Date | null;
    maxValue?: Date | null;
    disabled?: boolean;
    weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: Date | null): void
}>();

const defaultPlaceholder = today(getLocalTimeZone())
const df = computed(() =>
  new DateFormatter(props.locale || 'en-US', {
    dateStyle: 'long',
  })
)

const date = computed<DateValue | undefined>({
  get: () => {
    if(!props.modelValue) return undefined;

    //Date -> DateValue
    return fromDate(props.modelValue, getLocalTimeZone());
  },

  set: (val) => {
    if(!val){
    emit('update:modelValue', null)
    return;
    }
    //DateValue -> Date
    const jsDate = val.toDate(getLocalTimeZone());
    emit('update:modelValue', jsDate);
  },
})

const minValueDV = computed(() => {
  if (!props.minValue) return undefined
  return fromDate(props.minValue, getLocalTimeZone())
})

const maxValueDV = computed(() => {
  if (!props.maxValue) return undefined
  return fromDate(props.maxValue, getLocalTimeZone())
})
</script>

<style lang="scss" scoped>

</style>