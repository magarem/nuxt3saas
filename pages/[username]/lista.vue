<template>
    <div>
      <h1>Lista de Contatos de {{ username }}</h1>
      <ul>
        <li v-for="contato in contatos" :key="contato.id">
          {{ contato.nome }} - {{ contato.email }} - {{ contato.telefone }}
        </li>
      </ul>
    </div>
  </template>
  
  <script setup>
  const route = useRoute();
  const username = route.params.username;
  const { data: contatos } = await useFetch(`/api/${username}/lista`);
  </script>