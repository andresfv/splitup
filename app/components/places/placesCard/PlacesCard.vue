<template>
    <div>
        <Card class="m-1">
            <CardContent class="group/card">
                <div>
                    <div v-if="editMode">
                        <input ref="inputRef" v-model="localPlace.name" @keydown.enter="handlePlaceUpdate"
                            @blur="editCancel()" @keydown.escape="editCancel()" class="border px-2 py-1 rounded" />
                    </div>

                    <div v-else>
                        <CardDescription>
                            <div class="relative">

                                <ConfirmDialog title="Eliminar comercio"
                                    description="El comercio será eliminado definitivamente"
                                    @confirm="handlePlaceDelete">
                                    <Button variant="ghost" size="icon-sm"
                                        class="absolute -top-4 -right-4 rounded-full cursor-pointer opacity-0 group-hover/card:opacity-100 transition">
                                        <TrashIcon />
                                    </Button>
                                </ConfirmDialog>

                            </div>
                            <div class="flex">
                                <span> Nombre </span>
                            </div>

                        </CardDescription>

                        <div class="flex items-center gap-2 group/name">
                            <CardTitle class="mt-2">{{ localPlace.name }}</CardTitle>
                            <Button variant="ghost" size="icon-sm" @click="startEdit()"
                                class="rounded-full cursor-pointer opacity-0 group-hover/name:opacity-100 transition">
                                <EditIcon />
                            </Button>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    </div>
</template>

<script setup lang="ts">
import { EditIcon, TrashIcon } from '@lucide/vue'
import { useSplitUpStore } from '../../../stores/split-up';
import ConfirmDialog from '~/components/common/confirmDialog/ConfirmDialog.vue';


const props = defineProps<Props>();
const editMode = ref(false);

const inputRef = ref<HTMLInputElement | null>(null)

const localPlace = ref({ ...props.place })

const splitUpStore = useSplitUpStore();

interface Props {
    place: Place;
}

const startEdit = () => {
    editMode.value = true;

    nextTick(() => {
        inputRef.value?.focus()
    })
};

const handlePlaceUpdate = async () => {
    await splitUpStore.updatePlace(localPlace.value);
    editMode.value = false
};

const handlePlaceDelete = async () => {
    await splitUpStore.deletePlace(localPlace.value);
}

const editCancel = () => {
    editMode.value = false;
}

watch(
    () => props.place,
    (newValue) => {
        localPlace.value = { ...newValue }
    },
    { immediate: true }
);

</script>

<style scoped></style>
