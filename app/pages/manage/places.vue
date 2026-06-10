<template>
    <PlacesDialog v-model:open="modalOpen" />

    <div class="flex justify-center m-3">
        <h1>Lista de Comercios</h1>
    </div>

    <div class="grid grid-cols-4">
        <PlacesCard v-for="place in places" :key="place.id" :place="place" />
    </div>

    <MyFabButton @click="modalOpen = true" />

</template>

<script setup lang="ts">
import MyFabButton from '~/components/common/myFabButton/MyFabButton.vue';
import PlacesCard from '~/components/places/placesCard/PlacesCard.vue';
import PlacesDialog from '~/components/places/placesDialog/PlacesDialog.vue';
import { useSplitUpStore } from '~/stores/split-up';

const splitUpStore = useSplitUpStore();

const modalOpen = ref(false);

const places = computed(() => splitUpStore.places);

await useAsyncData('init-split-data', async () => {
    await splitUpStore.initData();
});

</script>