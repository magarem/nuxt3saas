<template>
  <DataTable :value="report" class="p-datatable-sm" responsiveLayout="scroll">
    <Column field="data" header="Data">
  <template #body="{ data }">
    {{ formatDate(data.data) }}
  </template>
</Column>
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

const formatDate = (value) => {
  if (!value) return '-'
  const date = new Date(value)
  return isNaN(date.getTime()) ? '-' : date.toLocaleDateString('pt-BR')
}
</script>