<template>
  <DataTable 
    scrollable 
    selectionMode="single" 
    dataKey="category_id"
    v-model:selection="selectedProduct"
    scrollHeight="200px"
    :value="report" 
    class="p-datatable-sm" 
    :rowStyle="getRowStyle"
  >
    <Column sortable field="nome" header="Categoria" headerStyle="font-size: 18px; background-color: #696969"/>
    <!-- <Column sortable field="type" header="Tipo" headerStyle="font-size: 18px; background-color: #696969">
      <template #body="{ data }">
        {{ data.type }}
      </template>
    </Column> -->
    <Column sortable field="saldo" header="Valor" headerStyle="font-size: 18px; background-color: #696969">
      <template #body="{ data }">
        {{ formatCurrency(data.saldo) }}
      </template>
    </Column>
  </DataTable>
 
</template>


<script setup>
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'

const selectedProduct = ref(null);
defineProps({
  report: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['customEvent'])

// Watch for selection change and emit
watch(selectedProduct, (newValue) => {
  emit('customEvent', newValue)
})

function sendData() {
  emit('customEvent', 'Olá do componente filho!')
}

function getRowStyle(rowData) {
  console.log(rowData)
  // if (rowData.data == 'Totais') {
  //   return { 'background-color': '#2F4F4F', 'font-size': '17px' }; // Light gray
  // } 
}

const formatCurrency = (value) => {
  if (value === null || value === undefined || isNaN(value)) {
    return '-'
  }
  return value.toLocaleString('pt-BR', { 
    style: 'currency', 
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
}
</script>
