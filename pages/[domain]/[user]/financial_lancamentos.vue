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
            <h4 class="m-0">Usuários</h4>
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
             <span v-if="col.editTemplate === 'calendar'">
        {{ formatDateBR(slotProps.data[col.field]) }}
      </span>
       <span v-else>
 <!-- {{ formatValue(slotProps.data[col.field]) }} -->
            {{ slotProps.data[col.field] }}
       </span>
           
          </template>

          <!-- <template v-if="col.bodyTemplate" #body="slotProps">
            <component
              :is="col.bodyTemplate"
              :slotProps="slotProps"
              :formatCurrency="formatCurrency"
              :getStatusLabel="getStatusLabel"
            />
          </template> -->
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
           
<div  v-if="col.editTemplate == 'money'">
<money3 v-model="item[col.field]" v-bind="config"  class="p-inputtext p-component" ></money3> 
  <!-- <InputText v-model="item.valor" v-money="money" /> -->
</div>
<div  v-if="col.editTemplate == 'calendar'">
 <Calendar
    v-model="item[col.field]"
    dateFormat="dd/mm/yy"
    :locale="brLocale"
    showIcon
    class="w-full"
  />
</div>
          <div v-else>

            
            <component
             
              :is="col.editTemplate"
              v-model="item[col.field]"
              :item="item"
              :options="col.options"
              :submitted="submitted"
              :field="col.field"
            />
          </div>
            
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
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import { FilterMatchMode } from '@primevue/core/api'
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import Calendar from 'primevue/calendar'
import Dropdown from 'primevue/dropdown'
import CustomSelect from "~/components/CustomSelect.vue";
const toast = useToast()
const route = useRoute()
const domain = route.params.domain

const dt = ref()
const items = ref([])
const item = ref({})
const itemDialog = ref(false)
const deleteItemDialog = ref(false)
const deleteItemsDialog = ref(false)
const selectedItems = ref([])
const submitted = ref(false)

const amount = ref(null)

function formatDateBR(date) {
  if (!date) return ''
  return new Date(date).toLocaleDateString('pt-BR')
}

const config = {
   prefix: '',
          suffix: '',
          thousands: '.',
          decimal: ',',
          precision: 2,
          disableNegative: false,
          disabled: false,
          min: null,
          max: null,
          allowBlank: false,
          minimumNumberOfCharacters: 0,
          shouldRound: true,
          focusOnRight: false,
}

// Localização em português do Brasil
const brLocale = {
  firstDayOfWeek: 0,
  dayNames: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],
  dayNamesShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
  dayNamesMin: ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'],
  monthNames: [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ],
  monthNamesShort: [
    'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
    'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
  ],
  today: 'Hoje',
  clear: 'Limpar'
}

const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS }
})

const categoryOptions = ref([])

const columns = ref([
  {
    field: 'date',
    header: 'Data',
    sortable: true,
    style: { 'min-width': '10rem' },
    editTemplate: 'calendar'
  },{
    field: 'type',
    header: 'Tipo',
    sortable: true,
    style: { 'min-width': '10rem' },
    editTemplate: CustomSelect,
    options: [
      { key: 'Entrada', value: 'entrada' },
      { key: 'Saída', value: 'saída' }
    ]
  },
  {
    field: 'category_id',
    header: 'Categoria',
    sortable: true,
    style: { 'min-width': '10rem' },
    editTemplate: CustomSelect,
    options: categoryOptions
  },
  {
    field: 'description',
    header: 'Descrição',
    sortable: true,
    style: { 'min-width': '10rem' },
    editTemplate: InputText
  },
  {
    field: 'amount',
    header: 'Valor',
    sortable: true,
    style: { 'min-width': '15rem' },
    editTemplate: 'money'
  }
])

const visibleColumns = computed(() => {
  return columns.value.filter(col => !col.hidden)
})

onMounted(async () => {
  const data = await executeQuery(domain, `SELECT * FROM financial_transactions`)
  const cats = await executeQuery(domain, `SELECT id, name FROM financial_categories`)
  categoryOptions.value = cats.map(cat => ({ value: cat.name, key: cat.id }))
  items.value = data
})

async function executeQuery(domain, sql) {
  const res = await fetch(`/api/${domain}/query`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sql })
  })
  return await res.json()
}

function formatDate(date) {
  const options = { year: 'numeric', month: '2-digit', day: '2-digit' }
  return new Date(date).toLocaleDateString('pt-BR', options)
}

function formatCurrency(value) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2
  }).format(value)
}

function openNew() {
  item.value = {}
  submitted.value = false
  itemDialog.value = true
}

function hideDialog() {
  itemDialog.value = false
  submitted.value = false
}

async function saveItem() {
  submitted.value = true

  let isValid = true
  for (const col of columns.value) {
    if (col.editTemplate && !item.value[col.field]) {
      isValid = false
      break
    }
  }

  if (!isValid) return

  const dataToSave = { ...item.value }
  const isNew = !dataToSave.id

  const result = await $fetch(`/api/${domain}/upsert`, {
    method: 'POST',
    body: {
      table: 'financial_transactions',
      data: dataToSave,
      condition: !isNew ? `id = ${dataToSave.id}` : null
    }
  })

  if (result?.error) {
    toast.add({ severity: 'error', summary: 'Erro', detail: 'Falha ao salvar', life: 3000 })
  } else {
    toast.add({ severity: 'success', summary: 'Sucesso', detail: isNew ? 'Criado' : 'Atualizado', life: 3000 })
    items.value = await executeQuery(domain, `SELECT * FROM financial_transactions`)
    itemDialog.value = false
  }
}

function editItem(row) {
  item.value = { ...row }
  itemDialog.value = true
}

function confirmDeleteItem(row) {
  item.value = { ...row }
  deleteItemDialog.value = true
}

async function deleteItem() {
  await executeQueryRun(domain, `DELETE FROM financial_transactions WHERE id = ${item.value.id}`)
  items.value = await executeQuery(domain, `SELECT * FROM financial_transactions`)
  deleteItemDialog.value = false
  item.value = {}
  toast.add({ severity: 'success', summary: 'Removido', life: 3000 })
}

function confirmDeleteSelected() {
  deleteItemsDialog.value = true
}

async function deleteSelectedItems() {
  for (const selected of selectedItems.value) {
    await executeQueryRun(domain, `DELETE FROM financial_transactions WHERE id = ${selected.id}`)
  }
  selectedItems.value = []
  deleteItemsDialog.value = false
  items.value = await executeQuery(domain, `SELECT * FROM financial_transactions`)
  toast.add({ severity: 'success', summary: 'Removidos', life: 3000 })
}
</script>
