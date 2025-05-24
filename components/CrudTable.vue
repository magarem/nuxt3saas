<template>
  <div>
    <div class="card">
      <Toolbar class="mb-1">
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
        currentPageReportTemplate="{first} até {last} de {totalRecords} itenxs"
      >
        <template #header>
          <div class="flex flex-wrap gap-2 items-center justify-between">
            <h4 class="m-0">{{ title }}</h4>
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
            <span v-if="col.editTemplate === 'money'">
              {{ formatCurrency(slotProps.data[col.field]) }}
            </span>
            <span v-else-if="col.editTemplate === 'calendar'">
              {{ formatDateBR(slotProps.data[col.field]) }}
            </span>
            <span v-else>
              {{ slotProps.data[col.field] }}
            </span>
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
      :header="dialogTitle"
      :modal="true"
    >
      <div class="flex flex-col gap-6">
        <template v-for="col in columns" :key="col.field">
          <div v-if="col.editTemplate && !col.hide_editForm" class="mb-0">
            <label :for="col.field" class="block font-bold mb-2">
              {{ col.header }}
            </label>

            <money3
              v-if="col.editTemplate === 'money'"
              v-model="item[col.field]"
              v-bind="config"
              class="p-inputtext p-component"
            />

            <Select
              v-else-if="col.editTemplate === 'Select'"
              v-model="item[col.field]"
              :options="col.options"
              optionLabel="value"
              placeholder="Selecione"
              checkmark
              :highlightOnSelect="false"
              class="w-full md:w-56"
            />

            <Calendar
              v-else-if="col.editTemplate === 'calendar'"
              v-model="item[col.field]"
              dateFormat="dd/mm/yy"
              :locale="brLocale"
              showIcon
              class="w-full"
            />

            <component
              v-else
              :is="col.editTemplate"
              v-model="item[col.field]"
              :item="item"
              :options="col.options"
              :submitted="submitted"
              :field="col.field"
            />

            <small v-if="submitted && !item[col.field]" class="text-red-500">
              {{ col.header }} é obrigatório.
            </small>
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
import { ref, computed } from "vue";
import { useToast } from "primevue/usetoast";
import { FilterMatchMode } from "@primevue/core/api";

const props = defineProps({
  title: {
    type: String,
    default: "Items"
  },
  domain: {
    type: String,
    required: true
  },
  columns: {
    type: Array,
    required: true
  },
  fetchQuery: {
    type: Function,
    required: true
  },
  upsertQuery: {
    type: Function,
    required: true
  },
  deleteQuery: {
    type: Function,
    required: true
  },
  initialItem: {
    type: Object,
    default: () => ({})
  },
  config: {
    type: Object,
    default: () => ({
      prefix: "",
      suffix: "",
      thousands: ".",
      decimal: ",",
      precision: 2
    })
  }
});

const emit = defineEmits(["save", "delete", "delete-selected"]);

const toast = useToast();
const dt = ref();
const items = ref([]);
const item = ref({...props.initialItem});
const itemDialog = ref(false);
const deleteItemDialog = ref(false);
const deleteItemsDialog = ref(false);
const selectedItems = ref([]);
const submitted = ref(false);

const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});

const visibleColumns = computed(() => {
  return props.columns.filter(col => !col.hidden);
});

const dialogTitle = computed(() => {
  return item.value.id ? "Edit Item" : "New Item";
});

function formatDateBR(date) {
  if (!date) return "";
  return new Date(date).toLocaleDateString("pt-BR");
}

function formatCurrency(value) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2
  }).format(value);
}

function openNew() {
  item.value = {...props.initialItem};
  submitted.value = false;
  itemDialog.value = true;
}

function hideDialog() {
  itemDialog.value = false;
  submitted.value = false;
}

async function saveItem() {
  submitted.value = true;

  try {
    const result = await props.upsertQuery(item.value);
    
    if (result?.error) {
      toast.add({
        severity: "error",
        summary: "Erro",
        detail: "Falha ao salvar",
        life: 3000
      });
    } else {
      toast.add({
        severity: "success",
        summary: "Sucesso",
        detail: item.value.id ? "Atualizado" : "Criado",
        life: 3000
      });
      emit("save", item.value);
      itemDialog.value = false;
    }
  } catch (error) {
    toast.add({
      severity: "error",
      summary: "Erro",
      detail: "Falha ao salvar",
      life: 3000
    });
  }
}

function editItem(row) {
  item.value = { ...row };
  itemDialog.value = true;
}

function confirmDeleteItem(row) {
  item.value = { ...row };
  deleteItemDialog.value = true;
}

async function deleteItem() {
  try {
    await props.deleteQuery(item.value.id);
    emit("delete", item.value.id);
    deleteItemDialog.value = false;
    item.value = {};
    toast.add({ severity: "success", summary: "Removido", life: 3000 });
  } catch (error) {
    toast.add({
      severity: "error",
      summary: "Erro",
      detail: "Falha ao excluir",
      life: 3000
    });
  }
}

function confirmDeleteSelected() {
  deleteItemsDialog.value = true;
}

async function deleteSelectedItems() {
  try {
    const ids = selectedItems.value.map(item => item.id);
    await Promise.all(ids.map(id => props.deleteQuery(id)));
    emit("delete-selected", ids);
    selectedItems.value = [];
    deleteItemsDialog.value = false;
    toast.add({ severity: "success", summary: "Removidos", life: 3000 });
  } catch (error) {
    toast.add({
      severity: "error",
      summary: "Erro",
      detail: "Falha ao excluir itens",
      life: 3000
    });
  }
}

function exportCSV() {
  dt.value.exportCSV();
}

defineExpose({
  refresh: async () => {
    items.value = await props.fetchQuery();
  }
});
</script>