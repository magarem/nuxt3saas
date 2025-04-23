<script setup>
definePageMeta({
  layout: false // ou 'empty'
});
import FloatingConfigurator from "@/components/FloatingConfigurator.vue";
import { ref } from "vue";

// const email = ref('');
const username = ref("");
const password = ref("");
const checked = ref(false);
const error = ref("");
const route = useRoute();
const domain = route.params.domain;

const linkToRegister = "/" + domain + "/register";
const linkToRemember = "/" + domain + "/forgotPasswordEmail";

const login = async () => {
  try {
    const response = await $fetch(`/api/${domain}/login`, {
      method: "POST",
      body: { username: username.value, password: password.value }
    });


    if (response.success) {
      // Armazena o token JWT (por exemplo, em localStorage)
      // localStorage.setItem('token', response.token);
      // Redireciona para a página protegida
      navigateTo({ path: "/" + domain + "/dashboard" });
    } else {
      error.value = response;
    }
  } catch (err) {
    error.value = "Erro ao fazer login";
  }
};
</script>

<template>
  <!-- <FloatingConfigurator /> -->

  <!-- Logo no canto superior esquerdo -->
  <div class="absolute top-4 left-4 z-10">
    <img src="/assets/logo-saaskit.png" alt="SaasKit Logo" class="h-12 w-auto" />
  </div>

  <!-- Fundo e formulário central -->
  <div class="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 px-4">
    <div class="w-full max-w-lg p-1 rounded-[2px] from-indigo-600/50 to-transparent shadow-xl">
      <div class="bg-gray-900 rounded-[13px] py-12 px-6 sm:px-14 backdrop-blur-md border border-gray-800">
        <h2 class="text-2xl font-semibold text-white text-center mb-6">
  Identificação de usuário
</h2>
        <!-- Formulário -->
        <form @submit.prevent="login" class="space-y-5">
          <!-- Usuário -->
          <div>
            <label for="username" class="block text-sm font-medium text-gray-300 mb-1">
              Usuário ou E-mail
            </label>
            <InputText
              id="username"
              type="text"
              v-model="username"
              placeholder="Digite seu nome de usuário"
              class="w-full"
            />
          </div>

          <!-- Senha -->
          <div>
            <label for="password1" class="block text-sm font-medium text-gray-300 mb-1">
              Senha
            </label>
            <Password
              id="password1"
              v-model="password"
              placeholder="Digite sua senha"
              :toggleMask="true"
              fluid
              :feedback="false"
              class="w-full"
            />
          </div>

          <!-- Lembrete + Esqueci -->
          <div class="flex items-center justify-between mt-2 mb-2 text-sm text-gray-400">
            <div class="flex items-center gap-2">
              <Checkbox v-model="checked" id="rememberme1" binary class="mr-1" />
              <label for="rememberme1">Lembrar de mim</label>
            </div>

            <a
              :href="linkToRemember"
              class="text-indigo-400 hover:text-indigo-300 transition"
            >
              Esqueci minha senha?
            </a>
          </div>

          <!-- Botão -->
          <Button
            type="submit"
            label="Entrar"
            class="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 transition text-white font-medium py-2 rounded-lg shadow-md"
          />

          <!-- Feedback -->
          <div v-if="error" class="text-center text-red-400 text-sm mt-2">
            {{ error }}
          </div>
          <div v-if="response" class="text-center text-green-400 text-sm mt-2">
            {{ response }}
          </div>

          <!-- Registro -->
          <div class="text-center _mt-4">
            <a
              :href="linkToRegister"
              class="text-sm text-indigo-400 hover:text-indigo-300 transition"
            >
              Registrar novo usuário
            </a>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>




<style scoped>
.pi-eye {
  transform: scale(1.6);
  margin-right: 1rem;
}

.pi-eye-slash {
  transform: scale(1.6);
  margin-right: 1rem;
}
</style>
