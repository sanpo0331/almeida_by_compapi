<script setup>
import { ref } from 'vue'
import CardBasicItems from './CardBasicItems.vue'
import CardPatientList from './CardPatientList.vue'
import RegisterInterviewContents from './RegisterInterviewContents.vue'

const selectId = ref('')
const basicKey = ref('')
const showBasicItems = ref(false)

function setPropsId(id) {
  selectId.value = id
  basicKey.value = new Date().toTimeString()
  showBasicItems.value = true
}
</script>

<template>
  <h3>ForDoctor</h3>
  <div class="d-flex">
    <card-patient-list class="mr-5" @set-id="setPropsId" />
    <div>
      <card-basic-items v-show="showBasicItems" :key="basicKey" :props-id="selectId" class="mb-5" />
      <register-interview-contents :props-id="selectId" />
    </div>
  </div>
  <!-- <div class="d-flex justify-start">
    <card-patient-list class="mr-5" @set-id="setPropsId" />
    <card-basic-items v-show="showBasicItems" :key="basicKey" :props-id="selectId" />
  </div> -->
</template>
