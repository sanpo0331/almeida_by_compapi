<script setup>
import { ref, onMounted } from 'vue'
import { firebaseDb } from '@/plugins/firebase'
import { collection, query, where, getDocs, getDoc, doc, setDoc } from 'firebase/firestore'

defineEmits(['dlgClose'])
const selIx = ref(0)
const nurses = ref([])
const byotoNurses = ref([])
const frmByoto = ref('3f')
const frmNurse = ref('')

onMounted(async () => {
  getNurses().then((v) => setByotoNurses(v))
})

async function getNurses() {
  nurses.value = []
  const q = query(collection(firebaseDb, 'nurses'), where('tanto', '==', 'byoto'))
  const querySnapshot = await getDocs(q)
  querySnapshot.forEach((doc) => {
    nurses.value.push({
      id: doc.id,
      byoto: doc.data().byoto,
      name: doc.data().name,
      medical: doc.data().medical,
      tanto: doc.data().tanto
    })
  })
  return 'finish'
}
function setByotoNurses() {
  byotoNurses.value = nurses.value.filter((nurse) => nurse.byoto == frmByoto.value)
}
// シフトの行を選択
function selBtnClick(ix) {
  selIx.value = ix
}
// 看護師を選択
async function onChangeNurse(event) {
  const docRef = doc(firebaseDb, 'byoto-shift', event)
  const docSnap = await getDoc(docRef)
  if (docSnap.exists()) {
    selIx.value = docSnap.data().shift
  } else {
    selIx.value = 0
  }
}
async function setData() {
  const selectNurse = byotoNurses.value.find(({ id }) => id === frmNurse.value)
  await setDoc(doc(firebaseDb, 'byoto-shift', frmNurse.value), {
    name: selectNurse.name,
    shift: selIx.value,
    byoto: frmByoto.value
  })
  frmNurse.value = ''
  selIx.value = 0
}
</script>

<template>
  <div>
    <v-card elevation="5" width="700" class="pa-5 bg-teal-lighten-5">
      <v-toolbar color="transparent" class="mb-4">
        <v-toolbar-title>病棟看護師シフト登録</v-toolbar-title>
        <v-spacer />
        <v-icon icon="fa-regular fa-calendar-check" color="primary" size="50" />
      </v-toolbar>

      <v-radio-group
        v-model="frmByoto"
        inline
        hide-details
        class="mt-5"
        @update:model-value="setByotoNurses"
      >
        <v-radio label="３階" value="3f"></v-radio>
        <v-radio label="４階" value="4f"></v-radio>
      </v-radio-group>

      <v-select
        v-model="frmNurse"
        label="看護師"
        :items="byotoNurses"
        item-title="name"
        item-value="id"
        class="mt-3"
        @update:model-value="onChangeNurse"
      />

      <v-table density="compact">
        <thead>
          <tr>
            <td></td>
            <td>日</td>
            <td>月</td>
            <td>火</td>
            <td>水</td>
            <td>木</td>
            <td>金</td>
            <td>土</td>
          </tr>
        </thead>
        <tbody>
          <tr :class="selIx == 0 ? 'bg-yellow-lighten-1' : ''">
            <td>
              <v-btn
                icon="fa-regular fa-square-check"
                size="small"
                :color="selIx == 0 ? 'primary' : ''"
                flat
                @click="selBtnClick(0)"
              />
            </td>
            <td class="night">夜</td>
            <td class="night">夜明</td>
            <td class="holiday">休</td>
            <td class="holiday">休</td>
            <td>日</td>
            <td>日</td>
            <td>日</td>
          </tr>
          <tr :class="selIx == 1 ? 'bg-yellow-lighten-1' : ''">
            <td>
              <v-btn
                icon="fa-regular fa-square-check"
                size="small"
                :color="selIx == 1 ? 'primary' : ''"
                flat
                @click="selBtnClick(1)"
              />
            </td>
            <td>日</td>
            <td class="night">夜</td>
            <td class="night">夜明</td>
            <td class="holiday">休</td>
            <td class="holiday">休</td>
            <td>日</td>
            <td>日</td>
          </tr>
          <tr :class="selIx == 2 ? 'bg-yellow-lighten-1' : ''">
            <td>
              <v-btn
                icon="fa-regular fa-square-check"
                size="small"
                :color="selIx == 2 ? 'primary' : ''"
                flat
                @click="selBtnClick(2)"
              />
            </td>
            <td>日</td>
            <td>日</td>
            <td class="night">夜</td>
            <td class="night">夜明</td>
            <td class="holiday">休</td>
            <td class="holiday">休</td>
            <td>日</td>
          </tr>
          <tr :class="selIx == 3 ? 'bg-yellow-lighten-1' : ''">
            <td>
              <v-btn
                icon="fa-regular fa-square-check"
                size="small"
                :color="selIx == 3 ? 'primary' : ''"
                flat
                @click="selBtnClick(3)"
              />
            </td>
            <td>日</td>
            <td>日</td>
            <td>日</td>
            <td class="night">夜</td>
            <td class="night">夜明</td>
            <td class="holiday">休</td>
            <td class="holiday">休</td>
          </tr>
          <tr :class="selIx == 4 ? 'bg-yellow-lighten-1' : ''">
            <td>
              <v-btn
                icon="fa-regular fa-square-check"
                size="small"
                :color="selIx == 4 ? 'primary' : ''"
                flat
                @click="selBtnClick(4)"
              />
            </td>
            <td class="holiday">休</td>
            <td>日</td>
            <td>日</td>
            <td>日</td>
            <td class="night">夜</td>
            <td class="night">夜明</td>
            <td class="holiday">休</td>
          </tr>
          <tr :class="selIx == 5 ? 'bg-yellow-lighten-1' : ''">
            <td>
              <v-btn
                icon="fa-regular fa-square-check"
                size="small"
                :color="selIx == 5 ? 'primary' : ''"
                flat
                @click="selBtnClick(5)"
              />
            </td>
            <td class="holiday">休</td>
            <td class="holiday">休</td>
            <td>日</td>
            <td>日</td>
            <td>日</td>
            <td class="night">夜</td>
            <td class="night">夜明</td>
          </tr>
          <tr :class="selIx == 6 ? 'bg-yellow-lighten-1' : ''">
            <td>
              <v-btn
                icon="fa-regular fa-square-check"
                size="small"
                :color="selIx == 6 ? 'primary' : ''"
                flat
                @click="selBtnClick(6)"
              />
            </td>
            <td class="night">夜明</td>
            <td class="holiday">休</td>
            <td class="holiday">休</td>
            <td>日</td>
            <td>日</td>
            <td>日</td>
            <td class="night">夜</td>
          </tr>
        </tbody>
      </v-table>

      <v-card-actions class="mt-3">
        <v-spacer></v-spacer>
        <v-btn rounded="lg" elevation="2" color="update" @click="setData">更新</v-btn>
        <v-btn rounded="lg" elevation="2" @click="$emit('dlgClose')">閉じる</v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<style scoped>
.holiday {
  color: #d50000;
}
.night {
  color: #0d47a1;
}
</style>
