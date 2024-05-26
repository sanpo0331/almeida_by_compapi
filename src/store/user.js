import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore('user', () => {
  // State
  const id = ref('')
  const name = ref('')
  const medical = ref('')
  const byoto = ref('')
  // Getters
  // Actions
  function $reset() {
    id.value = ''
    name.value = ''
    medical.value = ''
    byoto.value = ''
  }
  return {
    id,
    name,
    medical,
    byoto,
    $reset
  }
})
