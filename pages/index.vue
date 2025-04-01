<script setup>
const { data: ret } = await useFetch('/api/user');
if (!ret.value) {
    // alert('Você não está logado')
  navigateTo('/login')
}
const logout = async () => {
  await $fetch('/api/logout')
  useCookie('auth_token').value = null
  navigateTo('/auth/login')
}
</script>

<template>
  <div><h3>Bem vindo {{ ret.user.nome }}</h3>
    <!-- {{ !user ? 'Carregando...' : user.name }} -->
    <br>
  <!-- <Button @click="logout">Sair</Button> -->
  </div>
</template>
