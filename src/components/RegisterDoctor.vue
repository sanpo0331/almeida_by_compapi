<script setup>
import { ref, onMounted } from 'vue'
import { firebaseDb } from '../plugins/firebase'
import { collection, query, orderBy, getDocs, setDoc, doc, deleteDoc } from 'firebase/firestore'

defineEmits(['dlgClose'])
const frmValid = ref(null)
const name = ref('')
const medical = ref('')
const id = ref('')
const yobi = ref('')
const list = ref([])
const edit = ref(false)
const validate = ref(false)
const rules = ref({
  required: (v) => (!validate.value ? true : !!v || '入力必須です'),
  counter: (v) => (!validate.value ? true : v.length === 5 || '５文字入力してください')
})
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
// function
async function setList() {
  list.value = []
  const q = query(collection(firebaseDb, 'doctors'), orderBy('medical'))
  const querySnapshot = await getDocs(q)
  querySnapshot.forEach((doc) => {
    list.value.push({
      id: doc.id,
      name: doc.data().name,
      medical: doc.data().medical,
      yobi: doc.data().yobi
    })
  })
}
function getMedicalName(getId) {
  const result = medicals.value.find(({ id }) => id === getId)
  return result.name
}
function selData(ix) {
  id.value = list.value[ix].id
  name.value = list.value[ix].name
  medical.value = list.value[ix].medical
  yobi.value = list.value[ix].yobi
  edit.value = true
}
function clear() {
  validate.value = false
  id.value = ''
  name.value = ''
  medical.value = ''
  edit.value = false
}
function setData() {
  validate.value = true
  frmValid.value.validate().then(async function (data) {
    if (!data.valid) return
    await setDoc(doc(firebaseDb, 'doctors', id.value), {
      name: name.value,
      medical: medical.value,
      yobi: yobi.value
    })
    clear()
    setList()
  })
}
async function deleteData() {
  await deleteDoc(doc(firebaseDb, 'doctors', id.value))
  clear()
  setList()
}
</script>

<template>
  <div>
    <v-card elevation="5" width="700" height="480" class="pa-5 bg-teal-lighten-5">
      <v-toolbar color="transparent" class="mb-4">
        <v-toolbar-title>医師登録</v-toolbar-title>
        <v-spacer />
        <v-icon icon="fa-solid fa-user-doctor" color="primary" size="60" />
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
            ></v-text-field>
            <v-select
              v-model="medical"
              :items="medicals"
              density="compact"
              item-title="name"
              item-value="id"
              :rules="[rules.required]"
            >
            </v-select>
            <v-text-field
              v-model="id"
              label="ID"
              density="compact"
              variant="outlined"
              validate-on="blur"
              :rules="[rules.required, rules.counter]"
            ></v-text-field>
            <v-card-actions class="mt-3">
              <v-spacer></v-spacer>
              <v-btn rounded="lg" elevation="2" color="update" @click="setData">更新</v-btn>
              <v-btn
                v-if="edit == true"
                rounded="lg"
                elevation="2"
                color="error"
                @click="deleteData"
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
              :key="ix"
              :title="item.name"
              :subtitle="getMedicalName(item.medical) + '(' + item.id + ')'"
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
