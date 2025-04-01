<template>
    <div>
      <h1>Bem-vindo, {{ username }}!</h1>
      </div>
  </template>
  
  <script setup>
  const route = useRoute();
  const username = route.params.username;
  
  // Aqui você pode buscar os dados da empresa usando o parâmetro 'empresa'
  // e renderizar o conteúdo específico para essa empresa.
  </script>