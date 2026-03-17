<!--
  Layout por defecto de la aplicación.
-->
<template>
  <SidebarProvider>
    <Sidebar class="w-52">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg">
              <div>
                <AppLogo class="h-6 w-6" />
              </div>
              <div class="grid flex-1 text-sm leading-tight -ml-2.5">
                <span class="truncate font-semibold">plitUp</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton as-child>
              <NuxtLink to="/bills">
                <span class="ml-2">Agregar Facturas</span>
              </NuxtLink>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton as-child>
              <NuxtLink to="/bills">
                <span class="ml-2">Dividir Facturas</span>
              </NuxtLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>

        <Collapsible>
          <SidebarGroup>
            <SidebarGroupLabel as-child>
              <CollapsibleTrigger class="group flex w-full items-center justify-between cursor-pointer">
                <span>Administrar</span>
                <span class="transition-transform group-data-[state=open]:rotate-90">
                  >
                </span>
              </CollapsibleTrigger>
            </SidebarGroupLabel>
            <CollapsibleContent>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton as-child>
                      <NuxtLink to="/manage/members">
                        <span>Participantes</span>
                      </NuxtLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                  <SidebarMenuItem>
                    <SidebarMenuButton as-child>
                      <NuxtLink to="/manage/places">
                        <span>Comercios</span>
                      </NuxtLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
    <SidebarInset>
     <div class="min-h-screen transition-colors duration-300">
        
      <header class="flex justify-end p-4">
          <ThemeToggle />
        </header>

        <NuxtPage />
      </div>
    </SidebarInset>
  </SidebarProvider>
  <Toaster position="bottom-center" :expand="true" :close-button="true" close-button-position="top-right" rich-colors />
</template>

<script setup lang="ts">
import { CollapsibleContent } from 'reka-ui';
import { Toaster } from 'vue-sonner';
import ThemeToggle from '~/components/common/themeToggle/ThemeToggle.vue';
import AppLogo from '~/components/icons/AppLogo.vue';


</script>