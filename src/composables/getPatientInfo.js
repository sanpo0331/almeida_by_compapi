import { toValue } from 'vue'

export function useGetAge(birthday) {
  const bd = toValue(birthday)

  if (!bd) return 0

  const y = bd.substring(0, 4)
  const m = bd.substring(4, 6) - 1
  const d = bd.substring(6, 8)
  const today = new Date()
  const thisBd = new Date(today.getFullYear(), m, d)
  let age = today.getFullYear() - y

  if (today < thisBd) {
    age--
  }
  return {
    age
  }
}
