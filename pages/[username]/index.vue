<template>
  <div>
    <h1>Bem-vindo, {{ ret.user.username }}!</h1>
  </div>
</template>

<script setup>
const route = useRoute();
const username = route.params.username;

const { data: ret } = await useFetch("/api/" + username + "/user");

// Aqui você pode buscar os dados da empresa usando o parâmetro 'empresa'
// e renderizar o conteúdo específico para essa empresa.
</script>
