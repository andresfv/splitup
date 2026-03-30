<template>
    <MembersDialog v-model:open="modalOpen" />

    <div class="flex justify-center m-3">
        <h1>Lista de Participantes</h1>
    </div>

    <div class="grid grid-cols-4">
        <MembersCard v-for="member in members" :key="member.id" :member="member" />
    </div>

    <MyFabButton @click="modalOpen = true" />

</template>

<script setup lang="ts">
import MyFabButton from '~/components/common/myFabButton/MyFabButton.vue';
import MembersCard from '~/components/members/membersCard/MembersCard.vue';
import MembersDialog from '~/components/members/membersDialog/MembersDialog.vue';


const splitUpStore = useSplitUpStore();

const modalOpen = ref(false);

const members = computed(() => splitUpStore.members);


await useAsyncData('init-split-data', async () => {
    await splitUpStore.initData();
});

</script>