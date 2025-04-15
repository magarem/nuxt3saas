<template>
  <div class="container mx-auto mt-8 p-6 rounded-md shadow-md">
    <h1 class="text-2xl font-bold mb-6">Perfil</h1>
<Toast />
    <form
      @submit.prevent="saveProfile"
      class="grid grid-cols-1 md:grid-cols-2 gap-4"
    >
      <div>
        <label for="name" class="block text-gray-700 font-bold mb-2"
          >Username</label
        >
        <InputText
          id="name"
          v-model="profile.nome"
          type="text"
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>

      <div>
        <label for="email" class="block text-gray-700 font-bold mb-2"
          >Email</label
        >
        <InputText
          id="email"
          v-model="profile.email"
          type="email"
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>

      <div>
        <label for="phone" class="block text-gray-700 font-bold mb-2"
          >Telefone</label
        >
        <InputText
          id="phone"
          v-model="profile.telefone"
          type="tel"
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>

      <div>
        <label for="password" class="block text-gray-700 font-bold mb-2"
          >Nova Senha</label
        >
        <InputText
          id="password"
          v-model="profile.password"
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          :feedback="false"
        />
        <small class="text-gray-500"
          >Deixe em branco para manter a senha atual.</small
        >
      </div>

      <div class="md:col-span-2 flex justify-end">
        <Button
          label="Salvar"
          type="submit"
          class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        />
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useToast } from "primevue/usetoast";
import InputText from "primevue/inputtext";
import Password from "primevue/password";
import Button from "primevue/button";

const toast = useToast();
const route = useRoute();
const username = route.params.username;

const profile = ref({
  name: "",
  email: "",
  phone: "",
  password: ""
});
async function executeQuery(username, sql) {
  // Added username
  try {
    const response = await fetch(`/api/${username}/query`, {
      // Changed URL
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ sql })
    });
    // Handle errors like before
    const data = await response.json();
    return data;
  } catch (error) {
    // Handle error
  }
}


async function fetchUserProfile() {
  try {
    const { data: ret } = await useFetch("/api/" + username + "/user"); 

    console.log("ret.value.user>>>>:::", ret.value.user.username);
    console.log(`select * from users where nome like '${ret.value.user.username}'`);
    const response = await executeQuery(username,`select * from users where nome like '${ret.value.user.username}'`); // Chamada à API para obter os dados do usuário
    console.log("response>>>>:::", response.length);

    //   const response = await $fetch('/api/user'); // Chamada à API para obter os dados do usuário
    console.log("response>>>>:::", response);
    if (response.length > 0) {
      profile.value = response[0]; // Espalhe os dados do usuário e limpe a senha
    } else {
      toast.add({
        severity: "error",
        summary: "Erro",
        detail: "Falha ao carregar perfil.",
        life: 3000
      });
    }
  } catch (error) {
    console.error("Erro ao buscar perfil:", error);
    toast.add({
      severity: "error",
      summary: "Erro",
      detail: "Erro ao carregar perfil.",
      life: 3000
    });
  }
}

async function saveProfile() {
  try {
    // 1. Salvar/atualizar os dados básicos do usuário na tabela 'users'
    const ret = await $fetch(`/api/${username}/upsert`, {
        method: "POST",
        body: {
          table: "users",
          data: profile.value,
          condition: profile.value.id ? `id = ${profile.value.id}` : null,
        },
      });

    if (ret.success) {
      toast.add({
        severity: "success",
        summary: "Sucesso",
        detail: "Perfil atualizado.",
        life: 3000
      });
      await fetchUserProfile(); // Recarrega os dados atualizados
    } else {
      toast.add({
        severity: "error",
        summary: "Erro",
        detail: ret.message || "Falha ao atualizar perfil.",
        life: 3000
      });
    }
  } catch (error) {
    console.error("Erro ao salvar perfil:", error);
    toast.add({
      severity: "error",
      summary: "Erro",
      detail: "Erro ao salvar perfil.",
      life: 3000
    });
  }
}

// onMounted(async () => {
  await fetchUserProfile();
// });
</script>
