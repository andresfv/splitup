<template>
    <Dialog :open="open" @update:open="handleClose">
        <DialogContent @pointer-down-outside.prevent>
            <DialogHeader>
                <DialogTitle>Agregar Comercio</DialogTitle>
            </DialogHeader>
            
            <form @submit.prevent="handleSubmit">
                <div class="space-y-4">
                    <div>
                        <Label for="nameInput">
                            Nombre del Comercio
                        </Label>

                        <Input 
                            id="nameInput" 
                            v-model="placeName"
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
const placeName = ref('');

const handleClose = () => {
    emit('update:open', false);
    placeName.value = '';
};

const handleSubmit = async () => {
    try {
        splitUpStore.addPlace({
            name: placeName.value,
        } as Place);

        splitUpStore.getPlaces();

        handleClose();

    } catch (error) {
        console.error('Error agregando nuevo comercio:', error);
    }
};

</script>
