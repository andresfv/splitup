<template>
    <div>


        <Card class="m-1">
            <CardContent class="group/card">
                <div>
                    <div v-if="editMode">
                        <input ref="inputRef" v-model="localMember.name"
                            @keydown.enter="handleMemberUpdate" @blur="editCancel()"
                            @keydown.escape="editCancel()" class="border px-2 py-1 rounded" />
                    </div>

                    <div v-else>
                        <CardDescription>
                            <div class="relative">

                                <ConfirmDialog title="Eliminar participante"
                                    description="El participante será eliminado definitivamente"
                                    @confirm="handleMemberDelete(localMember)">
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
                            <CardTitle class="mt-2">{{ localMember.name }}</CardTitle>
                            <Button variant="ghost" size="icon-sm" @click="startEdit()"
                                class="rounded-full cursor-pointer opacity-0 group-hover/name:opacity-100 transition">
                                <EditIcon />
                            </Button>
                        </div>
                    </div>

                    <div class="flex items-center space-x-2 mt-4">
                        <input :id="`active-${localMember.id}`" type="checkbox" v-model="localMember.active"
                            @change="handleMemberUpdate()" />
                        <Label :for="`active-${localMember.id}`">Activo</Label>
                    </div>
                </div>
            </CardContent>
        </Card>
    </div>
</template>

<script setup lang="ts">
import { EditIcon, TrashIcon } from 'lucide-vue-next'
import { useSplitUpStore } from '../../../stores/split-up';
import ConfirmDialog from '~/components/common/confirmDialog/ConfirmDialog.vue';


const props = defineProps<Props>();
const editMode = ref(false);

const inputRef = ref<HTMLInputElement | null>(null)

const splitUpStore = useSplitUpStore();

interface Props {
    member: Member;
}

const localMember = ref({ ...props.member });

const startEdit = () => {
    editMode.value = true;

    nextTick(() => {
        inputRef.value?.focus()
    })
};

const handleMemberUpdate = async () => {
    await splitUpStore.updateMember(localMember.value);
    editMode.value = false
};

const handleMemberDelete = async (member: Member) => {
    await splitUpStore.deleteMember(member);
}

const editCancel = () => {
    editMode.value = false;
}

watch(
    () => props.member,
    (newValue) => {
        localMember.value = { ...newValue }
    },
    { immediate: true }
);

</script>

<style scoped></style>
