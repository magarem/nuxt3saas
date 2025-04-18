<template>
  <div>
    <div class="mb-4">
      <!-- <label class="block text-gray-700 font-bold mb-2">
        Foto de Perfil Atual:
      </label> -->
      <img
        v-if="currentImageUrl"
        :src="currentImageUrl"
        alt="Foto de Perfil Atual"
        class="w-20 h-20 rounded-full"
      />
      <div v-else class="w-20 h-20 rounded-full bg-gray-300 flex items-center justify-center">
        <span class="text-gray-500">Sem Foto</span>
      </div>
    </div>

    <!-- <label class="block text-gray-700 font-bold mb-2">
      Selecionar Nova Foto de Perfil:
    </label> -->
    <input
      type="file"
      @change="handleFileChange"
      accept="image/*"
      class="shadow appearance-none border rounded w-1/3 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
    /><br/>
    <button
      @click="uploadFile"
      class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-4"
      >
      Enviar Foto
    </button>
    <div v-if="uploading" class="mt-4">
      Enviando...
    </div>
    <div v-if="uploadSuccess" class="mt-4 text-green-500">
      Foto enviada com sucesso!
    </div>
    <div v-if="uploadError" class="mt-4 text-red-500">
      Erro ao enviar a foto: {{ uploadErrorMessage }}
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useToast } from 'primevue/usetoast';
import { useRoute } from 'vue-router'; // Importe useRoute para acessar parâmetros da rota

const toast = useToast();
const file = ref(null);
const uploading = ref(false);
const uploadSuccess = ref(false);
const uploadError = ref(false);
const uploadErrorMessage = ref('');

let username = defineProps(['username'])

username = username.username; // Obtenha o username do componente pai
const emit = defineEmits(['update:imageUrl']);
console.log('username>>>>:', username);

const route = useRoute();
const domain = route.params.domain; // Obtenha o username da rota

// Construa a URL da foto de perfil atual
const currentImageUrl = ref(`/uploads/${domain}/${username}/avatar.png?${Date.now()}`);

const handleFileChange = (event) => {
  file.value = event.target.files[0];
};

const uploadFile = async () => {
  if (!file.value) {
    toast.add({ severity: 'warn', summary: 'Aviso', detail: 'Selecione uma foto para enviar.', life: 3000 });
    return;
  }

  uploading.value = true;
  uploadSuccess.value = false;
  uploadError.value = false;
  uploadErrorMessage.value = '';

  const formData = new FormData();
  formData.append('foto', file.value);

  try {
    const response = await fetch(`/api/upload`, { // Inclua o username na rota
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erro ao enviar a foto.');
    }

    const data = await response.json();

    if (data.success) {
      uploadSuccess.value = true;
      currentImageUrl.value = `/uploads/${domain}/${username}/avatar.png?${Date.now()}`; // Atualize a URL da imagem atual
      emit('update:imageUrl', data.imageUrl);
    } else {
      uploadError.value = true;
      uploadErrorMessage.value = data.message || 'Falha ao enviar a foto.';
    }
  } catch (error) {
    console.error('Erro ao enviar a foto:', error);
    uploadError.value = true;
    uploadErrorMessage.value = error.message || 'Erro desconhecido ao enviar a foto.';
  } finally {
    uploading.value = false;
  }
};

</script>