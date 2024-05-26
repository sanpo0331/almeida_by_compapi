<script setup>
import { ref } from 'vue'
import { useUserStore } from '../store/user'
import { useRouter } from 'vue-router'
import RegisterDoctor from './RegisterDoctor.vue'
import RegisterNurse from './RegisterNurse.vue'
import RegisterPatient from './RegisterPatient.vue'
import DataImport from './DataImport.vue'
import LoginView from './LoginView.vue'

const store = useUserStore()
const router = useRouter()
const dlgImp = ref(false)
const dlgDoc = ref(false)
const dlgNur = ref(false)
const dlgPat = ref(false)
const dlgLogin = ref(false)

// function
function fncLogin() {
  dlgLogin.value = false
  if (store.id.substring(0, 1) === 'n') {
    router.push({ name: 'byoto' })
  } else {
    router.push({ name: 'doctor' })
  }
}
function fncLogout() {
  store.$reset()
  router.push({ name: 'home' })
}
</script>

<template>
  <v-dialog v-model="dlgDoc" width="auto">
    <register-doctor @dlg-close="dlgDoc = false" />
  </v-dialog>
  <v-dialog v-model="dlgNur" width="auto">
    <register-nurse @dlg-close="dlgNur = false" />
  </v-dialog>
  <v-dialog v-model="dlgPat" width="auto">
    <register-patient @dlg-close="dlgPat = false" />
  </v-dialog>
  <v-dialog v-model="dlgLogin" width="auto">
    <login-view @login-ok="fncLogin" @dlg-close="dlgLogin = false" />
  </v-dialog>
  <v-dialog v-model="dlgImp" width="auto">
    <data-import @dlg-close="dlgImp = false" />
  </v-dialog>

  <v-app-bar elevation="3">
    <!-- <v-app-bar-title>{{ !srore.id ? 'ログインしてください' : store.name }}</v-app-bar-title> -->
    <v-spacer />
    <!-- data import -->
    <v-btn
      color="primary"
      icon="fa-solid fa-file-import"
      elevation="2"
      class="mr-3"
      @click="dlgImp = true"
    />
    <!-- 医師登録 -->
    <v-btn
      v-show="store.id"
      color="primary"
      icon="fa-solid fa-user-doctor"
      elevation="2"
      class="mr-3"
      @click="dlgDoc = true"
    ></v-btn>
    <!-- 看護師登録 -->
    <v-btn
      v-show="store.id"
      color="primary"
      icon="fa-solid fa-user-nurse"
      elevation="2"
      class="mr-3"
      @click="dlgNur = true"
    ></v-btn>
    <!-- 患者登録 -->
    <v-btn
      v-show="store.id"
      color="primary"
      icon="fa-solid fa-hospital-user"
      elevation="2"
      class="mr-3"
      @click="dlgPat = true"
    ></v-btn>
    <!-- ログイン -->
    <v-btn
      v-show="!store.id"
      prepend-icon="fa-solid fa-right-to-bracket"
      round="lg"
      class="bg-primary"
      style="text-transform: none"
      @click="dlgLogin = true"
      >Login</v-btn
    >
    <v-btn
      v-show="store.id"
      prepend-icon="fa-solid fa-right-from-bracket"
      round="lg"
      class="bg-back"
      style="text-transform: none"
      @click="fncLogout"
      >Logout</v-btn
    >
  </v-app-bar>
</template>
