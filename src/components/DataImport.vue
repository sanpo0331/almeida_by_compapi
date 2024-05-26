<script setup>
import { firebaseDb } from '@/plugins/firebase'
import { collection, doc, setDoc } from 'firebase/firestore'
import doctors from '../master_data/doctors.json'
import nurses from '../master_data/nurses.json'
import patients from '../master_data/patients.json'
import inpatientStatus from '../master_data/inpatientStatus.json'

defineEmits(['dlgClose'])
// function
// 医師データImport
function impDoctors() {
  const docRef = collection(firebaseDb, 'doctors')
  doctors.forEach((doctor) => {
    setDoctor(docRef, doctor)
  })
}
async function setDoctor(docRef, doctor) {
  await setDoc(doc(docRef, doctor.id), {
    name: doctor.name,
    medical: doctor.medical,
    yobi: doctor.yobi
  })
}

// 看護師データImport
function impNurses() {
  const docRef = collection(firebaseDb, 'nurses')
  nurses.forEach((nurse) => {
    setNurse(docRef, nurse)
  })
}
async function setNurse(docRef, nurse) {
  await setDoc(doc(docRef, nurse.loginid), {
    tanto: nurse.tanto,
    name: nurse.name,
    medical: nurse.medical,
    byoto: nurse.byoto
  })
}
// 患者データImport
function impPatients() {
  const docRef = collection(firebaseDb, 'patients')
  let ix = 0
  patients.forEach((patient) => {
    ++ix
    const id = 'p' + ('000' + ix).slice(-4)
    setPatient(docRef, patient, id)
  })
}
async function setPatient(docRef, patient, id) {
  await setDoc(doc(docRef, id), {
    name: patient.name,
    gender: patient.gender,
    birthday: patient.birthday,
    tel: patient.tel,
    blood: patient.blood,
    medical: patient.medical,
    nyuinFrom: patient.nyuinFrom,
    nyuinTo: patient.nyuinTo,
    roomNo: patient.roomNo,
    byoto: patient.byoto
  })
}
// 入院患者データImport
function impInpatients() {
  const docRef = collection(firebaseDb, 'inpatientStatus')
  inpatientStatus.forEach((inpatient) => {
    setInpatients(docRef, inpatient)
  })
}
async function setInpatients(docRef, inpatient) {
  await setDoc(doc(docRef, inpatient.id), {
    patientId: inpatient.patientid,
    date: inpatient.date,
    tempMo: inpatient.tempMo,
    tempEv: inpatient.tempEv,
    bloodPresureMoH: inpatient.bloodPresureMoH,
    bloodPresureMoL: inpatient.bloodPresureMoL,
    bloodPresureEvH: inpatient.bloodPresureEvH,
    bloodPresureEvL: inpatient.bloodPresureEvL,
    pulseRateMo: inpatient.pulseRateMo,
    pulseRateEv: inpatient.pulseRateEv,
    oxygenMo: inpatient.oxygenMo,
    oxygenEv: inpatient.oxygenEv,
    mealMo: inpatient.mealMo,
    mealAf: inpatient.mealAf,
    mealEv: inpatient.mealEv
  })
}
</script>

<template>
  <v-card>
    <v-card-text>データをインポートします。</v-card-text>
    <v-card-actions>
      <v-btn color="update" elevation="2" @click="impDoctors">医師データ</v-btn>
      <v-btn color="update" elevation="2" @click="impNurses">看護師データ</v-btn>
      <v-btn color="update" elevation="2" @click="impPatients">患者データ</v-btn>
      <v-btn color="update" elevation="2" @click="impInpatients">入院患者データ</v-btn>
      <v-btn elevation="2" @click="$emit('dlgClose')">閉じる</v-btn>
    </v-card-actions>
  </v-card>
</template>
