<template>
  <DataTable :value="report" class="p-datatable-sm" responsiveLayout="scroll">
    <Column field="nome" header="Categoria" />
     <Column field="description" header="Descrição" />
    <Column field="entradas" header="Entradas">
      <template #body="{ data }">
        {{ formatCurrency(data.entradas) }}
      </template>
    </Column>
    <Column field="saidas" header="Saídas">
      <template #body="{ data }">
        {{ formatCurrency(data.saidas) }}
      </template>
    </Column>
    <!-- <Column field="saldo" header="Saldo">
      <template #body="{ data }">
        {{ formatCurrency(data.saldo) }}
      </template>
    </Column> -->
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
</script>
