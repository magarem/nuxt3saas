<template>
  <div class="w-80  mx-auto">
    <Pie :data="chartData" :options="chartOptions" />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Pie } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js'

// Register required chart elements
ChartJS.register(Title, Tooltip, Legend, ArcElement)

// Props
const props = defineProps({
  list: {
    type: Array,
    required: true
  }
})

// Prepare chart data from props.list
const chartData = computed(() => {
  const labels = props.list.map(item => ` ${item.date}`)
  const data = props.list.map(item => item.amount)

  return {
    labels,
    datasets: [
      {
        label: 'Valores',
        data,
        backgroundColor: ['#42A5F5', '#66BB6A', '#FFA726', '#AB47BC', '#FF7043'],
        borderWidth: 1
      }
    ]
  }
})

// Optional chart options
const chartOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: 'bottom'
    },
    title: {
      display: false,
      text: 'Distribuição dos Valores'
    }
  }
}
</script>

<style scoped>
/* Optional styles */
</style>
