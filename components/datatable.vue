<template>
  <div class="card">
    <Toolbar class="mb-4">
      <template #start>
        <div class="flex flex-wrap gap-2">
          <Button label="Novo" icon="pi pi-plus" severity="success" @click="$emit('openNew')" />
          <Button label="Excluir" icon="pi pi-trash" severity="danger" @click="$emit('confirmDeleteSelected')" :disabled="!selectedItems || !selectedItems.length" />
        </div>
      </template>
      <template #end>
        <div class="flex flex-wrap gap-2">
          <Button label="Exportar" icon="pi pi-upload" severity="help" @click="$emit('exportCSV')" />
        </div>
      </template>
    </Toolbar>

    <DataTable
      ref="dt"
      :value="items"
      v-model:selection="selectedItems"
      dataKey="id"
      :paginator="true"
      :rows="10"
      :filters="filters"
      filterDisplay="row"
      :globalFilterFields="columns.map(c => c.field)"
      :emptyMessage="'Nenhum registro encontrado'"
      :rowsPerPageOptions="[10, 25, 50]"
    >
      <template #header>
        <div class="flex justify-content-end">
          <span class="p-input-icon-left">
            <i class="pi pi-search" />
            <InputText v-model="filters['global'].value" placeholder="Buscar..." />
          </span>
        </div>
      </template>

      <Column selectionMode="multiple" headerStyle="width: 3rem" />

      <Column v-for="col of visibleColumns" :key="col.field" :field="col.field" :header="col.header" :showFilterMenu="false">
        <template #body="slotProps">
          <span v-if="col.format === 'currency'">{{ formatCurrency(slotProps.data[col.field]) }}</span>
          <span v-else-if="col.format === 'date'">{{ formatDateBR(slotProps.data[col.field]) }}</span>
          <span v-else>{{ slotProps.data[col.field] }}</span>
        </template>
        <template #filter="{ filterModel }">
          <InputText v-model="filterModel.value" class="p-column-filter" placeholder="Buscar..." />
        </template>
      </Column>

      <Column :exportable="false" style="min-width:8rem">
        <template #body="slotProps">
          <Button icon="pi pi-pencil" outlined rounded class="mr-2" @click="$emit('editItem', slotProps.data)" />
          <Button icon="pi pi-trash" outlined rounded severity="danger" @click="$emit('confirmDeleteItem', slotProps.data)" />
        </template>
      </Column>
    </DataTable>

    <Dialog v-model:visible="itemDialog" :style="{ width: '450px' }" header="Detalhes" :modal="true" class="p-fluid">
      <div class="formgrid grid">
        <div v-for="col of visibleColumns" :key="col.field" class="field col">
          <label :for="col.field">{{ col.header }}</label>
          <InputText v-model.trim="item[col.field]" :id="col.field" :required="col.required" />
          <small v-if="submitted && col.required && !item[col.field]" class="p-error">Campo obrigatório.</small>
        </div>
      </div>
      <template #footer>
        <Button label="Cancelar" icon="pi pi-times" text @click="$emit('hideDialog')" />
        <Button label="Salvar" icon="pi pi-check" text @click="$emit('saveItem')" />
      </template>
    </Dialog>

    <Dialog v-model:visible="deleteItemDialog" :style="{ width: '450px' }" header="Confirmação" :modal="true">
      <template #footer>
        <Button label="Não" icon="pi pi-times" text @click="$emit('hideDialog')" />
        <Button label="Sim" icon="pi pi-check" text @click="$emit('deleteItem')" />
      </template>
      <div class="confirmation-content">
        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
        <span v-if="item">Deseja excluir este registro?</span>
      </div>
    </Dialog>

    <Dialog v-model:visible="deleteItemsDialog" :style="{ width: '450px' }" header="Confirmação" :modal="true">
      <template #footer>
        <Button label="Não" icon="pi pi-times" text @click="$emit('hideDialog')" />
        <Button label="Sim" icon="pi pi-check" text @click="$emit('deleteSelectedItems')" />
      </template>
      <div class="confirmation-content">
        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
        <span v-if="item">Deseja excluir os registros selecionados?</span>
      </div>
    </Dialog>
  </div>
</template>

<script setup>
defineProps([
  'items',
  'item',
  'columns',
  'selectedItems',
  'submitted',
  'itemDialog',
  'deleteItemDialog',
  'deleteItemsDialog',
  'filters',
  'brLocale',
  'config',
  'visibleColumns'
])

defineEmits([
  'openNew',
  'confirmDeleteSelected',
  'exportCSV',
  'editItem',
  'confirmDeleteItem',
  'hideDialog',
  'saveItem',
  'deleteItem',
  'deleteSelectedItems'
])

function formatCurrency(value) {
  return Number(value).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  })
}

function formatDateBR(date) {
  if (!date) return "";
  return new Date(date).toLocaleDateString("pt-BR");
}
</script>