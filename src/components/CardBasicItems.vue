<script setup>
import { ref, onMounted } from 'vue'
import { firebaseDb } from '@/plugins/firebase'
import { doc, getDoc } from 'firebase/firestore'
import { useGetAge } from '../composables/getPatientInfo'

const props = defineProps({
  propsId: {
    type: String,
    default: ''
  }
})

const snapData = ref('')

onMounted(async () => {
  const docRef = doc(firebaseDb, 'patients', props.propsId)
  const docSnap = await getDoc(docRef)
  snapData.value = docSnap.data()
})
</script>

<template>
  <v-card elevation="0">
    <h3>Basic Items</h3>
    <p>ID:{{ propsId }}</p>
    <p>名前:{{ snapData.name }}</p>
    <p>年齢:{{ useGetAge(snapData.birthday).age }}歳</p>
    <p>性別:{{ snapData.gender === 'm' ? '男' : '女' }}</p>
  </v-card>
</template>
