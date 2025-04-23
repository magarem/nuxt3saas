<template>
    <MyTableComponent :columns="tableColumns" :rows="tableRows" @saveItem="handleSaveItem" @deleteItem="handleDeleteItem" />
  </template>
  
  <script setup>
  import MyTableComponent from '~/components/MyTableComponent.vue'; // Substitua pelo caminho correto
  import { ref } from 'vue';
  
async function executeQuery(username, sql) {  // Added username
    try {
        const response = await fetch(`/api/${username}/query`, {  // Changed URL
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
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

//   const tableColumns = ref([
//     { field: 'id', header: 'ID', editTemplate: true },
//     { field: 'name', header: 'Name' },
//     { field: 'value', header: 'Value' },
//   ]);

  const tableColumns = ref([
    { field: 'id', header: 'ID', sortable: true, style: { 'min-width': '8rem' } },
    { field: 'nome', header: 'Nome', sortable: true, style: { 'min-width': '16rem' }, editTemplate: InputText },
    { field: 'email', header: 'Email', sortable: true, style: { 'min-width': '16rem' }, editTemplate: InputText },
    { field: 'telefone', header: 'Telefone', sortable: true, style: { 'min-width': '12rem' }, editTemplate: InputText },
  ]);

  const tableRows = ref(await executeQuery(username, "SELECT id, nome, email, telefone FROM contatos"));

//   const tableRows = ref([
//     { id: 1, name: 'Item 1', value: 10 },
//     { id: 2, name: 'Item 2', value: 20 },
//   ]);

async function handleSaveItem(itemData) {
    try {
        const response = await $fetch(`/api/${myUsername.value}/upsert`, {
        method: 'POST',
        body: {
          table: 'contatos',
          data: itemData,
          condition: itemData.id ? `id = ${itemData.id}` : null,
        },
      });

      if (response && response.message) {
        toast.add({
          severity: 'success',
          summary: 'Successful',
          detail: response.message,
          life: 3000,
        });
      } else {
        toast.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to save item',
          life: 3000,
        });
      }
    } catch (error) {
      console.error('Error saving item:', error);
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: 'An error occurred while saving the item.',
        life: 3000,
      });
    }
}

async function handleDeleteItem(itemId) {
  try {
    const response = await $fetch(`/api/${myUsername.value}/delete`, {
      method: 'POST',
      body: {
        table: 'contatos',
        condition: `id = ${itemId}`,
      },
    });

    if (response && response.message) {
      toast.add({
        severity: 'success',
        summary: 'Successful',
        detail: response.message,
        life: 3000,
      });
    } else {
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to delete item',
        life: 3000,
      });
    }
  } catch (error) {
    console.error('Error deleting item:', error);
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'An error occurred while deleting the item.',
      life: 3000,
    });
  }
}
  
//   async function saveItem(itemData) {
//     // Lógica para salvar o item usando a API upsert
//     console.log('Upsert item:', itemData);
//     // Simulação de chamada à API
//     await new Promise((resolve) => setTimeout(resolve, 1000));
//   }
  
  async function deleteItem(itemId) {
    // Lógica para excluir o item usando a API delete
    console.log('Delete item ID:', itemId);
    // Simulação de chamada à API
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
  </script>