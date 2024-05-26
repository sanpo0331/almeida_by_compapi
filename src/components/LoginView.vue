<template>
  <div>
    <v-card elevation="5" width="400" class="pa-5 bg-teal-lighten-5">
      <v-toolbar color="transparent" class="mb-4">
        <v-toolbar-title>ログイン</v-toolbar-title>
        <v-spacer />
        <v-icon icon="fa-solid fa-user" color="primary" size="60" />
      </v-toolbar>
      <v-form ref="frmValid">
        <v-text-field
          ref="idInput"
          v-model="loginid"
          label="ID"
          density="compact"
          :rules="[rules.required, rules.counter]"
          counter="5"
          flat
          class="mt-5"
        ></v-text-field>
        <v-text-field
          v-model="password"
          label="password"
          density="compact"
          hide-details
          flat
          class="mt-5"
        ></v-text-field>
        <v-card-actions class="mt-3">
          <v-spacer />
          <v-btn rounded="lg" elevation="2" color="update" @click="transEventLogin">ログイン</v-btn>
          <v-btn rounded="lg" elevation="2" @click="$emit('dlgClose')">閉じる</v-btn>
        </v-card-actions>
      </v-form>
      <p class="errMessage">{{ errMessage }}</p>
    </v-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { firebaseDb } from '@/plugins/firebase'
import { doc, getDoc } from 'firebase/firestore'
import { useUserStore } from '../store/user'

const emit = defineEmits(['dlgClose', 'loginOk'])
const idInput = ref(null)
const frmValid = ref(null)
const store = useUserStore()
const loginid = ref('')
const password = ref('')
const dn = ref('')
const rules = ref({
  required: (v) => (!validate.value ? true : !!v || '入力必須です'),
  counter: (v) => (!validate.value ? true : v.length === 5 || '５文字入力してください')
})
const errMessage = ref('')
const validate = ref(false)

onMounted(() => {
  idInput.value.focus()
})
// function
async function transEventLogin() {
  validate.value = true
  frmValid.value.validate().then(async function (data) {
    if (!data.valid) return
    let docRef = ''
    if (loginid.value.substring(0, 1) === 'd') {
      dn.value = 'doctor'
      docRef = doc(firebaseDb, 'doctors', loginid.value)
    } else {
      dn.value = 'nurse'
      docRef = doc(firebaseDb, 'nurses', loginid.value)
    }
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      store.id = loginid.value
      store.name = docSnap.data().name
      store.medical = docSnap.data().medical
      store.byoto = docSnap.data().byoto
      emit('loginOk')
    } else {
      errMessage.value = 'IDを確認してください。'
    }
  })
}
</script>

<style scoped>
.errMessage {
  font-weight: 700;
  color: firebrick;
}
</style>
