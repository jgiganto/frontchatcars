<script setup lang="ts">
// IMPORTS
import { ref, type Ref } from 'vue'
import { storeToRefs } from 'pinia'
import { DocumentIntelligenceService } from '@/service/DocumentIntelligenceService'
import {
  useClassificationStore,
  type ClassificationFile,
} from '../../../stores/classificationStore'
import { createFormData } from '@/utils/common'
import { PoCModel } from '@/types/common'
import DocumentPreview from '@/components/stratesysDocInt/DocumentPreview.vue'
import UploadButton from '@/components/common/UploadButton.vue'

// SERVICE
const { getContractOrInvoiceDocument } = DocumentIntelligenceService.getInstance()

// STORE
const {
  uploadedDocument,
  allUploadedDocuments,
  currentDocument,
  showClasificationSelectedFileModal,
  classifiedByDocType,
  classifiedAsOthers,
} = storeToRefs(useClassificationStore())
const { resetUploadedDocument } = useClassificationStore()

// DATA
const fileData: Ref<string | null> = ref(null)
const uploadFile: Ref<File | null> = ref(null)
const loading: Ref<boolean> = ref(false)

// METHODS
async function onFileChange(event: Event) {
  loading.value = true

  const target = event.target as HTMLInputElement

  if (target.files && target.files.length > 0) {
    uploadFile.value = target.files[0]
    const reader = new FileReader()

    reader.onload = () => {
      // Guardar el archivo como base64 en localStorage
      localStorage.setItem('uploadedFile', reader.result as string)
      fileData.value = reader.result as string // Solo para mostrar imágenes
    }

    reader.readAsDataURL(uploadFile.value)

    const formData = createFormData(uploadFile.value)

    await getContractOrInvoiceDocument(formData)
      .then((res) => {
        if (res && uploadFile.value && fileData.value) {
          uploadedDocument.value = {
            name: uploadFile.value.name,
            src: fileData.value,
            analisys: res.data,
          }

          allUploadedDocuments.value.push(uploadedDocument.value)
          resetUploadedDocument()
        }
      })
      .catch((err) => {
        console.log('ERR', err)
      })
      .finally(() => {
        loading.value = false
      })
  }
}

function openSelectedFile(document: ClassificationFile) {
  showClasificationSelectedFileModal.value = true
  currentDocument.value = document
}
</script>

<template>
  <main class="clasification-container">
    <!-- DOC CLASIFICATION BUTTON -->
    <div class="clasification-wrapper">
      <UploadButton
        title="Clasificar documentos"
        :action="onFileChange"
        :loading="loading"
        :model="PoCModel.Common"
      />
    </div>

    <!-- DOCS CLASIFICATED -->
    <div class="clasificated-wrapper">
      <div class="classificated-doc-groups">
        <div
          v-for="(documents, documentGroup) in classifiedByDocType"
          :key="documentGroup"
          class="clasificated-doc"
        >
          <div class="group-title">
            <img src="../../../assets/icons/folder.png" alt="" />
            <h1>
              {{ documentGroup.toString().includes('Contratos') ? 'Contratos' : 'Facturas' }}
            </h1>
          </div>
          <div>
            <ul>
              <li
                v-for="document in documents"
                :key="document.name"
                :class="
                  Object.keys(document.analisys.errorFields).length > 0
                    ? 'error-warning'
                    : 'list-item'
                "
                @click="openSelectedFile(document)"
              >
                {{ document.name }}
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- OTROS -->
      <div v-if="classifiedAsOthers.length > 0" class="clasificated-doc">
        <div class="group-title">
          <img src="../../../assets/icons/folder.png" alt="" />
          <h1>Otros</h1>
        </div>
        <div>
          <ul>
            <li
              v-for="document in classifiedAsOthers"
              :key="document.name"
              class="list-item"
              @click="openSelectedFile(document)"
            >
              {{ document.name }}
            </li>
          </ul>
        </div>
      </div>

      <div
        v-if="Object.keys(classifiedByDocType).length === 0 && classifiedAsOthers.length === 0"
        class="no-docs"
      >
        <h3>No se registraron documentos aún</h3>
        <img src="@/assets/icons/paper.png" alt="" />
      </div>
    </div>

    <DocumentPreview
      v-if="showClasificationSelectedFileModal && currentDocument"
      :document="currentDocument.analisys"
      :src="currentDocument.src"
    />
  </main>
</template>

<style scoped>
.clasification-container {
  height: 100%;
  padding: 30px;
  display: flex;
  justify-content: space-between;
}

.clasification-container h3 {
  font-weight: bold;
  text-align: center;
}

.clasification-container img {
  width: 100px;
}

.clasification-wrapper {
  background-color: var(--c-light-white);
  width: 45%;
  height: 100%;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.no-docs {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  gap: 0.5rem;
}

.no-docs h3 {
  font-size: 14px;
}

.no-docs img {
  width: 25px;
}

.clasificated-wrapper {
  width: 50%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.classificated-doc-groups {
  display: flex;
  flex-direction: column;
  gap: 1.5em;
}

.clasificated-doc {
  background-color: var(--c-light-white);
  border-radius: 5px;
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.clasificated-doc .group-title {
  display: flex;
  align-items: center;
  gap: 0.5em;
}

.clasificated-doc .group-title img {
  width: 30px;
}

.clasificated-doc .list-item {
  cursor: pointer;
  background: url('@/assets/icons/file.png') no-repeat left 2px;
  padding-left: 20px; /* the width of your image + some space */
  margin: 5px 0;
  list-style: none;
}

.error-warning {
  cursor: pointer;
  list-style: none;
  background: url('@/assets/icons/file-error.png') no-repeat left 2px;
  padding-left: 20px; /* the width of your image + some space */
  margin: 5px 0;
  color: var(--c-error);
  font-weight: bold;
}
</style>
