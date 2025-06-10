<template>
   <DataTable 
    scrollable 
    scrollHeight="200px"
    :value="list" 
    class="p-datatable-sm" 
    
  >
    <Column sortable field="date" header="Data" headerStyle="font-size: 18px; background-color: #696969"/>
    <Column field="doc" header="Doc" headerStyle="font-size: 18px; background-color: #696969"/>
    <!-- <Column field="type" header="Valor" headerStyle="font-size: 18px; background-color: #696969">
      <template #body="{ data }">
        {{ data.type }}
      </template>
    </Column> -->
   
    <Column field="description" header="Desc" headerStyle="font-size: 18px; background-color: #696969">
      <template #body="{ data }">
        {{ data.description }}
      </template>
    </Column>
     <Column sortable field="amount" header="Valor" headerStyle="font-size: 18px; background-color: #696969">
      <template #body="{ data }">
        {{ formatCurrency(data.amount) }}
      </template>
    </Column>
  </DataTable>
 
</template>

<script setup>
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'

defineProps({
  list: {
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
</script>
