<template>

    <Sidebar class="w-52">
        <SidebarHeader>
            <SidebarMenu>
                <SidebarMenuItem>
                    <SidebarMenuButton size="lg" as-child>
                        <NuxtLink to="/">
                            <AppLogo class="h-6 w-6" />
                            <div class="grid flex-1 text-sm leading-tight">
                                <span class="truncate font-semibold">plitUp</span>
                            </div>
                        </NuxtLink>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
        </SidebarHeader>

        <SidebarContent>
            <SidebarMenu>
                <SidebarMenuItem v-for="item in mainNavItems" :key="item.to">
                    <SidebarMenuButton as-child :is-active="route.path === item.to">
                        <NuxtLink :to="item.to">
                            <component :is="item.icon" v-if="item.icon" class="h-4 w-4" />
                            <span :class="{ 'ml-2': !item.icon }">{{ item.label }}</span>
                        </NuxtLink>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>

            <CollapsibleNavGroup :group="manageGroup" />
        </SidebarContent>

        <SidebarRail />
    </Sidebar>

</template>

<script setup lang="ts">
import { mainNavItems, manageGroup } from '~/composables/useNavigation';
import AppLogo from '~/components/icons/AppLogo.vue';
import CollapsibleNavGroup from '../collapsibleNavGroup/CollapsibleNavGroup.vue';

const route = useRoute();
</script>
