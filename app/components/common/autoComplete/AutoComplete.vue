<template>
    <div ref="root" class="relative w-full">
        <input v-model="query" @focus="isOpen = true" class="w-full border rounded px-3 py-2"
            placeholder="Buscar comercio..." />

        <div v-if="isOpen" class="absolute z-10 mt-1 w-full bg-white dark:bg-zinc-800 
             border rounded shadow-lg max-h-60 overflow-auto">
            <!-- Opciones existentes -->
            <div v-for="place in filtered" :key="place.id" @click="select(place)"
                class="px-3 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-700 cursor-pointer">
                {{ place.name }}
            </div>

            <!-- Crear nuevo -->
            <div v-if="showCreateOption" @click="createPlace" class="px-3 py-2 text-blue-600 dark:text-blue-400 
               hover:bg-zinc-100 dark:hover:bg-zinc-700 cursor-pointer">
                Crear "{{ query }}"
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onClickOutside, useEventListener } from '@vueuse/core';

// Agregar props para v-model
interface Props {
    modelValue?: Place | null;
}

const props = defineProps<Props>();

const splitUpStore = useSplitUpStore();

// Cambiar emits para soportar v-model
const emit = defineEmits<{
    'update:modelValue': [value: Place | null];
    'select': [value: Place];
}>();

const query = ref('')
const isOpen = ref(false)
const root = ref<HTMLElement | null>(null)

const places = computed(() => splitUpStore.places);

const filtered = computed(() => {
    if (!query.value) return places.value;
    
    return places.value.filter(p =>
        p?.name?.toLowerCase().includes(query.value.toLowerCase())
    )
})

// Sincronizar query con modelValue cuando hay un valor seleccionado
watch(() => props.modelValue, (newValue) => {
    if (newValue?.name) {
        query.value = newValue.name;
    } else {
        query.value = '';
    }
}, { immediate: true });

onMounted(() => {
    splitUpStore.getPlaces();
})

onClickOutside(root, () => {
  isOpen.value = false
})

useEventListener(window, 'keydown', (e: KeyboardEvent) => {
  if (e.key === 'Escape') {
    isOpen.value = false
  }
})

const select = (place: Place) => {
    query.value = place.name
    isOpen.value = false
    // Emitir ambos eventos
    emit('update:modelValue', place);
    emit('select', place);
}

const createPlace = async () => {

    const newPlace = {
        name: query.value
    } as Place;

    const createdPlace = await splitUpStore.addPlace(newPlace);

    if (!createdPlace) {
        return;
    }

    select(createdPlace);
}

const showCreateOption = computed(() =>
    query.value &&
    !filtered.value.some(p =>
        p?.name?.toLowerCase() === query.value?.toLowerCase()
    )
)

</script>
