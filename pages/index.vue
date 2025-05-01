<template>
  <div>
    <div class="flex justify-center items-center h-screen">
      <div class="text-center">
        <h1 class="text-4xl font-bold mb-4">SuryaNet</h1>
        <h2 class="text-4xl font-bold mb-4">Bem-vindo!</h2>
        <p class="text-lg">Defina o domínio do sistema na URL.</p>
        <a
          href="/magaweb"
          class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
        >
          Acessar pelo dominio /magaweb
        </a>
      </div>
      
    </div>
  </div>
</template>
<script setup>
  definePageMeta({
    layout: false
  })
</script>