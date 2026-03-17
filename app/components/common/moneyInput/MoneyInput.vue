<template>
    <input ref="inputRef" />
</template>

<script setup lang="ts">

import { useCurrencyInput } from 'vue-currency-input'

interface Props {
    modelValue: number | null
    locale?: string
    currency?: string
    decimals?: number
    min?: number
    max?: number
    disabled?: boolean
}

const props = defineProps<Props>();

const emit = defineEmits<{
    (e: 'update:modelValue', value: number | null): void
}>()

const options = {
  locale: props.locale || 'es-CR',
  currency: props.currency || 'CRC',

  precision: props.decimals ?? 2,

  valueRange: {
    min: props.min,
    max: props.max,
  },

  hideCurrencySymbolOnFocus: false,
  hideGroupingSeparatorOnFocus: true,
  hideNegligibleDecimalDigitsOnFocus: true,
}

const { inputRef,
  numberValue,
  setValue,
  setOptions 
} = useCurrencyInput( options )

// sync externo → input
watch(
  () => props.modelValue,
  (val) => {
    setValue(val)
  },
  { immediate: true }
)

// emitir cambios
watch(numberValue, (val) => {
  emit('update:modelValue', val ?? null)
})

// por si cambian props dinámicamente
watch(
  () => [props.locale, props.currency, props.decimals, props.min, props.max],
  () => {
    setOptions({
      locale: props.locale || 'es-CR',
      currency: props.currency || 'CRC',
      precision: props.decimals ?? 2,
      valueRange: {
        min: props.min,
        max: props.max,
      },
    })
  }
)

</script>

<style scoped></style>