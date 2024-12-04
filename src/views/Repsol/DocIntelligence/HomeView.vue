<script setup lang="ts">
import { ref, type Ref } from 'vue'
import { storeToRefs } from 'pinia'
import { DocumentIntelligenceService } from '@/service/DocumentIntelligenceService'
import { useParticularDocStore } from '@/stores/particularDocStore'
import { createFormData } from '@/utils/common'
import { PoCModel } from '@/types/common'
import IconEye from '@/components/repsolDocInt/IconEye.vue'
import UploadButton from '@/components/common/UploadButton.vue'
import TheSideMenu from '@/components/repsolDocInt/TheSideMenu.vue'
import CertificateChecks from '@/components/repsolDocInt/CertificateChecks.vue'

// STORE
const { showDocumentChecks, isDocInfoExtacted, documentData } = storeToRefs(useParticularDocStore())

// SERVICE
const { getDocumentValidation } = DocumentIntelligenceService.getInstance()

// DATA
const documents: Ref<File[]> = ref([])
const uploadFile = ref<File | null>(null)
const fileData = ref<string | null>(null)
const loading: Ref<boolean> = ref(false)

// METHODS
async function onFileChange(event: Event) {
  loading.value = true

  const target = event.target as HTMLInputElement

  if (target.files && target.files.length > 0) {
    uploadFile.value = target.files[0]
    const reader = new FileReader()

    if (documents.value.length === 0) {
      documents.value.push(uploadFile.value)
    } else {
      documents.value[0] = uploadFile.value
    }

    reader.onload = () => {
      // Guardar el archivo como base64 en localStorage
      localStorage.setItem('uploadedFile', reader.result as string)
      fileData.value = reader.result as string // Solo para mostrar imágenes
    }

    reader.readAsDataURL(uploadFile.value)

    const formData = createFormData(uploadFile.value)

    await getDocumentValidation(formData)
      .then((res) => {
        if (res) {
          console.log('RES', res.data)
          isDocInfoExtacted.value = false
          documentData.value = res.data
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

function handleOpen() {
  showDocumentChecks.value = true
}
</script>

<template>
  <main class="main-container">
    <TheSideMenu />
    <div v-if="!showDocumentChecks" class="content-container">
      <div class="doc-uploader-wrapper">
        <UploadButton
          title="Cargar Archivo"
          :loading="loading"
          :action="onFileChange"
          :model="PoCModel.RepsolDocInt"
          width="200"
        />

        <div
          v-if="documents.length > 0 && documentData?.legibilityStatus && !loading"
          class="docs-wrapper"
        >
          <div v-for="(file, index) in documents" :key="index" class="doc-attached">
            <span>{{ file.name }}</span>
            <div @click="handleOpen" class="item-action">
              <IconEye />
              <span>Ver Documento</span>
            </div>
          </div>
        </div>
        <div v-else-if="loading" class="docs-wrapper">
          <span>Cargando...</span>
        </div>
        <div v-else class="docs-wrapper">
          <span>No hay documentos adjuntos</span>
        </div>
      </div>

      <span v-if="documentData?.legibilityStatus === false" class="legibility-warning">{{
        documentData.message
      }}</span>
    </div>
    <CertificateChecks v-if="showDocumentChecks" :file-url="fileData" img-name="imgName" />
  </main>
</template>

<style scoped>
.main-container {
  display: flex;
}

.content-container {
  min-width: calc(100vw - var(--sidemenu-size));
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 0.5em;
}

.legibility-warning {
  color: var(--c-error);
  font-weight: bold;
}

.doc-uploader-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2em;
}

.upload-wrapper {
  padding: 10px 0;
}

.docs-wrapper {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.5em;
  border: 1px solid var(--c-grey-30);
  border-radius: 5px;
  padding: 0.7em;
  width: 30em;
}

.doc-attached {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.item-action {
  display: flex;
  align-items: center;
  cursor: pointer;
  color: var(--c-turquoise-80);
}

.item-action svg {
  margin-right: 0.5rem;
  width: 20px;
}
</style>
