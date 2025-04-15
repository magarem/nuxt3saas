<template>
    <div>
      <div class="card">
        <Toolbar class="mb-1">
          <template #start>
            <Button
              label="Novo"
              icon="pi pi-plus"
              severity="secondary"
              class="mr-2"
              @click="openNew"
            />
            <Button
              label="Excluir"
              icon="pi pi-trash"
              severity="secondary"
              @click="confirmDeleteSelected"
              :disabled="!selectedItems || !selectedItems.length"
            />
          </template>
  
          <template #end>
            <Button
              label="Exportar"
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
          :dataKey="tableConfig.primaryKey"
          :paginator="true"
          :rows="10"
          :filters="filters"
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          :rowsPerPageOptions="[5, 10, 25]"
          currentPageReportTemplate="{first} até {last} de {totalRecords} {{ tableConfig.displayName }}"
        >
          <template #header>
            <div class="flex flex-wrap gap-2 items-center justify-between">
              <h4 class="m-0">Gerenciar {{ tableConfig.displayName }}</h4>
              <IconField>
                <InputIcon>
                  <i class="pi pi-search" />
                </InputIcon>
                <InputText
                  v-model="filters['global'].value"
                  placeholder="Procurar..."
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
            v-for="col in visibleColumns"
            :key="col.field"
            :field="col.field"
            :header="col.header"
            :sortable="col.sortable"
            :style="col.style"
          >
            <template #body="slotProps">
              {{ formatValue(slotProps.data[col.field], col) }}
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
        :header="'Detalhes de ' + tableConfig.displayName"
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
                >{{ col.header }} é obrigatório.</small
              >
            </div>
          </template>
        </div>
  
        <template #footer>
          <Button label="Cancelar" icon="pi pi-times" text @click="hideDialog" />
          <Button label="Salvar" icon="pi pi-check" @click="saveItem" />
        </template>
      </Dialog>
  
      <Dialog
        v-model:visible="deleteItemDialog"
        :style="{ width: '450px' }"
        header="Confirmar Exclusão"
        :modal="true"
      >
        <div class="flex items-center gap-4">
          <i class="pi pi-exclamation-triangle !text-3xl" />
          <span v-if="item"
            >Excluir {{ tableConfig.displayName.slice(0, -1) }} <b>{{ item[displayField] }}</b
            >?</span
          >
        </div>
        <template #footer>
          <Button
            label="Não"
            icon="pi pi-times"
            text
            @click="deleteItemDialog = false"
          />
          <Button label="Sim" icon="pi pi-check" @click="deleteItem" />
        </template>
      </Dialog>
  
      <Dialog
        v-model:visible="deleteItemsDialog"
        :style="{ width: '450px' }"
        header="Confirmar Exclusão"
        :modal="true"
      >
        <div class="flex items-center gap-4">
          <i class="pi pi-exclamation-triangle !text-3xl" />
          <span v-if="item">Excluir {{ tableConfig.displayName }} selecionados?</span>
        </div>
        <template #footer>
          <Button
            label="Não"
            icon="pi pi-times"
            text
            @click="deleteItemsDialog = false"
          />
          <Button
            label="Sim"
            icon="pi pi-check"
            text
            @click="deleteSelectedItems"
          />
        </template>
      </Dialog>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, computed } from "vue";
  import { useToast } from "primevue/usetoast";
  import { FilterMatchMode } from "@primevue/core/api";
  import InputText from "primevue/inputtext";
  import InputNumber from "primevue/inputnumber";
  import Textarea from "primevue/textarea";
  import Select from "primevue/select";
  import RadioButton from "primevue/radiobutton";
  import Rating from "primevue/rating";
  import Tag from "primevue/tag";
  import CustomSelect from "~/components/CustomSelect.vue";
  import CustomCheckbox from "~/components/CustomCheckbox.vue";
  
  const props = defineProps({
    tableConfig: {
      type: Object,
      required: true
    },
    username: {
      type: String,
      required: true
    }
  });
  
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
  
  const visibleColumns = computed(() => {
    return props.tableConfig.columns.filter(col => !col.hidden);
  });
  
  const columns = computed(() => {
    return props.tableConfig.columns;
  });
  
  const displayField = computed(() => {
    const firstTextColumn = props.tableConfig.columns.find(col => col.editTemplate === InputText);
    return firstTextColumn ? firstTextColumn.field : props.tableConfig.primaryKey;
  });
  
  onMounted(async () => {
    await fetchData();
    if (props.tableConfig.columns.some(col => col.isManyToMany)) {
      await fetchOptions();
    }
  });
  
  async function fetchOptions() {
    for (const col of props.tableConfig.columns.filter(col => col.isManyToMany)) {
      try {
        const data = await executeQuery(props.username, `SELECT ${col.optionsKey} as key, ${col.optionsLabel} as value FROM ${col.optionsTable}`);
        col.options = data;
      } catch (error) {
        console.error(`Erro ao buscar opções para ${col.field}:`, error);
        toast.add({ severity: 'error', summary: 'Erro', detail: `Falha ao carregar opções para ${col.header}.`, life: 3000 });
      }
    }
  }
  
  async function fetchData() {
    try {
      const data = await executeQuery(props.username, `SELECT * FROM ${props.tableConfig.tableName}`);
      items.value = data || [];
    } catch (error) {
      console.error(`Erro ao buscar ${props.tableConfig.displayName}:`, error);
      toast.add({ severity: 'error', summary: 'Erro', detail: `Falha ao carregar ${props.tableConfig.displayName}.`, life: 3000 });
      items.value = [];
    }
  }
  
  function formatValue(value, col) {
  if (col.bodyTemplate) {
    return value;
  }
  if (Array.isArray(value)) {
    return value.join(', ');
  } else if (value != null) { // Verifica se não é null ou undefined
    return String(value); // Converte para string
  } else {
    return ''; // Retorna string vazia para null ou undefined
  }
}
  
  async function executeQuery(username, sql, params = []) {
    try {
      const response = await fetch(`/api/${username}/query`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ sql, params })
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Erro ao executar consulta: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Erro ao executar query:", error);
      toast.add({ severity: 'error', summary: 'Erro', detail: String(error), life: 5000 });
      return null;
    }
  }
  
  async function executeQueryRun(username, sql, params = []) {
    try {
      const response = await fetch(`/api/${username}/queryRun`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ sql, params })
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Erro ao executar queryRun: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Erro ao executar queryRun:", error);
      toast.add({ severity: 'error', summary: 'Erro', detail: String(error), life: 5000 });
      return null;
    }
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
    for (const col of props.tableConfig.columns) {
      if (col.editTemplate && !item.value[col.field]) {
        isValid = false;
        break;
      }
    }
  
    if (isValid) {
      try {
        const userData = {};
        for (const col of props.tableConfig.columns) {
          if (col.editTemplate) {
            userData[col.field] = item.value[col.field];
          }
        }
  
        // 1. Salvar/atualizar os dados básicos na tabela
        let response;
        if (item.value[props.tableConfig.primaryKey]) {
          response = await executeQueryRun(props.username, `
            UPDATE ${props.tableConfig.tableName} SET ${Object.keys(userData).map(key => `${key} = ?`).join(', ')} WHERE ${props.tableConfig.primaryKey} = ?
          `, [...Object.values(userData), item.value[props.tableConfig.primaryKey]]);
        } else {
          response = await executeQueryRun(props.username, `
            INSERT INTO <span class="math-inline">\{props\.tableConfig\.tableName\} \(</span>{Object.keys(userData).join(', ')}) VALUES (${Object.values(userData).map(() => '?').join(', ')})
          `, Object.values(userData));
        }
  
        if (response) {
          toast.add({ severity: 'success', summary: 'Sucesso', detail: `${props.tableConfig.displayName.slice(0, -1)} salvo com sucesso.`, life: 3000 });
        } else {
          toast.add({ severity: 'error', summary: 'Erro', detail: `Falha ao salvar ${props.tableConfig.displayName.slice(0, -1)}.`, life: 3000 });
          return;
        }
  
        // 2. Atualizar tabelas de relacionamento (se houver)
        for (const col of props.tableConfig.columns.filter(col => col.isManyToMany)) {
          const selectedValues = item.value[col.field] || [];
          const primaryKeyValue = item.value[props.tableConfig.primaryKey] || response.result?.lastInsertRowid;
          if (primaryKeyValue) {
            await executeQueryRun(props.username, `DELETE FROM ${col.relationTable} WHERE ${col.relationKey1} = ?`, [primaryKeyValue]);
            if (selectedValues.length > 0) {
              const insertPromises = selectedValues.map(relatedValue =>
                executeQueryRun(props.username, `INSERT INTO <span class="math-inline">\{col\.relationTable\} \(</span>{col.relationKey1}, ${col.relationKey2}) VALUES (?, ?)`, [primaryKeyValue, relatedValue])
              );
              await Promise.all(insertPromises);
            }
          }
        }
  
        itemDialog.value = false;
        item.value = {};
  
        await fetchData();
      } catch (error) {
        console.error(`Erro ao salvar ${props.tableConfig.displayName}:`, error);
        toast.add({ severity: 'error', summary: 'Erro', detail: `Erro ao salvar ${props.tableConfig.displayName}.`, life: 3000 });
      }
    }
  }
  
  function editItem(selectedItem) {
    item.value = { ...selectedItem };
    for (const col of props.tableConfig.columns.filter(col => col.isManyToMany)) {
      if (typeof item.value[col.field] === 'string') {
        item.value[col.field] = item.value[col.field].split(',').map(Number);
      }
    }
    itemDialog.value = true;
  }
  
  function confirmDeleteItem(selectedItem) {
    item.value = selectedItem;
    deleteItemDialog.value = true;
  }
  
  async function deleteItem() {
    try {
      const response = await executeQueryRun(props.username, `DELETE FROM ${props.tableConfig.tableName} WHERE ${props.tableConfig.primaryKey} = ?`, [item.value[props.tableConfig.primaryKey]]);
  
      if (response) {
        toast.add({ severity: "success", summary: "Sucesso", detail: `${props.tableConfig.displayName.slice(0, -1)} excluído com sucesso.`, life: 3000 });
      } else {
        toast.add({ severity: "error", summary: "Erro", detail: `Falha ao excluir ${props.tableConfig.displayName.slice(0, -1)}.`, life: 3000 });
      }
  
      deleteItemDialog.value = false;
      item.value = {};
      await fetchData();
    } catch (error) {
      console.error(`Erro ao excluir ${props.tableConfig.displayName}:`, error);
      toast.add({ severity: "error", summary: "Erro", detail: `Erro ao excluir ${props.tableConfig.displayName}.`, life: 3000 });
    }
  }
  
  function findIndexById(id) {
    return items.value.findIndex(val => val[props.tableConfig.primaryKey] === id);
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
  
  async function deleteSelectedItems() {
    try {
      if (selectedItems.value && selectedItems.value.length > 0) {
        const deletePromises = selectedItems.value.map(item =>
          executeQueryRun(props.username, `DELETE FROM ${props.tableConfig.tableName} WHERE ${props.tableConfig.primaryKey} = ?`, [item[props.tableConfig.primaryKey]])
        );
        await Promise.all(deletePromises);
  
        toast.add({ severity: "success", summary: "Sucesso", detail: `${props.tableConfig.displayName} excluídos com sucesso.`, life: 3000 });
        items.value = items.value.filter(val => !selectedItems.value.includes(val));
      } else {
        toast.add({ severity: "warn", summary: "Aviso", detail: `Nenhum ${props.tableConfig.displayName.slice(0, -1)} selecionado para exclusão.`, life: 3000 });
      }
    } catch (error) {
      console.error(`Erro ao excluir ${props.tableConfig.displayName} selecionados:`, error);
      toast.add({ severity: "error", summary: "Erro", detail: `Falha ao excluir ${props.tableConfig.displayName} selecionados.`, life: 3000 });
    } finally {
      deleteItemsDialog.value = false;
      selectedItems.value = null;
      await fetchData();
    }
  }
  
  function formatCurrency(value) {
    if (value)
      return value.toLocaleString("en-US", {
        style: "currency",
        currency: "USD"
      });
    return;
  }
  
  </script>