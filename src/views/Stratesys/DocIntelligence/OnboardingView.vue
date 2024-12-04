<script setup lang="ts">
// IMPORTS
import { computed, onMounted, ref, type Ref } from 'vue'
import { storeToRefs } from 'pinia'
import { DocumentIntelligenceService } from '@/service/DocumentIntelligenceService'
import { useOnboardingStore } from '../../../stores/onboardingStore'
import { createFormData } from '@/utils/common'
import { PoCModel } from '@/types/common'
import UploadButton from '@/components/common/UploadButton.vue'

// SERVICE
const { getIdentityDocument } = DocumentIntelligenceService.getInstance()

// STORE
const onboardingStore = useOnboardingStore()
const { idData } = storeToRefs(useOnboardingStore())

// HOOKS
onMounted(() => {
  onboardingStore.$reset()
  isDataConfirm.value = false
})

// TYPE
type DateField = 'DateOfBirth' | 'DateOfExpiration'

// DATA
const showDocPreview: Ref<boolean> = ref(false)
const loading: Ref<boolean> = ref(false)
const isDataConfirm: Ref<boolean> = ref(false)

const fileData: Ref<string | null> = ref(null)
const uploadFile: Ref<File | null> = ref(null)

const errors: Ref<string[]> = ref([])
const errorMsg: Ref<string> = ref('')

const identityData = [
  { name: 'Número de Documento', field: 'DocumentNumber' },
  { name: 'Nombre/s', field: 'FirstName' },
  { name: 'Apellido/s', field: 'LastName' },
  { name: 'Dirección', field: 'Address' },
]

const datesData: { name: string; field: DateField }[] = [
  { name: 'Fecha de Nacimiento', field: 'DateOfBirth' },
  { name: 'Fecha de Expiración', field: 'DateOfExpiration' },
]

// COMPUTED
const computedDateFields = computed(() => {
  return {
    DateOfBirth: {
      get: () => {
        const date = idData.value?.extractedFields?.DateOfBirth
        return date ? new Date(date).toISOString().split('T')[0] : '' // Format to YYYY-MM-DD
      },
      set: (value: string) => {
        if (idData.value?.extractedFields) {
          idData.value.extractedFields.DateOfBirth = new Date(value).toISOString()
        }
      },
    },
    DateOfExpiration: {
      get: () => {
        const date = idData.value?.extractedFields?.DateOfExpiration
        return date ? new Date(date).toISOString().split('T')[0] : '' // Format to YYYY-MM-DD
      },
      set: (value: string) => {
        if (idData.value?.extractedFields) {
          idData.value.extractedFields.DateOfExpiration = new Date(value).toISOString()
        }
      },
    },
  } as Record<string, { get: () => string; set: (value: string) => void }>
})

// METHODS
function handleClose() {
  showDocPreview.value = false
  errors.value = []
  errorMsg.value = ''
  onboardingStore.$reset()
  isDataConfirm.value = false
}

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

    await getIdentityDocument(formData)
      .then((res) => {
        if (res) {
          idData.value = res.data
          if (idData.value?.legibilityStatus) showDocPreview.value = true
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
</script>

<template>
  <main class="register-container">
    <!-- DOC UPLOADER -->
    <div v-if="!showDocPreview" class="register-wrapper">
      <div class="register-uploader">
        <h3>Por favor, para iniciar el onboarding, suba su documento de identificación:</h3>
        <UploadButton
          title="Cargar Doc. Identificación"
          :action="onFileChange"
          :loading="loading"
          :model="PoCModel.Common"
        />
      </div>
    </div>

    <!-- DOC PREVIEW -->
    <div v-if="showDocPreview" class="upload-document-wrapper">
      <div class="register-wrapper">
        <iframe
          id="iframe"
          class="preview-iframe"
          :src="fileData ? fileData : ''"
          frameborder="0"
          allow="fullscreen"
        ></iframe>
      </div>

      <!-- VALIDATION -->
      <div class="document-info">
        <!-- HEADER CERTIFICADO -->
        <div>
          <div v-if="idData && !isDataConfirm" class="validation-header">
            <h1 class="title">
              <u> Documento de Identificación </u>
            </h1>
          </div>

          <!-- DOCUMENTO DE IDENTIFICACIÓN-->
          <div v-if="idData && !isDataConfirm">
            <div class="section-wrapper">
              <div v-for="data in identityData" :key="data.field">
                <label :for="data.field.toLocaleLowerCase()">{{ data.name }}</label>
                <input
                  type="text"
                  :name="data.field.toLocaleLowerCase()"
                  :id="data.field.toLocaleLowerCase()"
                  v-model="idData.extractedFields[data.field]"
                />
              </div>
              <div v-for="data in datesData" :key="data.field">
                <label :for="data.field.toLowerCase()">{{ data.name }}</label>
                <input
                  type="date"
                  :name="data.field.toLowerCase()"
                  :id="data.field.toLowerCase()"
                  :value="computedDateFields[data.field]?.get()"
                  @input="
                    computedDateFields[data.field]?.set(($event.target as HTMLInputElement).value)
                  "
                />
              </div>
            </div>
          </div>

          <!-- CONFIRMACIÓN ONBOARDING -->
          <div v-if="idData && isDataConfirm" class="summary-wrapper">
            <h1>¡Gracias por confirmar tus datos!</h1>
            <h2>El Onboarding se realizará con la siguiente información:</h2>
            <div class="summary-data">
              <ul>
                <li v-for="data in identityData" :key="data.field">
                  <b>{{ data.name }}:</b> {{ idData.extractedFields[data.field] }}
                </li>
                <li v-for="data in datesData" :key="data.field">
                  <b>{{ data.name }}:</b>
                  {{ new Date(idData.extractedFields[data.field]!).toISOString().split('T')[0] }}
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div v-if="idData && !isDataConfirm" class="buttons">
          <button class="button" @click="handleClose">Cancelar</button>
          <button class="button" @click="isDataConfirm = true">Continuar</button>
        </div>

        <div v-if="idData && isDataConfirm" class="buttons">
          <button class="button" @click="handleClose">Finalizar Onboarding</button>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
.register-container {
  height: calc(100vh - 4em);
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background-image: url('../../../assets/bg-1.jpg');
  background-size: cover;
  background-repeat: no-repeat;
  overflow: hidden;
}

.register-container h3 {
  font-weight: bold;
}

.register-wrapper {
  background-color: var(--c-light-white);
  width: 50%;
  height: 85vh;
  margin-left: 20px;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.register-uploader {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1em;
}

.upload-document-wrapper {
  display: flex;
  justify-content: space-between;
  height: calc(100vh - 5em);
  margin-top: 50px;
  margin-right: 20px;
}

.preview-iframe {
  height: 95%;
  width: 80%;
  display: flex;
}

.document-info {
  width: 45%;
  height: 85vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding-right: 20px;
  padding-bottom: 20px;
  margin-bottom: 20px;
  overflow-y: scroll;
  overflow-x: hidden;
  scrollbar-width: thin;
}

.validation-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.title {
  margin-bottom: 10px;
}

.items-list {
  background-color: var(--c-white);
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  padding: 1rem 1.5rem;
  list-style: disc;
}

.items-list .item {
  margin: 0.3rem 0.7rem;
}

.items-list .item span {
  font-weight: bold;
}

.summary-wrapper h1,
.summary-wrapper h2 {
  margin-bottom: 10px;
}

.summary-wrapper h2 {
  font-style: italic;
}

.summary-data {
  background-color: var(--c-light-white);
  padding: 20px 0;
  font-size: 16px;
  border-radius: 5px;
  list-style-image: url('../../../assets/icons/right.png');
}

.summary-data ul {
  display: flex;
  flex-direction: column;
  gap: 1em;
}

.section-wrapper div {
  font-size: 16px;
  text-align: left;
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
}

.section-wrapper label {
  font-weight: bold;
  margin-bottom: 5px;
}

.section-wrapper input {
  border: none;
  border-radius: 5px;
  padding: 10px;
  font-size: 16px;
}

.buttons {
  display: flex;
  align-items: center;
  justify-content: end;
  gap: 2rem;
  margin-top: 2rem;
}

.button {
  cursor: pointer;
  margin-bottom: 1em;
  width: 200px;
  height: 3rem;
  border: none;
  font-size: 16px;
  border-radius: 8px;
  padding: 0 1.2rem;
  color: var(--c-white);
  background-color: #5f6367;
}

.disabled-button {
  background: var(--c-grey-30);
  border-color: var(--c-grey-30);
  color: var(--c-grey-50);
  pointer-events: none;
  cursor: auto;
}

.error-text {
  text-align: left;
  color: var(--c-error);
  font-weight: bold;
  font-size: 16px;
}
</style>
