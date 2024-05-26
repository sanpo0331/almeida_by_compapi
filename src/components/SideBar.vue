<script setup>
import { ref } from 'vue'
import RegisterGairaiDoctor from './RegisterGairaiDoctor.vue'
import RegisterByotoShift from './RegisterByotoShift.vue'
import cardGairaiTantoVue from './CardGairaiTanto.vue'
import cardNurseTanto from './CardNurseTanto.vue'

import { useUserStore } from '../store/user'

const store = useUserStore()
const dlgGairaiDoctor = ref(false)
const dlgByotoShift = ref(false)
const dlgGairaiTanto = ref(false)
const dlgNurseTanto = ref(false)

// function
function showDialog(arg) {
  switch (arg.id) {
    case 'dlg01':
      dlgGairaiDoctor.value = true
      break
    case 'dlg02':
      dlgByotoShift.value = true
      break
    case 'dlg03':
      dlgGairaiTanto.value = true
      break
    case 'dlg04':
      dlgNurseTanto.value = true
      break
  }
}
</script>

<template>
  <v-navigation-drawer class="bg-primary">
    <v-list nav @click:select="showDialog">
      <v-list-item-title class="app-title my-5">Almeida</v-list-item-title>
      <v-list-item
        v-show="store.id"
        prepend-icon="fa-solid fa-stethoscope"
        value="dlg01"
        active-class="teal-lighten-4"
      >
        <v-list-item-title>外来担当医登録</v-list-item-title>
      </v-list-item>
      <v-list-item
        v-show="store.id"
        prepend-icon="fa-regular fa-calendar-check"
        value="dlg02"
        active-class="teal-lighten-4"
      >
        <v-list-item-title>病棟看護師シフト登録</v-list-item-title>
      </v-list-item>
      <v-list-item
        prepend-icon="fa-regular fa-rectangle-list"
        value="dlg03"
        active-class="teal-lighten-4"
      >
        <v-list-item-title>外来担当一覧</v-list-item-title>
      </v-list-item>
      <v-list-item
        prepend-icon="fa-solid fa-clipboard-list"
        value="dlg04"
        active-class="teal-lighten-4"
      >
        <v-list-item-title>病棟看護師担当</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
  <!-- 外来担当医登録 -->
  <v-dialog v-model="dlgGairaiDoctor" width="auto">
    <RegisterGairaiDoctor @dlg-close="dlgGairaiDoctor = false" />
  </v-dialog>
  <!-- 病棟看護師シフト登録 -->
  <v-dialog v-model="dlgByotoShift" width="auto">
    <RegisterByotoShift @dlg-close="dlgByotoShift = false" />
  </v-dialog>
  <!-- 外来担当医一覧 -->
  <v-dialog v-model="dlgGairaiTanto">
    <cardGairaiTantoVue @dlg-close="dlgGairaiTanto = false" />
  </v-dialog>
  <!-- 病棟看護師 -->
  <v-dialog v-model="dlgNurseTanto">
    <cardNurseTanto @dlg-close="dlgNurseTanto = false" />
  </v-dialog>
</template>

<style scoped>
.app-title {
  font-family: 'Dela Gothic One', sans-serif;
  font-size: 2.5rem;
  text-align: center;
  line-height: 2.5rem;
}
</style>
