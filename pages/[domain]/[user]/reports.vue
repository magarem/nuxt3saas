<template>
  <div class="p-6">
    <h1 class="font-bold mb-4">Relatórios Financeiros</h1>
    <!-- Filtros -->
    <div class="flex gap-4 mb-4 flex-wrap">
      <Calendar v-model="startDate" placeholder="Data início" showIcon dateFormat="dd/mm/yy" locale="brLocale" />
      <Calendar v-model="endDate" placeholder="Data fim" showIcon dateFormat="dd/mm/yy" locale="brLocale" />
      <Dropdown
        v-model="selectedCategory"
        :options="categories"
        optionLabel="value"
        optionValue="key"
        placeholder="Filtrar por categoria"
        class="min-w-[200px]"
      />
      <Button label="Atualizar" icon="pi pi-refresh" @click="fetchReport" />
      <!-- <Button label="Exportar PDF" icon="pi pi-file-pdf" class="p-button-outlined" @click="exportToPDF" /> -->
    </div>

    <!-- Tabela -->
    <ReportByCategory v-if="type === 'categoria'" :report="reportData" />
    <ReportByDate v-else :report="reportData" />

    <!-- Alternador de tipo -->
    <div class="mt-6">
      <label class="font-semibold mr-2">Exibir por:</label>
      <select v-model="type" class="border px-2 py-1 rounded bg-gray-800">
        <option value="categoria">Categoria</option>
        <option value="data">Data</option>
      </select>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Calendar from 'primevue/calendar'
import Dropdown from 'primevue/dropdown'
import Button from 'primevue/button'
// import jsPDF from 'jspdf'
// import autoTable from 'jspdf-autotable'
// import { pt } from 'primevue/api'
// import { usePrimeVue } from 'primevue/config'

// Configura o locale global para pt-BR
// const primevue = usePrimeVue()
// primevue.config.locale = pt

// Componentes de relatório
import ReportByCategory from '@/components/ReportByCategory.vue'
import ReportByDate from '@/components/ReportByDate.vue'

const reportData = ref([])
const totais = ref([])
const startDate = ref(null)
const endDate = ref(null)
const type = ref('categoria')
const selectedCategory = ref(null)
const categories = ref([])

const route = useRoute();
const domain = route.params.domain;

const brLocale = {
  firstDayOfWeek: 0,
  dayNames: [
    "Domingo",
    "Segunda",
    "Terça",
    "Quarta",
    "Quinta",
    "Sexta",
    "Sábado"
  ],
  dayNamesShort: ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"],
  dayNamesMin: ["D", "S", "T", "Q", "Q", "S", "S"],
  monthNames: [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro"
  ],
  monthNamesShort: [
    "Jan",
    "Fev",
    "Mar",
    "Abr",
    "Mai",
    "Jun",
    "Jul",
    "Ago",
    "Set",
    "Out",
    "Nov",
    "Dez"
  ],
  today: "Hoje",
  clear: "Limpar"
}

const fetchCategories = async () => {
  const res = await $fetch(`/api/${domain}/categories`)
  categories.value = [{key: '', value: 'Limpar filtro'}, ...res]
}

const fetchReport = async () => {
  const params = {
    start: startDate.value,
    end: endDate.value,
    type: type.value,
    category_id: selectedCategory.value
  }
  const res = await $fetch(`/api/${domain}/reports`, { params })
  reportData.value = [...res.rows, {data: "Totais", description: "Totais", entradas: res.rows_totais[0].total_entradas, saidas: res.rows_totais[0].total_saídas, saldo: res.rows_totais[0].saldo}]
  totais.value = res.rows_totais
}

const exportToPDF = () => {
  const doc = new jsPDF()
  doc.setFontSize(14)
  doc.text('Relatório Financeiro', 14, 16)

  const tableData = reportData.value.map(row => [
    row.nome || row.data,
    row.entradas.toFixed(2),
    row.saidas.toFixed(2),
    row.saldo.toFixed(2)
  ])

  autoTable(doc, {
    head: [[type.value === 'categoria' ? 'Categoria' : 'Data', 'Entradas', 'Saídas', 'Saldo']],
    body: tableData,
    startY: 20
  })

  doc.save('relatorio.pdf')
}

onMounted(() => {
  fetchCategories()
})

watch(
  () => type.value,
  (newVal, oldVal) => {
    if (newVal !== oldVal) {
      fetchCategories()
      fetchReport() // Chama ambos quando type muda
    }
  },
  { immediate: true } // Opcional: executa imediatamente na montagem do componente
)
</script>

<style scoped>
select {
  min-width: 160px;
}
</style>
