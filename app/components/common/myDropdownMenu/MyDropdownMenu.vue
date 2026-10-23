<template>
    <DropdownMenu>
        <DropdownMenuTrigger as-child>
            <Button variant="ghost" size="icon-sm" class="rounded-full cursor-pointer" aria-label="Opciones">
                <EllipsisVerticalIcon />
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
            <slot />
        </DropdownMenuContent>
    </DropdownMenu>
</template>

<script setup lang="ts">
import { EllipsisVerticalIcon } from '@lucide/vue';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

</script>

<style scoped></style>
