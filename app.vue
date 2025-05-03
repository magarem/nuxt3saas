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