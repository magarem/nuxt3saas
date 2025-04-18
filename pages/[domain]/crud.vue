<template>
  <div>
    <div class="card">
      <Toolbar class="mb-6">
        <template #start>
          <Button
            label="New"
            icon="pi pi-plus"
            severity="secondary"
            class="mr-2"
            @click="openNew"
          />
          <Button
            label="Delete"
            icon="pi pi-trash"
            severity="secondary"
            @click="confirmDeleteSelected"
            :disabled="!selectedItems || !selectedItems.length"
          />
        </template>

        <template #end>
          <Button
            label="Export"
            icon="pi pi-upload"
            severity="secondary"
            @click="exportCSV($event)"
          />
        </template>
      </Toolbar>

      <DataTable
        ref="dt"
        v-model:selection="selectedItems"
        :value="items"
        dataKey="id"
        :paginator="true"
        :rows="10"
        :filters="filters"
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        :rowsPerPageOptions="[5, 10, 25]"
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} items"
      >
        <template #header>
          <div class="flex flex-wrap gap-2 items-center justify-between">
            <h4 class="m-0">Manage Items</h4>
            <IconField>
              <InputIcon>
                <i class="pi pi-search" />
              </InputIcon>
              <InputText
                v-model="filters['global'].value"
                placeholder="Search..."
              />
            </IconField>
          </div>
        </template>

        <Column
          selectionMode="multiple"
          style="width: 3rem"
          :exportable="false"
        ></Column>
        <Column
          v-for="col in columns"
          :key="col.field"
          :field="col.field"
          :header="col.header"
          :sortable="col.sortable"
          :style="col.style"
        >
          <template v-if="col.bodyTemplate" #body="slotProps">
            <component
              :is="col.bodyTemplate"
              :slotProps="slotProps"
              :formatCurrency="formatCurrency"
              :getStatusLabel="getStatusLabel"
            />
          </template>
        </Column>

        <Column :exportable="false" style="min-width: 12rem">
          <template #body="slotProps">
            <Button
              icon="pi pi-pencil"
              outlined
              rounded
              class="mr-2"
              @click="editItem(slotProps.data)"
            />
            <Button
              icon="pi pi-trash"
              outlined
              rounded
              severity="danger"
              @click="confirmDeleteItem(slotProps.data)"
            />
          </template>
        </Column>
      </DataTable>
    </div>

    <Dialog
      v-model:visible="itemDialog"
      :style="{ width: '450px' }"
      header="Item Details"
      :modal="true"
    >
      <div class="flex flex-col gap-6">
        <template v-for="col in columns" :key="col.field">
          <div v-if="col.editTemplate">
            <label :for="col.field" class="block font-bold mb-3">{{
              col.header
            }}</label>
            <component
              :is="col.editTemplate"
              v-model="item[col.field]"
              :item="item"
              :options="col.options"
              :submitted="submitted"
              :field="col.field"
            />
            <small v-if="submitted && !item[col.field]" class="text-red-500"
              >{{ col.header }} is required.</small
            >
          </div>
        </template>
      </div>

      <template #footer>
        <Button label="Cancel" icon="pi pi-times" text @click="hideDialog" />
        <Button label="Save" icon="pi pi-check" @click="saveItem" />
      </template>
    </Dialog>

    <Dialog
      v-model:visible="deleteItemDialog"
      :style="{ width: '450px' }"
      header="Confirm"
      :modal="true"
    >
      <div class="flex items-center gap-4">
        <i class="pi pi-exclamation-triangle !text-3xl" />
        <span v-if="item"
          >Excluir item <b>{{ item.name }}</b
          >?</span
        >
      </div>
      <template #footer>
        <Button
          label="No"
          icon="pi pi-times"
          text
          @click="deleteItemDialog = false"
        />
        <Button label="Yes" icon="pi pi-check" @click="deleteItem" />
      </template>
    </Dialog>

    <Dialog
      v-model:visible="deleteItemsDialog"
      :style="{ width: '450px' }"
      header="Confirm"
      :modal="true"
    >
      <div class="flex items-center gap-4">
        <i class="pi pi-exclamation-triangle !text-3xl" />
        <span v-if="item">Excluir itens selecionados?</span>
      </div>
      <template #footer>
        <Button
          label="No"
          icon="pi pi-times"
          text
          @click="deleteItemsDialog = false"
        />
        <Button
          label="Yes"
          icon="pi pi-check"
          text
          @click="deleteSelectedItems"
        />
      </template>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useToast } from "primevue/usetoast";
import { FilterMatchMode } from "@primevue/core/api";
import InputText from "primevue/inputtext";
import InputNumber from "primevue/inputnumber";
import Textarea from "primevue/textarea";
import Select from "primevue/select";
import RadioButton from "primevue/radiobutton";
import Rating from "primevue/rating";
import Tag from "primevue/tag";

const toast = useToast();
const dt = ref();
const items = ref([]);
const itemDialog = ref(false);
const deleteItemDialog = ref(false);
const deleteItemsDialog = ref(false);
const item = ref({});
const selectedItems = ref([]);
const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});
const submitted = ref(false);
const route = useRoute();
const username = route.params.username;
const columns = ref([
  { field: "id", header: "ID", sortable: true, style: { "min-width": "8rem" } },
  {
    field: "nome",
    header: "Nome",
    sortable: true,
    style: { "min-width": "16rem" },
    editTemplate: InputText
  },
  {
    field: "email",
    header: "Email",
    sortable: true,
    style: { "min-width": "16rem" },
    editTemplate: InputText
  },
  {
    field: "telefone",
    header: "Telefone",
    sortable: true,
    style: { "min-width": "12rem" },
    editTemplate: InputText
  }
]);

onMounted(async () => {
  // Replace with your data fetching logic

  // const { data: contatos } = await useFetch(`/api/${username}/lista`);
  const data = await fetchData();
  items.value = data;
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

async function fetchData() {
  // const route = useRoute();
  // const username = route.params.username;
  const data = await executeQuery(
    username,
    "SELECT id, nome, email, telefone FROM contatos"
  );
  return data;

  // Placeholder data for demonstration
  // return [
  //   { id: 1, nome: 'João Silva', email: 'joao@email.com', telefone: '123-456-7890' },
  //   { id: 2, nome: 'Maria Souza', email: 'maria@email.com', telefone: '987-654-3210' },
  //   { id: 3, nome: 'Carlos Ferreira', email: 'carlos@email.com', telefone: '111-222-3333' },
  // ];
}

function openNew() {
  item.value = {};
  submitted.value = false;
  itemDialog.value = true;
}

function hideDialog() {
  itemDialog.value = false;
  submitted.value = false;
}

async function saveItem() {
  submitted.value = true;

  let isValid = true;
  for (const col of columns.value) {
    if (col.editTemplate && !item.value[col.field]) {
      isValid = false;
      break;
    }
  }

  if (isValid) {
    try {
      const response = await $fetch(`/api/${username}/upsert`, {
        method: "POST",
        body: {
          table: "contatos", // Substitua pelo nome da sua tabela
          data: item.value,
          condition: item.value.id ? `id = ${item.value.id}` : null // Condição para update (se existir id)
        }
      });

      if (response && response.message) {
        toast.add({
          severity: "success",
          summary: "Successful",
          detail: response.message,
          life: 3000
        });
      } else {
        toast.add({
          severity: "error",
          summary: "Error",
          detail: "Failed to save item",
          life: 3000
        });
      }

      itemDialog.value = false;
      item.value = {};
      // Aqui você pode adicionar lógica para atualizar a lista de itens, se necessário.
      // Por exemplo, buscar novamente os dados da tabela.
    } catch (error) {
      console.error("Error saving item:", error);
      toast.add({
        severity: "error",
        summary: "Error",
        detail: "An error occurred while saving the item.",
        life: 3000
      });
    }
  }
}

function editItem(selectedItem) {
  item.value = { ...selectedItem };
  itemDialog.value = true;
}

function confirmDeleteItem(selectedItem) {
  item.value = selectedItem;
  deleteItemDialog.value = true;
}

async function deleteItem() {
  try {
    const response = await $fetch(`/api/${username}/delete`, {
      method: "POST",
      body: {
        table: "contatos", // Substitua pelo nome da sua tabela
        condition: `id = ${item.value.id}`
      }
    });

    if (response && response.message) {
      // Excluiu com sucesso no banco de dados
      // Se necessário, atualize a lista localmente ou busque os dados novamente
      // items.value = items.value.filter((val) => val.id !== item.value.id); //Remova esta linha se voce for buscar os dados novamente.
      toast.add({
        severity: "success",
        summary: "Successful",
        detail: response.message,
        life: 3000
      });
    } else {
      toast.add({
        severity: "error",
        summary: "Error",
        detail: "Failed to delete item",
        life: 3000
      });
    }

    deleteItemDialog.value = false;
    item.value = {};
  } catch (error) {
    console.error("Error deleting item:", error);
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "An error occurred while deleting the item.",
      life: 3000
    });
  }
}

function findIndexById(id) {
  return items.value.findIndex(val => val.id === id);
}

function createId() {
  // Replace with your actual ID generation logic (e.g., UUID)
  let id = "";
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < 5; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return id;
}

function exportCSV() {
  dt.value.exportCSV();
}

function confirmDeleteSelected() {
  deleteItemsDialog.value = true;
}

function deleteSelectedItems() {
  items.value = items.value.filter(val => !selectedItems.value.includes(val));
  deleteItemsDialog.value = false;
  selectedItems.value = null;
  toast.add({
    severity: "success",
    summary: "Successful",
    detail: "Items Deleted",
    life: 3000
  });
}

// Example body templates (replace with your specific needs)
const ImageBody = {
  template:
    '<img :src="`https://primefaces.org/cdn/primevue/images/product/${slotProps.data.image}`" :alt="slotProps.data.image" class="rounded" style="width: 64px" />'
};

const PriceBody = {
  template: "{{ formatCurrency(slotProps.data.price) }}"
};

const RatingBody = {
  template: '<Rating :modelValue="slotProps.data.rating" :readonly="true" />'
};

const StatusBody = {
  template:
    '<Tag :value="slotProps.data.inventoryStatus" :severity="getStatusLabel(slotProps.data.inventoryStatus)" />'
};

function formatCurrency(value) {
  if (value)
    return value.toLocaleString("en-US", {
      style: "currency",
      currency: "USD"
    });
  return;
}

function getStatusLabel(status) {
  switch (status) {
    case "INSTOCK":
      return "success";
    case "LOWSTOCK":
      return "warn";
    case "OUTOFSTOCK":
      return "danger";
    default:
      return null;
  }
}
</script>
