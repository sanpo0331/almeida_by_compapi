<script setup>
import { ref, onMounted } from 'vue'
import { firebaseDb } from '@/plugins/firebase'
import { collection, query, orderBy, getDocs } from 'firebase/firestore'

const gairai = ref([
  { id: 'med101', name: '消化器内科', doctor: [] },
  { id: 'med102', name: '神経内科', doctor: [] },
  { id: 'med103', name: '循環器内科', doctor: [] },
  { id: 'med201', name: '外科・消化器外科', doctor: [] },
  { id: 'med301', name: '皮膚科', doctor: [] },
  { id: 'med302', name: '耳鼻咽喉科', doctor: [] },
  { id: 'med303', name: '小児科', doctor: [] }
])
onMounted(async () => {
  getDoctors()
})
// function
async function getDoctors() {
  const q = query(collection(firebaseDb, 'doctors'), orderBy('medical'))
  const querySnapshot = await getDocs(q)
  querySnapshot.forEach((doc) => {
    const docName = doc.data().name.split('　')[0]
    const fndIx = gairai.value.findIndex((element) => element.id === doc.data().medical)
    doc.data().yobi.forEach((jx) => {
      gairai.value[fndIx].doctor[jx] = docName
    })
  })
}
</script>

<template>
  <v-card rounded="lg" height="292" width="600">
    <v-table density="compact">
      <thead>
        <tr class="bg-primary">
          <th>診療科</th>
          <th>月</th>
          <th>火</th>
          <th>水</th>
          <th>木</th>
          <th>金</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, ix) in gairai" :key="ix" class="bg-amber-lighten-4">
          <td>{{ item.name }}</td>
          <td v-for="(item2, jx) in item.doctor" :key="jx">{{ item2 }}</td>
        </tr>
      </tbody>
    </v-table>
  </v-card>
</template>
