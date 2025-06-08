<template>
  <DataTable :value="report" showGridlines :rowStyle="getRowStyle" class="p-datatable-sm last-row-highlight p-datatable-column-title" responsiveLayout="scroll" >
    <Column field="data" header="Data" headerStyle="font-size: 18px; background-color: #696969">
  <template #body="{ data }">
    {{ formatDate(data.data) }}
  </template>
</Column>
    <!-- <Column field="nome" header="Categoria" headerStyle="font-size: 18px;"/> -->
    <!-- <Column field="description" header="Descrição" headerStyle="font-size: 18px;"/> -->
    <Column field="entradas" header="Entradas" headerStyle="font-size: 18px; background-color: #696969">
      <template #body="{ data }">
        {{ formatCurrency(data.entradas) }}
      </template>
    </Column>
    <Column field="saidas" header="Saídas" headerStyle="font-size: 18px; background-color: #696969">
      <template #body="{ data }">
        {{ formatCurrency(data.saidas) }}
      </template>
    </Column>
    <Column field="saldo" header="Saldo" headerStyle="font-size: 18px; background-color: #696969">
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

 function getRowStyle(rowData) {
  console.log(rowData)
    if (rowData.data == 'Totais') {
      return { 'background-color': '#2F4F4F', 'font-size': '17px' }; // Light gray
    } 
  }



function formatDate(isoString) {
  if (isoString=="") return ""
  if (isoString=="Totais") return "Totais"
  const date = new Date(isoString);
  const day = String(date.getUTCDate()).padStart(2, '0');
  const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Months are 0-based
  const year = date.getUTCFullYear();
  return `${day}-${month}-${year}`;
}
</script>
<style scoped>

.p-datatable-column-title {
color: red !important;
font-size: red;
}
::v-deep .last-row-highlight .p-datatable-tbody > tr:last-child {
  background-color: #2196F3 !important;
  color: red !important;
}
</style>