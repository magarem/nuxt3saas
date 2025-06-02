<template>
  <Bar
    id="my-chart-id"
    :options="chartOptions"
    :data="chartData"
  />
</template>

<script setup>
import { ref } from 'vue'
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'

// Registrar os componentes do Chart.js
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

// Dados e opções do gráfico
const chartData = ref({
  labels: ['Janeiro', 'Fevereiro', 'MArço', 'Abril'],
  datasets: [
    {
      label: 'Entradas',
      data: [40, 20, 12, 70],
      backgroundColor: '#9BD0F5'

    }
  ]
})

const chartOptions = ref({
  responsive: true
})
</script>
