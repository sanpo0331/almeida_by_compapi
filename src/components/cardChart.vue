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
import annotationPlugin from 'chartjs-plugin-annotation'

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  CategoryScale,
  LinearScale,
  annotationPlugin
)

const prPrData = ref([])
const props = defineProps({
  prLabel: {
    type: String,
    default: null
  },
  prLabels: {
    type: Array,
    default: () => []
  },
  prData: {
    type: Array,
    default: () => []
  },
  prAnnotation: {
    type: Object,
    default: () => {}
  },
  prKey: {
    type: String,
    default: null
  }
})
onBeforeUpdate(() => {
  prPrData.value = props.prData.concat()
})
watch(prPrData, (newVal) => {
  chartData.value.datasets[0].data = [...newVal]
  chartData.value.datasets[0].label = props.prLabel
  chartData.value.labels = [...props.prLabels]
  options.value.plugins.annotation.annotations.box1.yMin = props.prAnnotation.yMin
  options.value.plugins.annotation.annotations.box1.yMax = props.prAnnotation.yMax
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
    }
  ]
})
const options = ref({
  responsive: true,
  plugins: {
    annotation: {
      annotations: {
        box1: {
          type: 'box',
          xMin: 0,
          xMax: 31,
          yMin: 0,
          yMax: 0,
          backgroundColor: 'rgba(255,213,79,0.25)',
          borderWidth: 0
        }
      }
    }
  }
})
</script>

<template>
  <Line :key="prKey" :data="chartData" :options="options" />
</template>
