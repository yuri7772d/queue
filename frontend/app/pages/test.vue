<template>
    <div class="p-4">
        <Call @selectDay="onSelectDay" />
    </div>

</template>
<script lang="ts" setup>
    function onSelectDay(day: Day) {
        console.log("Selected day:", day.date?.toISOString(), "Status:", day.status);
    }
</script>
