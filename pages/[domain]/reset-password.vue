<template>
    <div class="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 px-4">
      <div class="w-full max-w-md p-8 bg-gray-800/80 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-700">
        <h1 class="text-3xl font-semibold text-white text-center mb-6 tracking-tight">
          🔐 Redefinir Senha
        </h1>
  
        <!-- <p v-if="token" class="text-xs text-gray-400 text-center mb-4 break-words">
          Token: {{ token }}
        </p> -->
  
        <form @submit.prevent="resetPassword" class="space-y-5">
          <div>
            <label for="newPassword" class="block text-sm font-medium text-gray-300 mb-1">
              Nova Senha
            </label>
            <input
              type="password"
              id="newPassword"
              v-model="newPassword"
              required
              class="block w-full px-4 py-2 bg-gray-700 text-white placeholder-gray-400 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
              placeholder="Digite a nova senha"
            />
          </div>
  
          <div>
            <label for="confirmPassword" class="block text-sm font-medium text-gray-300 mb-1">
              Confirmar Nova Senha
            </label>
            <input
              type="password"
              id="confirmPassword"
              v-model="confirmPassword"
              required
              class="block w-full px-4 py-2 bg-gray-700 text-white placeholder-gray-400 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
              placeholder="Repita a nova senha"
            />
          </div>
  
          <button
            type="submit"
            class="w-full flex justify-center items-center gap-2 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150"
          >
            Redefinir Senha
          </button>
  
          <div v-if="resetPasswordMessage" class="text-sm text-center text-green-400">
            {{ resetPasswordMessage }}
          </div>
  
          <div v-if="resetPasswordError" class="text-sm text-center text-red-400">
            {{ resetPasswordError }}
          </div>
        </form>
      </div>
    </div>
  </template>
  
  
  <script setup>
  definePageMeta({
  layout: false // ou 'empty'
});
  import { ref, onMounted } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  
  const route = useRoute();
  const router = useRouter();
  const token = route.query.token;
  const domain = route.params.domain;

  const newPassword = ref('');
  const confirmPassword = ref('');
  const resetPasswordMessage = ref('');
  const resetPasswordError = ref('');
  
  onMounted(() => {
    // Verificar se o token está presente (opcional)
    if (!token) {
      resetPasswordError.value = 'Token de redefinição de senha inválido.';
    }
  });
  
  const resetPassword = async () => {
  
    resetPasswordMessage.value = '';

    resetPasswordError.value = '';
  
    if (!newPassword.value || !confirmPassword.value) {
      resetPasswordError.value = 'Por favor, insira a nova senha e confirme.';
      return;
    }
  
    if (newPassword.value !== confirmPassword.value) {
      resetPasswordError.value = 'As senhas não coincidem.';
      return;
    }
  
    try {
      const response = await $fetch(`/api/${domain}/reset-password`, {
        method: 'POST',
        body: { token: token, newPassword: newPassword.value }
      });
  
      if (response.success) {
        resetPasswordMessage.value = response.message || 'Senha redefinida com sucesso. Redirecionando para login...';
        setTimeout(() => {
          router.push(`/${domain}/auth/login`); // Redirecionar para login
        }, 1000); // Aguardar 3 segundos antes de redirecionar
      } else {
        resetPasswordError.value = response.message || 'Falha ao redefinir a senha.';
      }
    } catch (error) {
      console.error('Erro ao redefinir senha:', error);
      resetPasswordError.value = 'Ocorreu um erro ao processar sua solicitação. Tente novamente.';
    }
  };
  </script>
  
  <style scoped>
  .reset-password-form {
    /* Seus estilos CSS */
  }
  .success-message {
    color: green;
  }
  .error-message {
    color: red;
  }
  </style>