<template>
  <DataTable :value="report" class="p-datatable-sm" :rowStyle="getRowStyle" showGridlines responsiveLayout="scroll">
    <Column field="nome" header="Categoria" headerStyle="font-size: 18px; background-color: #696969"/>
       <Column field="type" header="Tipo" headerStyle="font-size: 18px; background-color: #696969">
      <template #body="{ data }">
        {{ data.type }}
      </template>
    </Column>
    <Column field="saldo" header="Valor" headerStyle="font-size: 18px; background-color: #696969">
      <template #body="{ data }">
        {{ formatCurrency(data.saldo) }}
      </template>
    </Column>
  </DataTable>
</template>

<script setup>
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'

defineProps({
  report: {
    type: Array,
    required: true
  }
})

 function getRowStyle(rowData) {
  console.log(rowData)
    if (rowData.data == 'Totais') {
      return { 'background-color': '#2F4F4F', 'font-size': '17px' }; // Light gray
    } 
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
