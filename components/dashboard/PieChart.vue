<template>
  <div class="pie-chart-container">
    <Pie :chart-data="chartData" :options="chartOptions" />
  </div>
</template>

<script setup>
import { Pie } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from 'chart.js'

// Registra os componentes necessários do Chart.js
ChartJS.register(Title, Tooltip, Legend, ArcElement)

// Dados do gráfico
const chartData = {
  labels: ['Vermelho', 'Azul', 'Amarelo', 'Verde', 'Roxo', 'Laranja'],
  datasets: [
    {
      label: 'Dados de Exemplo',
      data: [12, 19, 3, 5, 2, 3],
      backgroundColor: [
        'rgba(255, 99, 132, 0.7)',
        'rgba(54, 162, 235, 0.7)',
        'rgba(255, 206, 86, 0.7)',
        'rgba(75, 192, 192, 0.7)',
        'rgba(153, 102, 255, 0.7)',
        'rgba(255, 159, 64, 0.7)'
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)'
      ],
      borderWidth: 1
    }
  ]
}

// Opções do gráfico
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top'
    },
    title: {
      display: true,
      text: 'Gráfico de Pizza - Distribuição de Cores'
    }
  }
}
</script>

<style scoped>
.pie-chart-container {
  width: 100%;
  max-width: 500px;
  height: 400px;
  margin: 0 auto;
}
</style>