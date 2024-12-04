import { defineStore } from 'pinia'
import type { Model } from '@/types/common'

export interface Analisys extends Model {
  errorFields:
    | {
        [key: string]: string
      }
    | object
}

export interface ClassificationFile {
  name: string
  src: string
  analisys: Analisys
}

interface ClassifiedDocuments {
  [docType: string]: ClassificationFile[]
}

export type RootState = {
  uploadedDocument: ClassificationFile
  allUploadedDocuments: ClassificationFile[] | []
  currentDocument: ClassificationFile | null
  showClasificationSelectedFileModal: boolean
}

export const useClassificationStore = defineStore({
  id: 'classification',
  state: () =>
    ({
      uploadedDocument: { name: '', src: '', analisys: {} },
      allUploadedDocuments: [],
      currentDocument: null,
      showClasificationSelectedFileModal: false,
    }) as RootState,
  getters: {
    classifiedByDocType(state): ClassifiedDocuments {
      return state.allUploadedDocuments.reduce(
        (acc: ClassifiedDocuments, doc: ClassificationFile) => {
          const docType = doc.analisys.docType

          // Skip documents with docType 'Otros' or empty
          if (docType === 'Otros' || docType === '') {
            return acc
          }

          // Initialize array for this docType if it doesn't exist
          if (!acc[docType]) {
            acc[docType] = []
          }

          // Add the document to the corresponding docType array
          acc[docType].push(doc)

          return acc
        },
        {},
      )
    },

    classifiedAsOthers(state): ClassificationFile[] {
      return state.allUploadedDocuments.filter(
        (doc: ClassificationFile) =>
          doc.analisys.docType === 'Otros' || doc.analisys.docType === '',
      )
    },
  },
  actions: {
    resetUploadedDocument() {
      this.uploadedDocument = { name: '', src: '', analisys: {} as Analisys }
    },
  },
})
