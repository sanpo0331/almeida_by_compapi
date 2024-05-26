<script setup>
import { ref } from 'vue'
import { firebaseDb } from '../plugins/firebase'
import { setDoc, doc } from 'firebase/firestore'
import { useUserStore } from '../store/user'

import SlotProps from './SlotProps.vue'

const store = useUserStore()
const props = defineProps({
  propsId: {
    type: String,
    default: ''
  }
})
const interviewContents = ref('')
const nextInterviewDate = ref('')
const nextInterviewTime = ref('')
const checkContents = ref([])
const isPickerActive = ref(false)

function selectDate(event) {
  console.log(event)
  nextInterviewDate.value = event
    .toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    })
    .replaceAll('/', '-')
  isPickerActive.value = false
}

async function setData() {
  const key = nextInterviewDate.value + props.propsId
  await setDoc(doc(firebaseDb, 'nextInterview', key), {
    patientId: props.propsId,
    interviewContents: interviewContents.value,
    nextDt: nextInterviewDate.value,
    nextTm: nextInterviewTime.value,
    doctorId: store.id,
    inspection: checkContents
  })
}
</script>

<template>
  <v-sheet height="700" width="600">
    <slot-props>
      <template #header="{ props: headerProps }">
        <p>{{ headerProps }}</p>
      </template>
    </slot-props>
    <v-textarea
      v-model="interviewContents"
      variant="outlined"
      label="問診内容"
      class="mb-2"
    ></v-textarea>
    <v-divider class="mb-2" />
    <section class="d-flex mb-2">
      <v-dialog width="auto">
        <template #activator="{ props: activatorProps }">
          <v-btn class="mr-5" v-bind="activatorProps">次回問診日</v-btn>
        </template>
        <!-- <v-date-picker bg-color="blue-lighten-4" elevation="3" hide-header @input="selectDate" /> -->
        <template #default="{ isPickerActive }">
          <v-date-picker
            bg-color="blue-lighten-4"
            elevation="3"
            hide-header
            @update:model-value="selectDate"
          />
        </template>
      </v-dialog>
      <p class="mr-5">{{ nextInterviewDate }}</p>
      <v-sheet width="150">
        <v-select
          v-model="nextInterviewTime"
          label="時間"
          variant="outlined"
          density="compact"
          :items="['9:00', '9:30', '10:00', '10:30', '11:00', '11:30']"
        />
      </v-sheet>
    </section>
    <p>検査項目</p>
    <v-row>
      <v-col cols="12" class="d-flex">
        <v-checkbox
          v-model="checkContents"
          label="身長・体重"
          value="0"
          class="mr-5"
          hide-details
        />
        <v-checkbox v-model="checkContents" label="血圧" value="1" class="mr-5" hide-details />
        <v-checkbox v-model="checkContents" label="尿" value="2" class="mr-5" hide-details />
        <v-checkbox v-model="checkContents" label="血液" value="3" class="mr-5" hide-details />
      </v-col>
      <v-col cols="12" class="d-flex">
        <v-checkbox v-model="checkContents" label="視力" value="4" class="mr-5" hide-details />
        <v-checkbox v-model="checkContents" label="聴力" value="5" class="mr-5" hide-details />
        <v-checkbox
          v-model="checkContents"
          label="胸部X線撮影"
          value="6"
          class="mr-5"
          hide-details
        />
      </v-col>
      <v-col cols="12" class="d-flex">
        <v-checkbox v-model="checkContents" label="心電図 " value="7" class="mr-5" hide-details />
        <v-checkbox
          v-model="checkContents"
          label="ホルター心電図"
          value="8"
          class="mr-5"
          hide-details
        />
      </v-col>
      <v-col cols="12" class="d-flex">
        <v-checkbox
          v-model="checkContents"
          label="食道・胃・十二指腸X線撮影"
          value="9"
          class="mr-5"
          hide-details
        />
        <v-checkbox
          v-model="checkContents"
          label="内視鏡（食道・胃・十二指腸）"
          value="10"
          class="mr-5"
          hide-details
        />
      </v-col>
      <v-col cols="12" class="d-flex">
        <v-checkbox
          v-model="checkContents"
          label="内視鏡（大腸）"
          value="11"
          class="mr-5"
          hide-details
        />
        <v-checkbox
          v-model="checkContents"
          label="腫瘍マーカー"
          value="12"
          class="mr-5"
          hide-details
        />
        <v-checkbox v-model="checkContents" label="骨密度" value="13" class="mr-5" hide-details />
      </v-col>
    </v-row>
    <p>{{ checkContents }}</p>
    <v-btn color="primary" @click="setData">登録</v-btn>
  </v-sheet>
</template>
