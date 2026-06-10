<template>

  <Popover>
        <PopoverTrigger as-child>
          <MyTagsInput :modelValue="selectedMemberNames" :disabled="true" />
        </PopoverTrigger>

        <PopoverContent class="w-64 p-2 space-y-1">
            <div v-for="item in options" :key="item.id"
                class="flex items-center gap-2 px-2 py-1 rounded hover:bg-muted cursor-pointer">
                <input type="checkbox" :checked="isSelected(item)" @change="toggle(item)"/>
                <span>{{ item.name }}</span>
            </div>
        </PopoverContent>
    </Popover>

</template>

<script setup lang="ts">
import MyTagsInput from '~/components/common/myTagsInput/MyTagsInput.vue';

const splitUpStore = useSplitUpStore();

interface Props {
    modelValue: Member[];
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: Member[]): void
}>()

// helper para saber si está seleccionado
const isSelected = (member: Member) => {
  return props.modelValue.some(p => p.id === member.id)
}

// toggle selección
const toggle = (member: Member) => {
  if (isSelected(member)) {
    emit(
      'update:modelValue',
      props.modelValue.filter(p => p.id !== member.id)
    )
  } else {
    emit('update:modelValue', [...props.modelValue, member]);
  }
};

const selectedMemberNames = computed(() => {
  if (!props.modelValue || props.modelValue.length === 0) return ['Sin personas seleccionadas'];
 return props.modelValue
        .map(member => member.name)
        .filter(Boolean);
});

const options = computed(() => splitUpStore.members);


</script>