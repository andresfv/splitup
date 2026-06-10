<template>
    <TooltipProvider :delay-duration="500" :hide-arrow="true">
        <Tooltip>
            <TooltipTrigger as-child>
                <slot />
            </TooltipTrigger>
            <TooltipContent side="bottom" align="center" :arrow-padding="0">
                <span>{{ message }}</span>
            </TooltipContent>
        </Tooltip>
    </TooltipProvider>
</template>

<script setup lang="ts">
interface Props {
    message: string;
}

defineProps<Props>();
</script>