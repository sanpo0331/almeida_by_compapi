<script setup>
import { ref, onMounted } from 'vue'
import { firebaseDb } from '@/plugins/firebase'
import { collection, query, getDocs, setDoc, doc } from 'firebase/firestore'

defineEmits(['dlgClose'])
const frmValid = ref(null)
const id = ref('')
const name = ref('')
const gender = ref('m')
const medical = ref('')
const birthday = ref('')
const birthY = ref('')
const birthM = ref('')
const birthD = ref('')
const blood = ref('A')
const tel = ref('')
const nyuinFrom = ref('')
const nyuinTo = ref('')
const roomNo = ref('')
const selectType = ref('')
const selectDate = ref([])
const list = ref([])
const edit = ref(false)
const validate = ref(false)

const medicals = ref([
  { id: 'med101', name: '消化器内科' },
  { id: 'med102', name: '神経内科' },
  { id: 'med103', name: '循環器内科' },
  { id: 'med201', name: '外科・消化器外科' },
  { id: 'med301', name: '皮膚科' },
  { id: 'med302', name: '耳鼻咽喉科' },
  { id: 'med303', name: '小児科' }
])
const room = ref([
  { title: '301', byoto: '3f' },
  { title: '302', byoto: '3f' },
  { title: '303', byoto: '3f' },
  { title: '501', byoto: '4f' },
  { title: '502', byoto: '4f' },
  { title: '503', byoto: '4f' },
  { title: '510', byoto: '4f' }
])
const selectBirthY = ref([])
const selectBirthM = ref([])
const selectBirthD = ref([])
const dateDialog = ref(false)
const rules = ref({
  required: (v) => (!validate.value ? true : !!v || '入力必須です'),
  counter: (v) => (!validate.value ? true : v.length === 5 || '５文字入力してください')
})

// function
onMounted(() => {
  setList()
  for (let ix = 1939; ix < 2015; ix++) {
    selectBirthY.value.push(ix)
  }
  for (let ix = 1; ix < 13; ix++) {
    selectBirthM.value.push(ix)
  }
  for (let ix = 1; ix < 32; ix++) {
    selectBirthD.value.push(ix)
  }
})
async function setList() {
  list.value = []
  const q = query(collection(firebaseDb, 'patients'))
  const querySnapshot = await getDocs(q)
  querySnapshot.forEach((doc) => {
    list.value.push({
      id: doc.id,
      name: doc.data().name,
      gender: doc.data().gender,
      medical: doc.data().medical,
      blood: doc.data().blood,
      tel: doc.data().tel,
      birthday: doc.data().birthday,
      nyuinFrom: doc.data().nyuinFrom,
      nyuinTo: doc.data().nyuinTo,
      roomNo: doc.data().roomNo,
      byoto: doc.data().byoto
    })
  })
}
function clear() {
  name.value = ''
  gender.value = 'm'
  medical.value = ''
  birthday.value = ''
  birthY.value = ''
  birthM.value = ''
  birthD.value = ''
  blood.value = 'A'
  tel.value = ''
  nyuinFrom.value = ''
  nyuinTo.value = ''
  roomNo.value = ''
  selectType.value = ''
  selectDate.value = []
}
function selData(ix) {
  id.value = list.value[ix].id
  name.value = list.value[ix].name
  gender.value = list.value[ix].gender
  medical.value = list.value[ix].medical
  blood.value = list.value[ix].blood
  tel.value = list.value[ix].tel
  const bd = list.value[ix].birthday
  birthY.value = bd.substring(0, 4)
  birthM.value = bd.substring(4, 6)
  birthD.value = bd.substring(6, 8)
  nyuinFrom.value = list.value[ix].nyuinFrom
  nyuinTo.value = list.value[ix].nyuinTo
  roomNo.value = list.value[ix].roomNo
  edit.value = true
}
async function setData() {
  validate.value = true
  frmValid.value.validate().then(async function (data) {
    if (!data.valid) return
    const frmtBirthday =
      String(birthY.value) + ('00' + birthM.value).slice(-2) + ('00' + birthD.value).slice(-2)
    await setDoc(doc(firebaseDb, 'patients', id.value), {
      name: name.value,
      gender: gender.value,
      birthday: frmtBirthday,
      medical: medical.value,
      blood: blood.value,
      tel: tel.value,
      nyuinFrom: nyuinFrom.value,
      nyuinTo: nyuinTo.value,
      roomNo: roomNo.value
    })
    clear()
    setList()
  })
}
// DatePicker
function dlgDateOpen(type) {
  dateDialog.value = true
  selectType.value = type
}
// DatePicker 日付選択時
function updDate() {
  const ymd = selectDate.value.toLocaleString('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
  selectType.value == 'from' ? (nyuinFrom.value = ymd) : (nyuinTo.value = ymd)
  dateDialog.value = false
}
</script>

<template>
  <div>
    <v-card elevation="5" width="800" class="pa-5 bg-teal-lighten-5">
      <v-toolbar color="transparent" class="mb-4">
        <v-toolbar-title>患者登録</v-toolbar-title>
        <v-spacer />
        <v-icon icon="fa-solid fa-hospital-user" color="primary" size="60" />
      </v-toolbar>
      <v-row>
        <v-col cols="7">
          <v-form ref="frmValid">
            <v-text-field
              v-model="name"
              label="名前"
              density="compact"
              variant="outlined"
              :rules="[rules.required]"
            />

            <v-radio-group v-model="gender" inline>
              <v-radio label="男" value="m"></v-radio>
              <v-radio label="女" value="f"></v-radio>
            </v-radio-group>

            <v-select
              v-model="medical"
              label="診療科"
              :items="medicals"
              item-title="name"
              item-value="id"
              :rules="[rules.required]"
            >
            </v-select>

            <p>生年月日</p>
            <div class="d-flex aign-center mb-3">
              <v-select
                v-model="birthY"
                label="年"
                :items="selectBirthY"
                :rules="[rules.required]"
              />
              <v-select
                v-model="birthM"
                label="月"
                :items="selectBirthM"
                :rules="[rules.required]"
              />
              <v-select
                v-model="birthD"
                label="日"
                :items="selectBirthD"
                :rules="[rules.required]"
              />
            </div>

            <v-radio-group v-model="blood" inline>
              <v-radio label="A" value="A"></v-radio>
              <v-radio label="B" value="B"></v-radio>
              <v-radio label="O" value="O"></v-radio>
              <v-radio label="AB" value="AB"></v-radio>
            </v-radio-group>

            <v-text-field
              v-model="tel"
              label="電話番号"
              density="compact"
              variant="outlined"
              :rules="[rules.required]"
            />

            <p>入院期間</p>
            <div class="d-flex aign-center mb-3">
              <v-text-field
                v-model="nyuinFrom"
                prepend-inner-icon="fa-regular fa-calendar"
                clearable
                @click:prepend-inner="dlgDateOpen('from')"
              />
              &nbsp;～&nbsp;
              <v-text-field
                v-model="nyuinTo"
                prepend-inner-icon="fa-regular fa-calendar"
                clearable
                @click:prepend-inner="dlgDateOpen('to')"
              />
            </div>

            <v-select v-model="roomNo" label="病室" :items="room" clearable class="mb-3" />

            <v-dialog v-model="dateDialog">
              <v-card width="370">
                <v-locale-provider locale="ja">
                  <v-date-picker
                    v-model="selectDate"
                    hide-header
                    @update:model-value="updDate()"
                  ></v-date-picker>
                </v-locale-provider>
                <v-card-actions>
                  <v-spacer />
                  <v-btn elevation="2" @click="dateDialog = false">閉じる</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>

            <v-card-actions>
              <v-spacer />
              <v-btn rounded="lg" elevation="2" color="update" @click="setData">更新</v-btn>
              <v-btn rounded="lg" elevation="2" color="back" @click="$emit('dlgClose')"
                >閉じる</v-btn
              >
            </v-card-actions>
          </v-form>
        </v-col>
        <v-col cols="5">
          <v-list density="compact" lines="two" style="max-height: 565px" class="overflow-y">
            <v-list-item
              v-for="(item, ix) in list"
              :key="ix"
              :title="item.name"
              :subtitle="item.medical + '(' + item.id + ')'"
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
