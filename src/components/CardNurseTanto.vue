<script setup>
import { ref, onMounted } from 'vue'
import { firebaseDb } from '@/plugins/firebase'
import { collection, query, where, getDocs } from 'firebase/firestore'

const wd1 = ref(0)
const wd2 = ref(0)
// 1:日勤、2:夜勤、3:夜勤明け、0:休み
// 日,月,火,水,木,金,土
const shift = ref([
  [2, 3, 0, 0, 1, 1, 1],
  [1, 2, 3, 0, 0, 1, 1],
  [1, 1, 2, 3, 0, 0, 1],
  [1, 1, 1, 2, 3, 0, 0],
  [0, 1, 1, 1, 2, 3, 0],
  [0, 0, 1, 1, 1, 2, 3],
  [3, 0, 0, 1, 1, 1, 2]
])
const query1 = ref([])
const query2 = ref([])
const sel1 = ref([])
const sel2 = ref([])
const tanto1 = ref([])
const tanto2 = ref([])
const byotoList = ref(['3f', '4f'])

onMounted(() => {
  const now = new Date()
  wd1.value = now.getDay()
  wd2.value = wd1.value == 6 ? 0 : wd1.value + 1

  shift.value.forEach((val, ix) => {
    if (val[wd1] != 0) {
      query1.value.push(ix)
      sel1.value.push({
        ix: ix,
        shift: val[wd1]
      })
    }
    if (val[wd2] != 0) {
      query2.value.push(ix)
      sel2.value.push({
        ix: ix,
        shift: val[wd2]
      })
    }
  })
  getTanto1()
  getTanto2()
})
// function
async function getTanto1() {
  const q = query(collection(firebaseDb, 'byoto-shift'), where('shift', 'in', query1.value))
  const querySnapshot = await getDocs(q)
  querySnapshot.forEach((doc) => {
    tanto1.value.push({
      id: doc.id,
      name: doc.data().name.split('　')[0],
      shift: doc.data().shift,
      byoto: doc.data().byoto,
      jikantai: shift.value[doc.data().shift][wd1.value]
    })
  })
}
async function getTanto2() {
  const q = query(collection(firebaseDb, 'byoto-shift'), where('shift', 'in', query2.value))
  const querySnapshot = await getDocs(q)
  querySnapshot.forEach((doc) => {
    tanto2.value.push({
      id: doc.id,
      name: doc.data().name.split('　')[0],
      shift: doc.data().shift,
      byoto: doc.data().byoto,
      jikantai: shift.value[doc.data().shift][wd1.value]
    })
  })
}
</script>

<template>
  <v-card rouned="lg" height="450" width="600">
    <!-- <v-card-title>病棟看護師</v-card-title> -->
    <v-row>
      <v-col v-for="(list, ix) in byotoList" :key="ix" cols="6">
        <v-list lines="two">
          <v-list-subheader>{{ list === '3f' ? '３階' : '４階' }}</v-list-subheader>

          <v-list-item>
            <template #prepend>
              <v-icon color="indigo-darken-3" icon="fa-solid fa-star"></v-icon>
            </template>
            <v-list-item-title>～9:00</v-list-item-title>
            <template v-for="(item, ix2) in tanto1" :key="ix2">
              <v-chip v-if="item.jikantai == 3 && item.byoto == list" size="small" class="mr-2">{{
                item.name
              }}</v-chip>
            </template>
          </v-list-item>

          <v-list-item>
            <template #prepend>
              <v-icon color="orange" icon="fa-solid fa-sun"></v-icon>
            </template>
            <v-list-item-title>8:30～18:00</v-list-item-title>
            <template v-for="(item, ix2) in tanto1" :key="ix2">
              <v-chip
                v-if="item.jikantai == 1 && item.byoto == list"
                size="small"
                class="ix2 > 2 ? mr-2 mt-1 : mr-2"
                >{{ item.name }}</v-chip
              >
            </template>
          </v-list-item>

          <v-list-item>
            <template #prepend>
              <v-icon color="yellow" icon="fa-solid fa-moon"></v-icon>
            </template>
            <v-list-item-title>17:30～9:00</v-list-item-title>
            <template v-for="(item, ix2) in tanto1" :key="ix2">
              <v-chip v-if="item.jikantai == 2 && item.byoto == list" size="small" class="mr-2">{{
                item.name
              }}</v-chip>
            </template>
          </v-list-item>

          <v-list-item>
            <template #prepend>
              <v-icon color="orange" icon="fa-solid fa-sun"></v-icon>
            </template>
            <v-list-item-title>8:30～18:00</v-list-item-title>
            <template v-for="(item, ix2) in tanto2" :key="ix2">
              <v-chip
                v-if="item.jikantai == 1 && item.byoto == list"
                size="small"
                class="ix2 > 2 ? mr-2 mt-1 : mr-2"
                >{{ item.name }}</v-chip
              >
            </template>
          </v-list-item>
        </v-list>
      </v-col>
    </v-row>
  </v-card>
</template>
