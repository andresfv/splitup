<template>
    <Collapsible :default-open="group.items.some(i => route.path.startsWith(i.to))">
        <SidebarGroup>
            <SidebarGroupLabel as-child>
                <CollapsibleTrigger class="group flex w-full items-center justify-between cursor-pointer">
                    <span>{{ group.label }}</span>
                    <ChevronRight class="h-4 w-4 transition-transform group-data-[state=open]:rotate-90" />
                </CollapsibleTrigger>
            </SidebarGroupLabel>
            <CollapsibleContent>
                <SidebarGroupContent>
                    <SidebarMenu>
                        <SidebarMenuItem v-for="item in group.items" :key="item.to">
                            <SidebarMenuButton as-child :is-active="route.path === item.to">
                                <NuxtLink :to="item.to">
                                    <component :is="item.icon" v-if="item.icon" class="h-4 w-4" />
                                    <span :class="{ 'ml-2': !item.icon }">{{ item.label }}</span>
                                </NuxtLink>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarGroupContent>
            </CollapsibleContent>
        </SidebarGroup>
    </Collapsible>
</template>

<script setup lang="ts">

import { ChevronRight } from '@lucide/vue';
import type { NavGroup } from '~/composables/useNavigation';

defineProps<{
  group: NavGroup
}>();

const route = useRoute();

</script>
