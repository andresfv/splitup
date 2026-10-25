<template>
    <Collapsible v-model:open="open" class="mx-4 mt-2 rounded-md border bg-secondary text-left">
        <CollapsibleTrigger class="group flex w-full items-center justify-between px-4 py-3 cursor-pointer">
            <div class="flex items-center gap-2 font-semibold">
                <ListFilterIcon class="h-4 w-4" />
                <span>Filtros</span>
                <span v-if="activeFiltersCount > 0"
                    class="rounded-full bg-primary px-2 text-xs text-primary-foreground">
                    {{ activeFiltersCount }}
                </span>
            </div>
            <ChevronDownIcon class="h-4 w-4 transition-transform group-data-[state=open]:rotate-180" />
        </CollapsibleTrigger>

        <CollapsibleContent
            class="overflow-hidden data-[state=open]:animate-collapsible-down data-[state=closed]:animate-collapsible-up">
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 px-4 pb-4">

                <!-- Estado de pago -->
                <div class="flex flex-col gap-1">
                    <label class="text-xs font-semibold text-muted-foreground">Estado de pago</label>
                    <Select v-model="draft.status">
                        <SelectTrigger class="w-full cursor-pointer">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Todos</SelectItem>
                            <SelectItem value="pending">Pendientes</SelectItem>
                            <SelectItem value="paid">Pagadas</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <!-- Comercio -->
                <div class="flex flex-col gap-1">
                    <label class="text-xs font-semibold text-muted-foreground">Comercio</label>
                    <Combobox v-model="placeValue">
                        <ComboboxAnchor as-child>
                            <ComboboxTrigger as-child>
                                <Button variant="outline" class="w-full justify-between font-normal cursor-pointer">
                                    <span class="truncate">{{ selectedPlaceName }}</span>
                                    <ChevronsUpDownIcon class="h-4 w-4 opacity-50" />
                                </Button>
                            </ComboboxTrigger>
                        </ComboboxAnchor>

                        <ComboboxList class="w-(--reka-combobox-trigger-width)">
                            <ComboboxInput placeholder="Buscar comercio..." :display-value="() => ''" />
                            <ComboboxEmpty>No se encontraron comercios.</ComboboxEmpty>
                            <ComboboxViewport class="max-h-60">
                                <ComboboxGroup>
                                    <ComboboxItem value="all">
                                        Todos
                                        <ComboboxItemIndicator class="ml-auto">
                                            <CheckIcon class="h-4 w-4" />
                                        </ComboboxItemIndicator>
                                    </ComboboxItem>
                                    <ComboboxItem v-for="place in places" :key="place.id" :value="place.id">
                                        {{ place.name }}
                                        <ComboboxItemIndicator class="ml-auto">
                                            <CheckIcon class="h-4 w-4" />
                                        </ComboboxItemIndicator>
                                    </ComboboxItem>
                                </ComboboxGroup>
                            </ComboboxViewport>
                        </ComboboxList>
                    </Combobox>
                </div>

                <!-- Participante -->
                <div class="flex flex-col gap-1">
                    <label class="text-xs font-semibold text-muted-foreground">Participante</label>
                    <Select v-model="memberValue">
                        <SelectTrigger class="w-full cursor-pointer">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Todos</SelectItem>
                            <SelectItem v-for="member in members" :key="member.id" :value="String(member.id)">
                                {{ member.name }}
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <!-- Ordenamiento -->
                <div class="flex flex-col gap-1">
                    <label class="text-xs font-semibold text-muted-foreground">Ordenar por</label>
                    <Select v-model="draft.sortBy">
                        <SelectTrigger class="w-full cursor-pointer">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="none">Sin orden</SelectItem>
                            <SelectItem value="place-asc">Comercio ascendente (A-Z)</SelectItem>
                            <SelectItem value="place-desc">Comercio descendente (Z-A)</SelectItem>
                            <SelectItem value="date-asc">Fecha ascendente</SelectItem>
                            <SelectItem value="date-desc">Fecha descendente</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div class="flex justify-end gap-2 px-4 pb-4">
                <Button variant="outline" class="cursor-pointer" @click="clearFilters">
                    <XIcon />
                    Limpiar filtros
                </Button>
                <Button class="cursor-pointer" @click="applyFilters">
                    <CheckIcon />
                    Aplicar filtros
                </Button>
            </div>
        </CollapsibleContent>
    </Collapsible>
</template>

<script setup lang="ts">
import { CheckIcon, ChevronDownIcon, ChevronsUpDownIcon, ListFilterIcon, XIcon } from '@lucide/vue';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
    Combobox,
    ComboboxAnchor,
    ComboboxEmpty,
    ComboboxGroup,
    ComboboxInput,
    ComboboxItem,
    ComboboxItemIndicator,
    ComboboxList,
    ComboboxTrigger,
    ComboboxViewport,
} from '@/components/ui/combobox';

const splitUpStore = useSplitUpStore();
const { billMembersFilter, places, members } = storeToRefs(splitUpStore);

//El panel inicia contraído
const open = ref(false);

//Copia de trabajo de los filtros, solo se aplica al presionar "Aplicar filtros"
const draft = ref<BillMembersFilterDTO>({ ...billMembersFilter.value });

//Al abrir el panel se descartan cambios no aplicados y se muestran los filtros vigentes
watch(open, (isOpen) => {
    if (isOpen) {
        draft.value = { ...billMembersFilter.value };
    }
});

//Los componentes Select/Combobox no admiten null, se usa 'all' como valor para "Todos"
const placeValue = computed<number | 'all'>({
    get: () => draft.value.placeId ?? 'all',
    set: (value) => {
        draft.value.placeId = value === 'all' ? null : value;
    },
});

const memberValue = computed<string>({
    get: () => draft.value.memberId === null ? 'all' : String(draft.value.memberId),
    set: (value) => {
        draft.value.memberId = value === 'all' ? null : Number(value);
    },
});

const selectedPlaceName = computed(() => {
    if (draft.value.placeId === null) return 'Todos';

    return places.value.find(p => p.id === draft.value.placeId)?.name ?? 'Todos';
});

//Cantidad de filtros aplicados distintos al valor por defecto
const activeFiltersCount = computed(() => {
    const { status, placeId, memberId, sortBy } = billMembersFilter.value;

    return [status !== 'all', placeId !== null, memberId !== null, sortBy !== 'none']
        .filter(Boolean).length;
});

const applyFilters = () => {
    splitUpStore.applyBillMembersFilter(draft.value);
};

const clearFilters = () => {
    splitUpStore.resetBillMembersFilter();
    draft.value = { ...billMembersFilter.value };
};

</script>
