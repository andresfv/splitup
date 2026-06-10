<template>

<TagsInput :modelValue="props.modelValue" class="w-full" :disabled="true">
    <TagsInputItem v-for="item in props.modelValue" :key="item" :value="item">
      <TagsInputItemText />
    </TagsInputItem>
  </TagsInput>

</template>

<script setup lang="ts">
import { TagsInput, TagsInputItem, TagsInputItemDelete, TagsInputItemText } from '@/components/ui/tags-input';

interface Props {
    modelValue: string[];
}

const props = defineProps<Props>();

// const emit = defineEmits<{
//     (e: 'update:modelValue', value: string[]): void;
// }>();

// const tags = computed({
//   get: () => props.modelValue,
//   set: (value: string[]) => emit('update:modelValue', value)
// });

</script>

