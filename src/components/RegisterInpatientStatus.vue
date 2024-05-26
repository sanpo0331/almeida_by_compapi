<script setup>
import { ref, defineEmits, onMounted } from 'vue'
import { firebaseDb } from '@/plugins/firebase'
import { setDoc, doc } from 'firebase/firestore'

const props = defineProps({
  patient: {
    type: Object,
    default: function () {}
  }
})
const emit = defineEmits(['dlgClose'])
const mealStatus = ref([
  { title: '全て', status: '0' },
  { title: '残あり', status: '1' },
  { title: '全て残', status: '2' }
])
const tempMo = ref('')
const tempEv = ref('')
const bloodPresureMoH = ref('')
const bloodPresureMoL = ref('')
const bloodPresureEvH = ref('')
const bloodPresureEvL = ref('')
const pulseRateMo = ref('')
const pulseRateEv = ref('')
const oxygenMo = ref('')
const oxygenEv = ref('')
const mealMo = ref('')
const mealAf = ref('')
const mealEv = ref('')
const transmission = ref('')

onMounted(() => {
  tempMo.value = props.patient.tempMo
  tempEv.value = props.patient.tempEv
  bloodPresureMoH.value = props.patient.bloodPresureMoH
  bloodPresureMoL.value = props.patient.bloodPresureMoL
  bloodPresureEvH.value = props.patient.bloodPresureEvH
  bloodPresureEvL.value = props.patient.bloodPresureEvL
  pulseRateMo.value = props.patient.pulseRateMo
  pulseRateEv.value = props.patient.pulseRateEv
  oxygenMo.value = props.patient.oxygenMo
  oxygenEv.value = props.patient.oxygenEv
  mealMo.value = props.patient.mealMo
  mealAf.value = props.patient.mealAf
  mealEv.value = props.patient.mealEv
})
// function
// 更新
async function setData() {
  const today = new Date().toLocaleString('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
  const key = props.patient.id + today.substring(0, 4) + today.substring(5, 7) + today.substring(8)
  await setDoc(doc(firebaseDb, 'inpatientStatus', key), {
    id: props.patient.id,
    date: today,
    tempMo: tempMo.value,
    tempEv: tempEv.value,
    bloodPresureMoH: bloodPresureMoH.value,
    bloodPresureMoL: bloodPresureMoL.value,
    bloodPresureEvH: bloodPresureEvH.value,
    bloodPresureEvL: bloodPresureEvL.value,
    pulseRateMo: pulseRateMo.value,
    pulseRateEv: pulseRateEv.value,
    oxygenMo: oxygenMo.value,
    oxygenEv: oxygenEv.value,
    mealMo: mealMo.value,
    mealAf: mealAf.value,
    mealEv: mealEv.value,
    transmission: transmission.value
  })
  emit('dlgClose')
}
</script>

<template>
  <v-card title="入院患者状況更新" max-width="700">
    <v-container>
      <v-table>
        <tr>
          <th>ID</th>
          <td>{{ patient.id }}</td>
          <th>名前</th>
          <td>{{ patient.name }}</td>
          <th>年齢</th>
          <td>{{ patient.age }}</td>
        </tr>
      </v-table>
    </v-container>
    <v-divider />
    <v-container>
      <v-row>
        <v-col cols="2">
          <v-card-text>体温</v-card-text>
        </v-col>
        <v-col cols="2">
          <v-text-field
            v-model="tempMo"
            label="朝"
            variant="outlined"
            density="compact"
            hide-details
          />
        </v-col>
        <v-col cols="2">
          <v-text-field
            v-model="tempEv"
            label="夕"
            variant="outlined"
            density="compact"
            hide-details
          />
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="2">
          <v-card-text>血圧</v-card-text>
        </v-col>
        <v-col cols="4">
          <div class="d-flex align-center">
            <v-text-field
              v-model="bloodPresureMoH"
              label="朝(上)"
              variant="outlined"
              density="compact"
              hide-details
            />～
            <v-text-field
              v-model="bloodPresureMoL"
              label="朝(下)"
              variant="outlined"
              density="compact"
              hide-details
            />
          </div>
        </v-col>
        <v-col cols="4">
          <div class="d-flex align-center">
            <v-text-field
              v-model="bloodPresureEvH"
              label="夕(上)"
              variant="outlined"
              density="compact"
              hide-details
            />～
            <v-text-field
              v-model="bloodPresureEvL"
              label="夕(下)"
              variant="outlined"
              density="compact"
              hide-details
            />
          </div>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="2">
          <v-card-text>脈拍</v-card-text>
        </v-col>
        <v-col cols="2">
          <v-text-field
            v-model="pulseRateMo"
            label="朝"
            variant="outlined"
            density="compact"
            hide-details
          />
        </v-col>
        <v-col cols="2">
          <v-text-field
            v-model="pulseRateEv"
            label="夕"
            variant="outlined"
            density="compact"
            hide-details
          />
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="2">
          <v-card-text>酸素濃度</v-card-text>
        </v-col>
        <v-col cols="2">
          <v-text-field
            v-model="oxygenMo"
            label="朝"
            variant="outlined"
            density="compact"
            hide-details
          />
        </v-col>
        <v-col cols="2">
          <v-text-field
            v-model="oxygenEv"
            label="夕"
            variant="outlined"
            density="compact"
            hide-details
          />
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="2">
          <v-card-text>食事</v-card-text>
        </v-col>
        <v-col cols="3">
          <v-select
            v-model="mealMo"
            label="朝"
            :items="mealStatus"
            density="compact"
            variant="outlined"
          />
        </v-col>
        <v-col cols="3">
          <v-select
            v-model="mealAf"
            label="昼"
            :items="mealStatus"
            density="compact"
            variant="outlined"
          />
        </v-col>
        <v-col cols="3">
          <v-select
            v-model="mealEv"
            label="夕"
            :items="mealStatus"
            density="compact"
            variant="outlined"
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="2">
          <v-card-text>伝達事項</v-card-text>
        </v-col>
        <v-col cols="9">
          <v-textarea v-model="transmission" variant="outlined"></v-textarea>
        </v-col>
      </v-row>
    </v-container>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn rounded="lg" elevation="2" color="update" @click="setData">更新</v-btn>
      <v-btn rounded="lg" elevation="2" @click="$emit('dlgClose')">閉じる</v-btn>
    </v-card-actions>
  </v-card>
</template>

<style scoped>
th {
  background-color: #004d40;
  color: #ffffff;
}
</style>
