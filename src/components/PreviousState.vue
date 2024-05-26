<script setup>
import CardChart from './cardChart.vue'
import CardChartMultiple from './cardChartMultiple.vue'

import { ref, watch, onMounted, onBeforeUpdate } from 'vue'
// import { ref, watch } from 'vue'
import { firebaseDb } from '@/plugins/firebase'
import { collection, query, getDocs, where } from 'firebase/firestore'

const prPatientId = ref('')
const tempMoLabel = ref('体温(朝)')
const tempEvLabel = ref('体温(夕)')
const bloodPresureMoHLabel = ref('血圧-高(朝)')
const bloodPresureMoLLabel = ref('血圧-低(朝)')
const bloodPresureEvHLabel = ref('血圧-高(夕)')
const bloodPresureEvLLabel = ref('血圧-低(夕)')
const pulseRateMoLabel = ref('脈拍(朝)')
const pulseRateEvLabel = ref('脈拍(夕)')
const oxygenMoLabel = ref('酸素濃度(朝)')
const oxygenEvLabel = ref('酸素濃度(夕)')
const tempAnno = ref({ yMin: 36, yMax: 37 })
const pulseRateAnno = ref({ yMin: 60, yMax: 100 })
const oxygenAnno = ref({ yMin: 96, yMax: 99 })
const tempMoData = ref('')
const tempEvData = ref('')
const bloodPresureMoHData = ref('')
const bloodPresureMoLData = ref('')
const bloodPresureEvHData = ref('')
const bloodPresureEvLData = ref('')
const pulseRateMoData = ref('')
const pulseRateEvData = ref('')
const oxygenMoData = ref('')
const oxygenEvData = ref('')
const chartLabels = ref('')
const prevKey = ref(['0', '1', '2', '3', '4', '5', '6'])

const props = defineProps({
  patientId: {
    type: String,
    default: ''
  }
})

onMounted(() => {
  // 最初に「過去データ」ボタンが押された時
  prPatientId.value = props.patientId
})
onBeforeUpdate(() => {
  // ２回目以降、「過去データ」ボタンが押された時
  // propsの更新を監視
  prPatientId.value = props.patientId
})
watch(prPatientId, (newVal) => {
  getPreviosData(newVal)
})

// // function
async function getPreviosData(id) {
  // 1か月前の日付を取得
  const dt = new Date()
  const month = dt.getMonth() + 1
  dt.setMonth(month - 2)
  const prevDate = dt.toLocaleString('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })

  // State clear
  chartLabels.value = []
  tempMoData.value = []
  tempEvData.value = []
  bloodPresureMoHData.value = []
  bloodPresureMoLData.value = []
  bloodPresureEvHData.value = []
  bloodPresureEvLData.value = []
  pulseRateMoData.value = []
  pulseRateEvData.value = []
  oxygenMoData.value = []
  oxygenEvData.value = []

  // 1か月前以降のデータを取得
  const q = query(
    collection(firebaseDb, 'inpatientStatus'),
    where('patientId', '==', id),
    where('date', '>=', prevDate)
  )
  const querySnapshot = await getDocs(q)
  let oldKey = ''
  let newKey = ''
  querySnapshot.forEach((doc) => {
    newKey = doc.data().date.substring(5, 7)
    if (oldKey != newKey) {
      chartLabels.value.push(doc.data().date.substring(5))
      oldKey = newKey
    } else {
      chartLabels.value.push(doc.data().date.substring(8))
    }
    tempMoData.value.push(doc.data().tempMo)
    tempEvData.value.push(doc.data().tempEv)
    bloodPresureMoHData.value.push(doc.data().bloodPresureMoH)
    bloodPresureMoLData.value.push(doc.data().bloodPresureMoL)
    bloodPresureEvHData.value.push(doc.data().bloodPresureEvH)
    bloodPresureEvLData.value.push(doc.data().bloodPresureEvL)
    pulseRateMoData.value.push(doc.data().pulseRateMo)
    pulseRateEvData.value.push(doc.data().pulseRateEv)
    oxygenMoData.value.push(doc.data().oxygenMo)
    oxygenEvData.value.push(doc.data().oxygenEv)
  })
  prevKey.value = []
  for (let ix = 0; ix < 8; ix++) {
    prevKey.value.push(id + ix)
  }
}
</script>

<template>
  <v-row>
    <v-col cols="5">
      <CardChart
        v-show="patientId"
        :pr-label="tempMoLabel"
        :pr-labels="chartLabels"
        :pr-data="tempMoData"
        :pr-annotation="tempAnno"
        :pr-key="prevKey[0]"
      />
    </v-col>
    <v-col cols="5">
      <CardChart
        v-show="patientId"
        :pr-label="tempEvLabel"
        :pr-labels="chartLabels"
        :pr-data="tempEvData"
        :pr-annotation="tempAnno"
        :pr-key="prevKey[1]"
      />
    </v-col>
  </v-row>
  <v-row>
    <v-col cols="5">
      <CardChartMultiple
        v-show="patientId"
        :pr-label1="bloodPresureMoHLabel"
        :pr-label2="bloodPresureMoLLabel"
        :pr-labels="chartLabels"
        :pr-data1="bloodPresureMoHData"
        :pr-data2="bloodPresureMoLData"
        :pr-key="prevKey[2]"
      />
    </v-col>
    <v-col cols="5">
      <CardChartMultiple
        v-show="patientId"
        :pr-label1="bloodPresureEvHLabel"
        :pr-label2="bloodPresureEvLLabel"
        :pr-labels="chartLabels"
        :pr-data1="bloodPresureEvHData"
        :pr-data2="bloodPresureEvLData"
        :pr-key="prevKey[3]"
      />
    </v-col>
  </v-row>
  <v-row>
    <v-col cols="5">
      <CardChart
        v-show="patientId"
        :pr-label="pulseRateMoLabel"
        :pr-labels="chartLabels"
        :pr-data="pulseRateMoData"
        :pr-annotation="pulseRateAnno"
        :pr-key="prevKey[4]"
      />
    </v-col>
    <v-col cols="5">
      <CardChart
        v-show="patientId"
        :pr-label="pulseRateEvLabel"
        :pr-labels="chartLabels"
        :pr-data="pulseRateEvData"
        :pr-annotation="pulseRateAnno"
        :pr-key="prevKey[4]"
      />
    </v-col>
  </v-row>
  <v-row>
    <v-col cols="5">
      <CardChart
        v-show="patientId"
        :pr-label="oxygenMoLabel"
        :pr-labels="chartLabels"
        :pr-data="oxygenMoData"
        :pr-annotation="oxygenAnno"
        :pr-key="prevKey[5]"
      />
    </v-col>
    <v-col cols="5">
      <CardChart
        v-show="patientId"
        :pr-label="oxygenEvLabel"
        :pr-labels="chartLabels"
        :pr-data="oxygenEvData"
        :pr-annotation="oxygenAnno"
        :pr-key="prevKey[6]"
      />
    </v-col>
  </v-row>
</template>
