<script setup>
definePageMeta({
  layout: false, // ou 'empty'
})
import FloatingConfigurator from '@/components/FloatingConfigurator.vue';
import { ref } from 'vue';

// const email = ref('');
const username = ref('maga');
const password = ref('12345');
const checked = ref(false);
const error = ref('');


const login = async () => {
    try {
      const response = await $fetch('/api/login', {
        method: 'POST',
        body: { username: username.value, password: password.value },
      });

      console.log(response);
  
      if (response.success) {
        // Armazena o token JWT (por exemplo, em localStorage)
        // localStorage.setItem('token', response.token);
  
        // Redireciona para a página protegida
        navigateTo('/');
      } else {
        error.value = response;
      }
    } catch (err) {
      error.value = 'Erro ao fazer login';
    }
  };


</script>

<template>
    <FloatingConfigurator />
    <div class="bg-surface-50 dark:bg-surface-950 flex items-center justify-center min-h-screen min-w-[100vw] overflow-hidden">
        <div class="flex flex-col items-center justify-center">
            <div style="border-radius: 20px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
                <div class="w-full bg-surface-0 dark:bg-surface-900 py-15 px-8 sm:px-20" style="border-radius: 53px">
                    <div class="text-center mb-8">
                        <div class="text-surface-900 dark:text-surface-0 text-3xl font-medium mb-4">Bem vindo!</div>
                        <!-- <span class="text-muted-color font-medium">Sign in to continue</span> -->
                    </div>

                    <div>
                        <form @submit.prevent="login">
                        <label for="email1" class="block text-surface-900 dark:text-surface-0 text-sm font-medium mb-2">Username</label>
                        <InputText id="username" type="text" placeholder="User name" class="w-full md:w-[30rem] mb-4" v-model="username" />

                        <label for="password1" class="block text-surface-900 dark:text-surface-0 font-medium text-sm mb-2">Senha</label>
                        <Password id="password1" v-model="password" placeholder="Password" :toggleMask="true" class="mb-4" fluid :feedback="false"></Password>

                        <div class="flex items-center justify-between mt-2 mb-4 gap-8">
                            <!-- <div class="flex items-center">
                                <Checkbox v-model="checked" id="rememberme1" binary class="mr-2"></Checkbox>
                                <label for="rememberme1">Remember me</label>
                            </div> -->
                            <span class="font-medium no-underline ml-2 text-right cursor-pointer text-primary">Esqueci minha senha?</span>
                        </div>
                        
                        <Button type="submit" label="Entrar" class="w-full"  to="/"></Button>
                    </form>
                    {{error}}
                    {{response}}
                    </div>
                </div>
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
