import { defineStore } from 'pinia'
import type { Model } from '@/types/common'

export type RootState = {
  idData: Model | null
}

export const useOnboardingStore = defineStore({
  id: 'onboarding',
  state: () =>
    ({
      idData: null,
    }) as RootState,
  getters: {},
  actions: {},
})
