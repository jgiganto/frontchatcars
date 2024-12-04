import { defineStore } from 'pinia'
import type { Model, WashingCertificate } from '@/types/common'
import washingDocChecks from '@/assets/mocks/washingDocChecks.json'

export type RootState = {
  washingDocChecks: WashingCertificate
  showDocumentChecks: boolean
  documentData: Model | null
  isDocInfoExtacted: boolean
  isAdrInfoExtracted: boolean
}

export const useParticularDocStore = defineStore({
  id: 'particular-doc',
  state: () =>
    ({
      washingDocChecks: washingDocChecks,
      showDocumentChecks: false,
      documentData: null,
      isDocInfoExtacted: false,
      isAdrInfoExtracted: false,
    }) as RootState,
  getters: {},
  actions: {},
})
