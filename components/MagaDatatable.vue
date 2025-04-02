<template>
    <div>
      <DataTable :value="rows">
        <Column v-for="col of columns" :field="col.field" :header="col.header">
          <template v-if="col.editTemplate" #body="slotProps">
            {{ slotProps.data[col.field] }}
          </template>
        </Column>
        <Column>
          <template #body="slotProps">
            <Button @click="editItem(slotProps.data)">Edit</Button>
            <Button @click="confirmDelete(slotProps.data)">Delete</Button>
          </template>
        </Column>
      </DataTable>
  
      <Dialog v-model:visible="itemDialog" :style="{ width: '450px' }" header="Item Details" :modal="true">
        <div class="field" v-for="col of columns" :key="col.field">
          <label :for="col.field">{{ col.header }}</label>
          <InputText v-if="!col.editTemplate" v-model="item[col.field]" />
          <span v-else>{{item[col.field]}}</span>
        </div>
        <template #footer>
          <Button label="Cancel" icon="pi pi-times" @click="itemDialog = false" class="p-button-text" />
          <Button label="Save" icon="pi pi-check" @click="saveItem" />
        </template>
      </Dialog>
  
      <Dialog v-model:visible="deleteItemDialog" :style="{ width: '450px' }" header="Confirm Delete" :modal="true">
        <div class="confirmation-content">
          <i class="pi pi-exclamation-triangle p-mr-3" style="font-size: 2rem" />
          <span>Are you sure you want to delete this item?</span>
        </div>
        <template #footer>
          <Button label="No" icon="pi pi-times" @click="deleteItemDialog = false" class="p-button-text" />
          <Button label="Yes" icon="pi pi-check" @click="deleteItem" />
        </template>
      </Dialog>
  
      <Button @click="newItem">New Item</Button>
  
      <Toast ref="toast" />
    </div>
  </template>
  
  <script setup>
  import { ref, defineProps } from 'vue';
  import DataTable from 'primevue/datatable';
  import Column from 'primevue/column';
  import Button from 'primevue/button';
  import Dialog from 'primevue/dialog';
  import Toast from 'primevue/toast';
  import InputText from 'primevue/inputtext';
  
  const props = defineProps({
    columns: {
      type: Array,
      required: true,
    },
    rows: {
      type: Array,
      required: true,
    },
    upsertFunction: {
      type: Function,
      required: true,
    },
    deleteFunction: {
      type: Function,
      required: true,
    },
  });
  
  const itemDialog = ref(false);
  const deleteItemDialog = ref(false);
  const submitted = ref(false);
  const item = ref({});
  const toast = ref(null);
  
  function newItem() {
    item.value = {};
    itemDialog.value = true;
  }
  
  function editItem(selectedItem) {
    item.value = { ...selectedItem };
    itemDialog.value = true;
  }
  
  function confirmDelete(selectedItem) {
    item.value = { ...selectedItem };
    deleteItemDialog.value = true;
  }
  
  async function saveItem() {
    submitted.value = true;
  
    let isValid = true;
    for (const col of props.columns) {
      if (col.editTemplate && !item.value[col.field]) {
        isValid = false;
        break;
      }
    }
  
    if (isValid) {
      try {
        await props.upsertFunction(item.value);
  
        toast.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Item Saved',
          life: 3000,
        });
  
        itemDialog.value = false;
        item.value = {};
      } catch (error) {
        console.error('Error saving item:', error);
        toast.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to save item',
          life: 3000,
        });
      }
    }
  }
  
  async function deleteItem() {
    try {
      await props.deleteFunction(item.value.id);
  
      toast.add({
        severity: 'success',
        summary: 'Successful',
        detail: 'Item Deleted',
        life: 3000,
      });
  
      deleteItemDialog.value = false;
      item.value = {};
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
  </script>