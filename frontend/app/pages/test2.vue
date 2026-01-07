<template>
    test2
</template>
<script lang="ts" setup>
    const queue = useQueue();
    // Your script logic here
    const {data} = useAsyncData('test-queue', () => $fetch(`${useRuntimeConfig().public.api}/auth/listing?page=1&per_page=10`, {
        credentials: 'include',
        headers: useRequestHeaders(['cookie']),
    }));
    console.log(data.value);
</script>