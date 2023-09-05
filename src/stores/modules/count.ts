import { defineStore } from 'pinia'

export const useCounterStore = defineStore('count', {
  state: () => ({
    count: 1
  }),
  actions: {
    accumulate() {
      this.count++
    }
  }
})
