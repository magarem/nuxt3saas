<template>
  <div>
    <h1>Bem-vindo, {{ ret.user.username }}!</h1>
  </div>
</template>

<script setup>
const route = useRoute();
const username = route.params.username;
console.log('username>>>>:::', username);
const { data: ret } = await useFetch("/api/" + username + "/user"); 
if (!ret.value?.user) {
  // Redireciona para a página de login
  navigateTo("/" + username + "/auth/login");
}
// Aqui você pode buscar os dados da empresa usando o parâmetro 'empresa'
// e renderizar o conteúdo específico para essa empresa.
</script>
