<template>
    <Dialog v-model:open="open">
        <DialogTrigger v-if="$slots.default" as-child>
            <slot />
        </DialogTrigger>

         <DialogOverlay class="opacity-10"/>

        <DialogContent>
            <DialogTitle> {{ props.title }} </DialogTitle>
             <DialogDescription class="mt-2"> {{ props.description }} </DialogDescription>

          <div class="flex justify-end gap-2 mt-6">
               <DialogClose as-child>
                    <Button class="px-3 py-1 border rounded">
                        Cancelar
                    </Button>
                </DialogClose>

              <Button class="px-3 py-1 bg-red-600 text-white rounded" @click="confirm">
                    Aceptar
                </Button>
            </div>
        </DialogContent>
    </Dialog>
</template>

<script setup lang="ts">
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogTitle,
    DialogTrigger,
    DialogClose,
    DialogOverlay,
} from '@/components/ui/dialog';

interface Props {
    title: string;
    description: string;
}

const props = defineProps<Props>();

//Permite abrir el dialog desde afuera (v-model:open) cuando no se usa el slot como trigger
const open = defineModel<boolean>('open', { default: false });

const emit = defineEmits<{
    (e: 'confirm'): void
}>();

const confirm = () => {
  emit('confirm')
  open.value = false
};

</script>

<style scoped></style>