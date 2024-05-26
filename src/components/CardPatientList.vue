<script setup>
import { ref, onMounted } from 'vue'
import { useUserStore } from '../store/user'
import { firebaseDb } from '@/plugins/firebase'
import { collection, query, where, getDocs } from 'firebase/firestore'

const store = useUserStore()
const list = ref([])

defineEmits(['setId'])
onMounted(async () => {
  const q = query(collection(firebaseDb, 'patients'), where('medical', '==', store.medical))
  const querySnapshot = await getDocs(q)

  querySnapshot.forEach((doc) => {
    list.value.push({
      id: doc.id,
      name: doc.data().name,
      roomNo: doc.data().roomNo
    })
  })
})
</script>

<template>
  <v-card elevation="5" width="400" class="bg-amber-lighten-4">
    <v-table>
      <thead class="bg-primary">
        <th class="text-left pa-3">ID</th>
        <th class="text-left pa-3">名前</th>
        <th class="text-left pa-3">病室</th>
      </thead>
      <tbody>
        <tr v-for="item in list" :key="item.id" class="bg-amber-lighten-4">
          <td class="pa-3">
            <v-btn @click="$emit('setId', item.id)">{{ item.id }}</v-btn>
          </td>
          <td class="pa-3">{{ item.name }}</td>
          <td class="pa-3">{{ item.roomNo === '' ? '-' : item.roomNo }}</td>
        </tr>
      </tbody>
    </v-table>
  </v-card>
</template>
