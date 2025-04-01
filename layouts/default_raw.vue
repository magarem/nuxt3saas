<script setup>

const { toggleDarkMode } = useLayout();
// toggleDarkMode()
onBeforeMount(() => {
    toggleDarkMode()
})
</script>

<template>
    <NuxtPage />
</template>