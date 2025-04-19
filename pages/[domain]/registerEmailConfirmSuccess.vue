<template>
  <div class="flex items-center justify-center min-h-screen min-w-[100vw] overflow-hidden bg-gray-100 dark:bg-gray-900">
    <div class="bg-white dark:bg-gray-800 shadow-lg rounded-md p-8 max-w-md w-full">
      <div class="text-center">
        <h1 class="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">
          E-mail Confirmado com Sucesso!
        </h1>
        <p class="text-gray-600 dark:text-gray-400 mb-6">
          Seu e-mail foi confirmado. Agora você pode fazer login na sua conta.
        </p>
        <Button label="Fazer Login" @click="goToLogin" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import Button from 'primevue/button'; // Se você estiver usando PrimeVue

const router = useRouter();

function goToLogin() {
  // Obtenha o 'domain' da rota para redirecionar corretamente
  const domain = route.params.domain;
  router.push(`/${domain}/login`);
}
</script>

<style scoped>
/* Estilos adicionais opcionais */
</style>