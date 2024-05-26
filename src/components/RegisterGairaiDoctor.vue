<script setup>
import { ref } from 'vue'
import { firebaseDb } from '@/plugins/firebase'
import { collection, query, where, getDocs, addDoc } from 'firebase/firestore'

defineEmits('dlgClose')
const frmMedical = ref('')
const frmDoctor = ref('')
const frmYobi = ref([])
const medicals = ref([
  { id: 'med101', name: '消化器内科' },
  { id: 'med102', name: '神経内科' },
  { id: 'med103', name: '循環器内科' },
  { id: 'med201', name: '外科・消化器外科' },
  { id: 'med301', name: '皮膚科' },
  { id: 'med302', name: '耳鼻咽喉科' },
  { id: 'med303', name: '小児科' }
])
const yobi = ref(['月', '火', '水', '木', '金'])
const doctors = ref([])

// function
async function getDoctors() {
  this.doctors = []
  const q = query(collection(firebaseDb, 'doctors'), where('medical', '==', this.frmMedical))
  const querySnapshot = await getDocs(q)
  querySnapshot.forEach((doc) => {
    this.doctors.push({
      docId: doc.id,
      docName: doc.data().name
    })
  })
}
function initData() {
  frmMedical.value = ''
  frmDoctor.value = ''
  frmYobi.value = []
  doctors.value = []
}
async function addData() {
  await addDoc(collection(firebaseDb, 'gairai-tanto'), {
    medical: frmMedical.value,
    doctor: frmDoctor.value,
    yobi: frmYobi.value
  }).then((response) => {
    console.log('RegisterDoctor-addData-response:', response)
    initData()
  })
}
</script>

<template>
  <div>
    <v-card elevation="5" width="700" height="450" class="pa-5 bg-teal-lighten-5">
      <v-toolbar color="transparent" class="mb-4">
        <v-toolbar-title>外来担当医登録</v-toolbar-title>
        <v-spacer />
        <v-icon icon="fa-solid fa-stethoscope" color="primary" size="50" />
      </v-toolbar>

      <v-select
        v-model="frmMedical"
        label="診療科"
        :items="medicals"
        item-title="name"
        item-value="id"
        @update:model-value="getDoctors"
      />

      <v-select
        v-model="frmDoctor"
        label="担当医師"
        :items="doctors"
        item-title="docName"
        item-value="docId"
        class="mt-3"
      />

      <div class="checkbox-area">
        <v-checkbox
          v-for="(item, ix) in yobi"
          :key="ix"
          v-model="frmYobi"
          :label="item"
          :value="ix"
        />
      </div>

      <v-card-actions class="mt-3">
        <v-spacer></v-spacer>
        <v-btn rounded="lg" elevation="2" color="update" @click="addData">更新</v-btn>
        <v-btn rounded="lg" elevation="2" @click="$emit('dlgClose')">閉じる</v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<style scoped>
.checkbox-area {
  display: flex;
  justify-content: fex-start;
}
</style>
