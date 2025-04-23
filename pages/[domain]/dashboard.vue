<template>
  <div>
    <h1>Bem-vindo, {{ ret.user?.username }}!</h1>
  </div>
</template>

<script setup>
const { data: ret } = await useFetch("/api/user"); 
</script>
