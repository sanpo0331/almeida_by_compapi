<script setup>
import { ref, onMounted } from 'vue'
import { firebaseDb } from '@/plugins/firebase'
import { collection, query, orderBy, getDocs, setDoc, doc, deleteDoc } from 'firebase/firestore'

defineEmits(['dlgClose'])
const frmValid = ref(null)
const name = ref('')
const tanto = ref('byoto')
const medical = ref('')
const byoto = ref('3f')
const loginid = ref('')
const edit = ref(false)
const list = ref([])
const validate = ref(false)
const rules = ref({
  required: (v) => (!validate.value ? true : !!v || '入力必須です'),
  counter: (v) => (!validate.value ? true : v.length === 5 || '５文字入力してください')
})
// 診療科目
const medicals = ref([
  { id: 'med101', name: '消化器内科' },
  { id: 'med102', name: '神経内科' },
  { id: 'med103', name: '循環器内科' },
  { id: 'med201', name: '外科・消化器外科' },
  { id: 'med301', name: '皮膚科' },
  { id: 'med302', name: '耳鼻咽喉科' },
  { id: 'med303', name: '小児科' }
])
// Lifecycle Hooks
onMounted(async () => {
  setList()
})
async function setList() {
  list.value = []
  const q = query(collection(firebaseDb, 'nurses'), orderBy('medical'))
  const querySnapshot = await getDocs(q)
  querySnapshot.forEach((doc) => {
    list.value.push({
      id: doc.id,
      name: doc.data().name,
      tanto: doc.data().tanto,
      medical: doc.data().medical,
      byoto: doc.data().byoto
    })
  })
}
function getListTitle(name, tanto) {
  const wTanto = tanto === 'byoto' ? '（病棟看護）' : '（外来看護）'
  return name + wTanto
}
function getListSubTitle(tanto, medical, byoto) {
  if (tanto === 'byoto') {
    return byoto === '3f' ? '３階' : '４階'
  } else {
    return getMedicalName(medical)
  }
}
function getMedicalName(getId) {
  const result = medicals.value.find(({ id }) => id === getId)
  return result.name
}
function clear() {
  validate.value = false
  name.value = ''
  medical.value = ''
  tanto.value = 'byoto'
  byoto.value = ''
  loginid.value = ''
  edit.value = false
}
function selData(ix) {
  name.value = list.value[ix].name
  medical.value = list.value[ix].medical
  tanto.value = list.value[ix].tanto
  byoto.value = list.value[ix].byoto
  loginid.value = list.value[ix].id
  edit.value = true
}
function setData() {
  validate.value = true
  frmValid.value.validate().then(async function (data) {
    if (!data.valid) return
    await setDoc(doc(firebaseDb, 'nurses', loginid.value), {
      name: name.value,
      tanto: tanto.value,
      medical: tanto.value === 'gairai' ? medical.value : '',
      byoto: tanto.value === 'byoto' ? byoto.value : ''
    })
    clear()
    setList()
  })
}
async function deleteData() {
  await deleteDoc(doc(firebaseDb, 'nurses', loginid.value))
  clear()
  setList()
}
</script>

<template>
  <div>
    <v-card elevation="5" width="700" class="pa-5 bg-teal-lighten-5">
      <v-toolbar color="transparent" class="mb-4">
        <v-toolbar-title>看護師登録</v-toolbar-title>
        <v-spacer />
        <v-icon icon="fa-solid fa-user-nurse" color="primary" size="60" />
      </v-toolbar>
      <v-row>
        <v-col cols="6">
          <v-form ref="frmValid">
            <v-text-field
              v-model="name"
              label="名前"
              density="compact"
              variant="outlined"
              :rules="[rules.required]"
              class="mt-5"
            ></v-text-field>
            <v-radio-group v-model="tanto" inline hide-details class="mt-5">
              <v-radio label="病棟看護" value="byoto"></v-radio>
              <v-radio label="外来看護" value="gairai"></v-radio>
            </v-radio-group>
            <v-select
              v-show="tanto == 'gairai'"
              v-model="medical"
              :items="medicals"
              density="compact"
              item-title="name"
              item-value="id"
              hide-details
              single-line
              class="mt-5"
            >
            </v-select>
            <v-radio-group
              v-show="tanto == 'byoto'"
              v-model="byoto"
              inline
              hide-details
              class="mt-5"
            >
              <v-radio label="３階" value="3f"></v-radio>
              <v-radio label="４階" value="4f"></v-radio>
            </v-radio-group>
            <v-text-field
              v-model="loginid"
              label="LoginID"
              density="compact"
              variant="outlined"
              :rules="[rules.required, rules.counter]"
              class="mt-5"
            ></v-text-field>
            <v-card-actions class="mt-3">
              <v-spacer></v-spacer>
              <v-btn rounded="lg" elevation="2" color="update" @click="setData">更新</v-btn>
              <v-btn v-if="edit" rounded="lg" elevation="2" color="error" @click="deleteData"
                >削除</v-btn
              >
              <v-btn rounded="lg" elevation="2" @click="clear">クリア</v-btn>
              <v-btn rounded="lg" elevation="2" @click="$emit('dlgClose')">閉じる</v-btn>
            </v-card-actions>
          </v-form>
        </v-col>
        <v-col cols="6">
          <v-list density="compact" lines="two" style="max-height: 340px" class="overflow-y">
            <v-list-item
              v-for="(item, ix) in list"
              :key="item"
              :title="getListTitle(item.name, item.tanto)"
              :subtitle="
                getListSubTitle(item.tanto, item.medical, item.byoto) + '(' + item.id + ')'
              "
            >
              <template #append>
                <v-btn color="primary" size="small" icon="fa-solid fa-pencil" @click="selData(ix)">
                </v-btn>
              </template>
              <v-divider></v-divider>
            </v-list-item>
          </v-list>
        </v-col>
      </v-row>
    </v-card>
  </div>
</template>
