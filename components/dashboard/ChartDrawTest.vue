<template>
  <Bar
    id="my-chart-id"
    :options="chartOptions"
    :data="chartData"
  />
</template>

<script setup>
import { ref, watch } from 'vue'
import { Bar } from 'vue-chartjs'
import { 
  Chart as ChartJS, 
  Title, 
  Tooltip, 
  Legend, 
  BarElement, 
  CategoryScale, 
  LinearScale 
} from 'chart.js'

// Register ChartJS components
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

// Define props
const props = defineProps({
  chartData: {
    type: Object,
    required: true,
    default: () => ({
      labels: [],
      datasets: []
    })
  },
  chartOptions: {
    type: Object,
    default: () => ({
      responsive: true,
      maintainAspectRatio: false
    })
  }
})

// Create reactive references
const chartData = ref(props.chartData)
const chartOptions = ref(props.chartOptions)

// Watch for prop changes
watch(() => props.chartData, (newVal) => {
  chartData.value = newVal
}, { deep: true })

watch(() => props.chartOptions, (newVal) => {
  chartOptions.value = { ...newVal }
}, { deep: true })
</script>