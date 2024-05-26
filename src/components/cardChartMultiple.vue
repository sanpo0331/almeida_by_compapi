<script setup>
import { ref, watch, onBeforeUpdate } from 'vue'
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  CategoryScale,
  LinearScale
} from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, PointElement, LineElement, CategoryScale, LinearScale)

const prPrData1 = ref([])
const prPrData2 = ref([])
const props = defineProps({
  prLabel1: {
    type: String,
    default: ''
  },
  prLabel2: {
    type: String,
    default: ''
  },
  prLabels: {
    type: Array,
    default: () => []
  },
  prData1: {
    type: Array,
    default: () => []
  },
  prData2: {
    type: Array,
    default: () => []
  },
  prKey: {
    type: String,
    default: ''
  }
})

onBeforeUpdate(() => {
  prPrData1.value = props.prData1.concat()
  prPrData2.value = props.prData2.concat()
})

watch(prPrData1, (newVal) => {
  chartData.value.datasets[0].data = [...newVal]
  chartData.value.labels = [...props.prLabels]
  chartData.value.datasets[0].label = props.prLabel1
  chartData.value.datasets[1].label = props.prLabel2
})
watch(prPrData2, (newVal) => {
  chartData.value.datasets[1].data = [...newVal]
})

const chartData = ref({
  labels: [],
  datasets: [
    {
      label: '',
      data: [],
      fill: false,
      borderColor: '#039BE5',
      tension: 0.1
    },
    {
      label: '',
      data: [],
      fill: false,
      borderColor: '#E53935',
      tension: 0.1
    }
  ]
})
const options = ref({
  responsive: true
})
</script>

<template>
  <Line :key="prKey" :data="chartData" :options="options" />
</template>
