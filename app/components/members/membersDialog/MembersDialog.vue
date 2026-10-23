<template>
    <Dialog :open="open" @update:open="handleClose">
        <DialogContent @pointer-down-outside.prevent>
            <DialogHeader>
                <DialogTitle>Agregar Participante</DialogTitle>
            </DialogHeader>
            
            <form @submit.prevent="handleSubmit">
                <div class="space-y-4">
                    <div>
                        <Label for="nameInput">
                            Nombre del Participante
                        </Label>

                        <Input 
                            id="nameInput" 
                            v-model="memberName"
                            required 
                            class="mt-1"
                        />
                    </div>
                </div>
                
                <DialogFooter class="mt-6">
                    <Button type="button" variant="outline" @click="handleClose">
                        Cancelar
                    </Button>
                    <Button type="submit">
                        Agregar
                    </Button>
                </DialogFooter>
            </form>
        </DialogContent>
    </Dialog>
</template>

<script setup lang="ts">

interface Props {
    open: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits<{
    'update:open': [value: boolean];
}>();

const splitUpStore = useSplitUpStore();
const memberName = ref('');

const handleClose = () => {
    emit('update:open', false);
    memberName.value = '';
};

const handleSubmit = async () => {
    try {
        splitUpStore.addMember({
            name: memberName.value,
            active: true
        } as Member);

        splitUpStore.getMembers();

        handleClose();

    } catch (error) {
        console.error('Error agregando nuevo participante:', error);
    }
};

</script>
