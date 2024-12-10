<script setup lang="ts">
// IMPORTS
import { ref, type Ref } from 'vue'
import { storeToRefs } from 'pinia'
import { DocumentIntelligenceService } from '@/service/DocumentIntelligenceService'
import {
  adrCertificateData,
  cleanName,
  createFormData,
  prohibitedCodes,
  washingDocumentCodes,
  washingDocumentFields,
} from '@/utils/common'
import UploadButton from '@/components/common/UploadButton.vue'
import AppCheckbox from '@/components/common/AppCheckbox.vue'
import { useParticularDocStore } from '@/stores/particularDocStore'
import {
  docTypeEnum,
  PoCModel,
  type AllPoints,
  type ProhibitedPoints,
  type ValidationPoint,
} from '@/types/common'

// SERVICE
const { getDocumentValidation } = DocumentIntelligenceService.getInstance()

// STORE
const modelStore = useParticularDocStore()
const { documentData, washingDocChecks, isAdrInfoExtracted } = storeToRefs(useParticularDocStore())

// DATA
const showDocPreview: Ref<boolean> = ref(false)
const loading: Ref<boolean> = ref(false)

const fileData: Ref<string | null> = ref(null)
const uploadFile: Ref<File | null> = ref(null)

const errors: Ref<string[]> = ref([])
const errorMsg: Ref<string> = ref('')

const visibleSections: Ref<boolean[]> = ref([
  isAdrInfoExtracted.value,
  isAdrInfoExtracted.value,
  isAdrInfoExtracted.value,
  isAdrInfoExtracted.value,
])
const loadingDocInfo: Ref<boolean> = ref(false)

const PoCValidationDone: Ref<boolean> = ref(false)

// METHODS
function handleClose() {
  modelStore.$reset()
  showDocPreview.value = false
  PoCValidationDone.value = false
  errors.value = []
  errorMsg.value = ''

  visibleSections.value = [
    isAdrInfoExtracted.value,
    isAdrInfoExtracted.value,
    isAdrInfoExtracted.value,
    isAdrInfoExtracted.value,
  ]

  washingDocChecks.value.sections.forEach((section) => {
    section.validationPoints.forEach((validationPoint) => {
      validationPoint.validated = false
    })
  })
}

function showSectionsInfo() {
  let index = 0

  function showSection() {
    if (index < visibleSections.value.length) {
      visibleSections.value[index] = true
      index++
      setTimeout(showSection, 1000)
    } else {
      isAdrInfoExtracted.value = true
    }
  }

  showSection()
}

function exportInfo() {
  loadingDocInfo.value = true

  setTimeout(() => {
    loadingDocInfo.value = false
    showSectionsInfo()
  }, 2000)
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

    await getDocumentValidation(formData)
      .then((res) => {
        if (res) {
          documentData.value = res.data
          showDocPreview.value = true
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

function checkValidationPoint(id: number, sectionId: number) {
  const validationPoint = washingDocChecks.value.sections
    .find((item) => item.id === sectionId)
    ?.validationPoints.find((item) => item.id === id)

  if (validationPoint) validationPoint.validated = !validationPoint.validated
}

function getValidatedChecks() {
  const pointArr: ValidationPoint[] = []
  washingDocChecks.value.sections.forEach((section) => {
    section.validationPoints.forEach((point) => {
      pointArr.push({
        title: point.title,
        isValidated: point.validated,
        required: point.required,
      })
    })
  })

  return pointArr
}

function getValidationPoints() {
  const validationPoints = getValidatedChecks()
  const validationPointsArray: AllPoints[] = []

  washingDocumentCodes.forEach((code) => {
    const validationPoint: ValidationPoint | undefined = validationPoints.find((point) =>
      point.title.includes(code),
    )
    const extractedFieldPoint = Object.keys(documentData.value!.extractedFields).find((key) =>
      key.includes(code),
    )

    if (validationPoint && extractedFieldPoint) {
      const value = documentData.value?.extractedFields[extractedFieldPoint]

      validationPointsArray.push({
        manualVal: validationPoint,
        pocPoint: { extractedFieldPoint, value },
      })
    }
  })

  validationPointsArray.forEach((points: AllPoints) => {
    if (points.pocPoint.value) {
      if (points.manualVal.isValidated) return
      else errors.value.push(points.manualVal.title)
    } else if (!points.pocPoint.value) {
      if (!points.manualVal.isValidated) return
      else errors.value.push(points.manualVal.title)
    }
  })
}

function getProhibitedCodes() {
  const prohibitedPointsArray: ProhibitedPoints[] = []

  prohibitedCodes.forEach((code) => {
    const extractedProhibitedPoint = Object.keys(documentData.value!.extractedFields).find(
      (prohibitedCode) => prohibitedCode.includes(code),
    )

    if (extractedProhibitedPoint) {
      const value = documentData.value?.extractedFields[extractedProhibitedPoint]
      prohibitedPointsArray.push({
        pocPoint: { extractedProhibitedPoint, value },
      })
    }
  })

  prohibitedPointsArray.forEach((prohibitedPoint: ProhibitedPoints) => {
    if (!prohibitedPoint.pocPoint.value) return
    else errors.value.push(prohibitedPoint.pocPoint.extractedProhibitedPoint)
  })
}

function handleValidationCheck() {
  if (!PoCValidationDone.value) {
    PoCValidationDone.value = true

    getProhibitedCodes()
    getValidationPoints()

    if (errors.value.length > 0) {
      errorMsg.value =
        'Se identificaron uno o más códigos prohibidos y/o algunas diferencias entre el documento y la validación. Por favor, te sugerimos revisarlo nuevamente para evitar posibles errores.'
    }
  } else handleClose()
}

function handleDocTitle(docType: string | undefined) {
  if (!docType) return 'No identificado'

  switch (docType) {
    case docTypeEnum.ADR:
      return 'Certificado ADR'
    case docTypeEnum.CertificadoLavado:
      return 'Certificado de Lavado'
    default:
      return 'No identificado'
  }
}
</script>

<template>
  <main class="register-container">
    <!-- DOC UPLOADER -->
    <div v-if="!showDocPreview" class="register-wrapper">
      <div class="register-uploader">
        <h3>Por favor, suba el documento para su validación:</h3>
        <UploadButton
          title="Cargar archivo"
          :action="onFileChange"
          :loading="loading"
          :model="PoCModel.Common"
        />
      </div>
      <!-- <span v-if="documentData?.legibilityStatus === false" class="error-message">{{
        documentData.message
      }}</span> -->
    </div>

    <!-- DOC PREVIEW -->
    <div v-if="showDocPreview" class="upload-document-wrapper">
      <div class="register-wrapper">
        <iframe
          id="iframe"
          class="preview-iframe"
          :src="fileData ? `${fileData}#toolbar=0&navpanes=0&zoom=75` : ''"
          frameborder="0"
          allow="fullscreen"
        ></iframe>
      </div>

      <!-- VALIDATION -->
      <div class="document-info">
        <!-- HEADER CERTIFICADO -->
        <div class="validation-header">
          <h2 class="title">
            Modelo:
            <u>
              {{ handleDocTitle(documentData?.docType) }}
            </u>
          </h2>
          <div v-if="documentData?.docType === docTypeEnum.ADR" class="export-button">
            <button
              class="button"
              :class="{
                'disabled-button': isAdrInfoExtracted || visibleSections[0],
              }"
              v-if="!loadingDocInfo"
              @click="exportInfo"
            >
              Extraer datos
            </button>
            <button class="button disabled-button" v-else @click="exportInfo">
              <img class="spin" src="@/assets/icons/sync.svg" />
            </button>
          </div>
        </div>

        <!-- CERTIFICADO DE LAVADO -->
        <div v-if="documentData?.docType === docTypeEnum.CertificadoLavado">
          <div class="section-wrapper">
            <ul class="items-list">
              <li class="item" v-for="item in washingDocumentFields" :key="item.field">
                <span>{{ item.field }}:</span>
                {{
                  item.key === 'Conductor'
                    ? cleanName(documentData?.extractedFields[item.key]?.toUpperCase())
                    : documentData?.extractedFields[item.key]?.toUpperCase()
                }}
              </li>
            </ul>
          </div>

          <div
            class="section-wrapper"
            v-for="(section, index) in washingDocChecks.sections"
            :key="index"
          >
            <span class="section-title">{{ section.title }}</span>
            <div class="validation-list">
              <AppCheckbox
                v-for="(item, index) in section.validationPoints"
                class="checkbox"
                :key="index"
                :id="item.id"
                :title="item.title"
                :validated="item.validated"
                :required="item.required"
                :errors="errors"
                @click="checkValidationPoint(item.id, section.id)"
              />
            </div>
          </div>
          <div class="section-wrapper">
            <span class="section-title">Códigos prohibidos</span>
            <ul class="items-list">
              <li
                class="item"
                v-for="(item, index) in washingDocChecks.prohibitedCodes"
                :key="index"
              >
                {{ item }}
              </li>
            </ul>
          </div>
          <span class="error-text" v-if="errors">{{ errorMsg }}</span>
          <div class="buttons">
            <button class="button" @click="handleClose">Rechazar documento</button>
            <button class="button" @click="handleValidationCheck">Validar documento</button>
          </div>
        </div>

        <!-- CERTIFICADO ADR -->
        <div v-if="documentData?.docType === docTypeEnum.ADR" class="section-container">
          <div class="content-wrapper">
            <div
              class="section-wrapper"
              :class="{
                visible: visibleSections[0],
                invisible: !isAdrInfoExtracted,
              }"
            >
              <ul class="items-list">
                <li class="item" v-for="item in adrCertificateData.section1" :key="item.key">
                  <b>{{ item.field }}:</b>
                  {{ documentData.extractedFields[item.key] }}
                </li>
              </ul>
            </div>
            <div
              class="section-wrapper"
              :class="{
                visible: visibleSections[1],
                invisible: !isAdrInfoExtracted,
              }"
            >
              <span class="section-title"><b>Descripción del vehículo:</b></span>
              <ul class="items-list">
                <li class="item" v-for="item in adrCertificateData.section3" :key="item.key">
                  {{ documentData.extractedFields[item.key] }}
                </li>
              </ul>
            </div>
            <div
              class="section-wrapper"
              :class="{
                visible: visibleSections[2],
                invisible: !isAdrInfoExtracted,
              }"
            >
              <span class="section-title"><b>Dispositivo de frenos de resistencia:</b></span>
              <ul class="items-list">
                <AppCheckbox
                  class="checkbox"
                  :title="adrCertificateData.section5[0].field"
                  :disabled="true"
                  :validated="
                    documentData.extractedFields[adrCertificateData.section5[0].key] ===
                    ':selected:'
                      ? true
                      : false
                  "
                />
                <AppCheckbox
                  class="checkbox"
                  :title="`${adrCertificateData.section5[1].field} 
                    ${documentData.extractedFields[adrCertificateData.section5[2].key] ? documentData.extractedFields[adrCertificateData.section5[2].key] : '________________'} 
                    t`"
                  :disabled="true"
                  :validated="
                    documentData.extractedFields[adrCertificateData.section5[1].key] ===
                    ':selected:'
                      ? true
                      : false
                  "
                />
              </ul>
            </div>
            <div
              class="section-wrapper"
              :class="{
                visible: visibleSections[3],
                invisible: !isAdrInfoExtracted,
              }"
            >
              <span class="section-title"
                ><b>Mercancías peligrosas autorizadas para su transporte:</b></span
              >
              <ul class="items-list">
                <AppCheckbox
                  v-for="item in adrCertificateData.section7"
                  :key="item.key"
                  class="checkbox"
                  :title="item.field"
                  :disabled="true"
                  :validated="
                    documentData.extractedFields[item.key] === ':selected:' ? true : false
                  "
                />
              </ul>
            </div>
            <div v-if="isAdrInfoExtracted" class="buttons">
              <button class="button" @click="handleClose">Rechazar documento</button>
              <button class="button" @click="handleClose">Validar documento</button>
            </div>
          </div>
        </div>

        <!-- DOCUMENTO NO LEGIBLE/ENTRENADO -->
        <div
          v-if="!documentData?.legibilityStatus || !documentData.docType"
          class="unidentified-doc"
        >
          <span class="error-message">{{ documentData?.message }}</span>
          <div class="buttons">
            <button class="button" @click="handleClose">Cerrar documento</button>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
.register-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
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
  flex-direction: column;
}

.register-uploader {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1em;
}

.error-message {
  color: var(--c-error);
  font-weight: bold;
  font-style: italic;
  margin-top: 8px;
  background-color: var(--c-white) 83;
  padding: 2px 0;
}

.upload-document-wrapper {
  display: flex;
  justify-content: space-between;
  height: calc(100vh - 5em);
  margin-top: 10px;
  margin-right: 20px;
}

.preview-iframe {
  height: 95%;
  width: 80%;
  display: flex;
}

.document-info {
  width: 45%;
  display: flex;
  flex-direction: column;
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
  font-size: 16px;
}

.items-list {
  background-color: var(--c-white);
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  padding: 0.5rem 1.5rem;
  list-style: disc;
}

.items-list .item {
  margin: 0.2rem 0.7rem;
}

.items-list .item span {
  font-weight: bold;
}

.section-wrapper {
  text-align: left;
  display: flex;
  flex-direction: column;
  margin-bottom: 1.5rem;
}

.section-wrapper .section-title {
  margin-bottom: 8px;
}

.section-wrapper .validation-list {
  background-color: var(--c-white);
  display: flex;
  flex-direction: column;
  padding: 0.5rem 1.5rem;
  border-radius: 5px;
}

.checkbox {
  margin: 0.4rem 1rem 0.4rem 0;
  text-align: left;
  line-height: 1.8;
}

.invisible {
  opacity: 0;
  transition: opacity 1s ease-in-out;
}

.visible {
  opacity: 1;
}

.buttons {
  display: flex;
  align-items: center;
  justify-content: end;
  gap: 2rem;
  margin-top: 2rem;
}

.buttons .button:first-child {
  color: var(--c-white);
  background-color: #5f6367;
}

.button {
  cursor: pointer;
  margin-bottom: 1em;
  width: 180px;
  height: 2.5rem;
  border: none;
  border-radius: 8px;
  padding: 0 1.2rem;
  background-color: #f9f9f9;
  color: #5f6367;
  border: 1px solid #5f6367;
}

.button .spin {
  margin-top: 4px;
  animation: spin linear 0.5s infinite;
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
}

.unidentified-doc {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
