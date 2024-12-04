<script setup lang="ts">
// IMPORTS
import { ref, type Ref } from 'vue'
import { storeToRefs } from 'pinia'
import { DocumentIntelligenceService } from '@/service/DocumentIntelligenceService'
import { useClassificationStore, type ClassificationFile } from '@/stores/classificationStore'
import { createFormData } from '@/utils/common'
import { PoCModel } from '@/types/common'
import UploadButton from '@/components/common/UploadButton.vue'
import DocumentPreview from '@/components/stratesysDocInt/DocumentPreview.vue'

// SERVICE
const { getContractOrInvoiceDocument } = DocumentIntelligenceService.getInstance()

// STORE
const {
  uploadedDocument,
  allUploadedDocuments,
  classifiedByDocType,
  classifiedAsOthers,
  currentDocument,
  showClasificationSelectedFileModal,
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
  <main>
    <div class="button-container">
      <UploadButton
        title="Clasificar Documento"
        :loading="loading"
        :action="onFileChange"
        :model="PoCModel.Common"
      />
    </div>
    <div class="docs-container">
      <h1>Documentos Clasificados</h1>
      <!-- NO DOCS -->
      <div class="no-docs-container" v-if="Object.keys(classifiedByDocType).length === 0">
        <div class="no-docs">
          <h3>No se registraron documentos aún</h3>
          <img src="@/assets/icons/paper.png" alt="" />
        </div>
      </div>

      <div class="classificated-container" v-if="Object.keys(classifiedByDocType).length > 0">
        <!-- DOCUMENTOS CLASIFICADOS -->
        <div class="classificated-docs">
          <div
            class="doc-group"
            v-for="(documents, documentGroup) in classifiedByDocType"
            :key="documentGroup"
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
        <div v-if="classifiedAsOthers.length > 0" class="doc-group">
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
main {
  height: 100%;
  display: flex;
  justify-content: space-between;
  padding: 20px;
}

.button-container {
  width: 35%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.docs-container {
  width: 55%;
  background-color: var(--c-light-white);
  padding: 15px;
  border-radius: 5px;
}

.docs-container h1 {
  font-weight: bold;
  text-align: center;
}

.classificated-container {
  height: 90%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.classificated-docs {
  margin: 10px 0;
  display: flex;
  flex-direction: column;
  gap: 1.5em;
  height: 85%;
}

.doc-group {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: var(--c-white-header);
  padding: 15px;
  border-radius: 5px;
}

.doc-group .list-item {
  cursor: pointer;
  background: url('@/assets/icons/file.png') no-repeat left 2px;
  padding-left: 20px; /* the width of your image + some space */
  margin: 5px 0;
  list-style: none;
}

.group-title {
  display: flex;
  align-items: center;
  gap: 0.5em;
}

.group-title h1 {
  font-weight: normal;
}

.group-title img {
  width: 30px;
}

.no-docs-container {
  height: 90%;
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

.error-warning {
  cursor: pointer;
  list-style: none;
  background: url('@/assets/icons/file-error.png') no-repeat left 2px;
  padding-left: 20px; /* the width of your image + some space */
  margin: 5px 0;
  color: var(--c-error);
  font-weight: bold;
}

@media (max-width: 500px) {
  main {
    flex-direction: column;
    justify-content: flex-start;
    gap: 1em;
  }

  .button-container {
    width: 100%;
  }

  .docs-container {
    width: 100%;
    height: 100%;
    padding: 10px;
  }

  .doc-group {
    display: flex;
    flex-direction: column;
    align-items: start;
    justify-content: center;
    padding: 10px;
  }

  .group-title h1 {
    font-size: 20px;
  }

  .group-title img {
    width: 20px;
  }
}
</style>
