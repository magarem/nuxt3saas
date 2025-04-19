<template>
    <div class="bg-surface-50 dark:bg-surface-950 flex items-center justify-center min-h-screen min-w-[100vw] overflow-hidden">
      <div class="flex flex-col items-center justify-center">
        <div style="border-radius: 20px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
          <div class="w-full bg-surface-0 dark:bg-surface-900 py-15 px-8 sm:px-20" style="border-radius: 53px">
            <div class="text-center mb-8">
              <h1 class="text-surface-900 dark:text-surface-0 text-3xl font-medium mb-4">Criar Conta</h1>
            </div>
  
            <div>
              <form @submit.prevent="register">
                <div>
                  <label for="username" class="block text-surface-900 dark:text-surface-0 text-sm font-medium mb-2">Username</label>
                  <InputText id="username" type="text" placeholder="Username" class="w-full md:w-[30rem] mb-4" v-model="registrationData.username" />
                  <small v-if="submitted && !registrationData.username" class="text-red-500">Username é obrigatório.</small>
                </div>
  
                <div>
                  <label for="email" class="block text-surface-900 dark:text-surface-0 font-medium text-sm mb-2">Email</label>
                  <InputText id="email" type="email" placeholder="Email" class="w-full md:w-[30rem] mb-4" v-model="registrationData.email" />
                  <small v-if="submitted && !registrationData.email" class="text-red-500">Email é obrigatório.</small>
                </div>
  
                <div>
                  <label for="password" class="block text-surface-900 dark:text-surface-0 font-medium text-sm mb-2">Senha</label>
                  <Password id="password" v-model="registrationData.password" placeholder="Senha" :toggleMask="true" class="mb-4" fluid :feedback="false"></Password>
                  <small v-if="submitted && !registrationData.password" class="text-red-500">Senha é obrigatória.</small>
                </div>
  
                <div>
                  <label for="confirmPassword" class="block text-surface-900 dark:text-surface-0 font-medium text-sm mb-2">Redigite a Senha</label>
                  <Password id="confirmPassword" v-model="registrationData.confirmPassword" placeholder="Redigite a Senha" :toggleMask="true" class="mb-4" fluid :feedback="false"></Password>
                  <small v-if="submitted && !registrationData.confirmPassword" class="text-red-500">Confirmação da senha é obrigatória.</small>
                  <small v-if="submitted && registrationData.password !== registrationData.confirmPassword" class="text-red-500">As senhas não coincidem.</small>
                </div>
  
                <Button type="submit" :disabled="isButtonRegisterTriger" :label="registerButtonLabel" class="w-full mb-3" />
                <a :href="linkToLogin" class="font-medium no-underline ml-2 text-right cursor-pointer text-primary">Já tenho uma conta</a>

              </form>
              <div v-if="error" class="mt-4 text-red-500">{{ error }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  definePageMeta({
  layout: false, // ou 'empty'
})
  import { ref } from 'vue';
  import { useRouter, useRoute } from 'vue-router';
  import InputText from 'primevue/inputtext';
  import Password from 'primevue/password';
  import Button from 'primevue/button';
  import { useToast } from 'primevue/usetoast';
  
  const toast = useToast();
  const router = useRouter();
  const route = useRoute();
  const domain = route.params.domain;
  
  const linkToLogin = '/' + domain + '/auth/login';

  const registrationData = ref({
    username: '',
    email: '',
    password: '',
    confirmPassword: '' // Adicionado o campo confirmPassword
  });
  
  const submitted = ref(false);
  const error = ref('');
  const isButtonRegisterTriger = ref(false);
  const registerButtonLabel = ref("Registrar");
  
  const register = async () => {
    submitted.value = true;
    isButtonRegisterTriger.value = true;
    registerButtonLabel.value = "Aguarde...";
    error.value = '';
  
    if (!registrationData.value.username || !registrationData.value.email || !registrationData.value.password || !registrationData.value.confirmPassword) {
      toast.add({ severity: 'warn', summary: 'Aviso', detail: 'Por favor, preencha todos os campos.', life: 3000 });
      return;
    }
  
    if (registrationData.value.password !== registrationData.value.confirmPassword) {
      toast.add({ severity: 'error', summary: 'Erro', detail: 'As senhas não coincidem.', life: 3000 });
      return;
    }
  
    try {
      const response = await $fetch(`/api/${domain}/register`, {
        method: 'POST',
        body: {
          username: registrationData.value.username,
          email: registrationData.value.email,
          password: registrationData.value.password // Envie a senha (que será hashed no backend)
        }
      });
  
      if (response.success) {
        toast.add({ severity: 'success', summary: 'Sucesso', detail: response.message || 'Registro bem-sucedido. Redirecionando...', life: 3000 });
        await new Promise(resolve => setTimeout(resolve, 1000));
        router.push(`/${domain}/registerSuccess`);
      } else {
        error.value = response.message || 'Falha ao registrar. Tente novamente.';
        toast.add({ severity: 'error', summary: 'Erro', detail: error.value, life: 3000 });
      }
    } catch (err) {
      console.error('Erro ao registrar:', err);
      error.value = 'Ocorreu um erro ao processar sua solicitação. Tente novamente.';
      toast.add({ severity: 'error', summary: 'Erro', detail: error.value, life: 3000 });
    }
  };
  </script>
  
  <style scoped>
  .login-form {
    max-width: 400px;
    margin: 0 auto;
  }
  </style>