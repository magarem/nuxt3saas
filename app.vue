<script setup>
useHead({
  meta: [
    {
      name: 'viewport',
      content: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no'
    }
  ],
  htmlAttrs: {
    class: 'app-dark'
  }
})
</script>
<template>
  <NuxtLayout>
      <NuxtPage />
  </NuxtLayout>
</template>
<style scoped>
html, body {
  margin: 0;
  padding: 0;
  width: 100%;
  overflow-x: hidden;
}

</style>