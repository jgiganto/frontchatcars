<script setup lang="ts">
// IMPORTS
import { storeToRefs } from 'pinia'
import { computed, onMounted, ref, watch, type ComputedRef, type Ref } from 'vue'
import { useParticularDocStore } from '@/stores/particularDocStore'
import AppCheckbox from '../common/AppCheckbox.vue'
import {
  docTypeEnum,
  type AllPoints,
  type ProhibitedPoints,
  type ValidationPoint,
} from '@/types/common'
import {
  adrCertificateData,
  cleanName,
  prohibitedCodes,
  washingDocumentCodes,
  washingDocumentFields,
} from '@/utils/common'

// STORE
const { showDocumentChecks, washingDocChecks, documentData, isDocInfoExtacted } =
  storeToRefs(useParticularDocStore())

// PROPS
const props = defineProps({
  fileUrl: {
    type: [String, null],
    required: true,
  },
})

// DATA
const originalImg: Ref<string> = ref('')
const rotatedImg: Ref<string> = ref('')
const zoomImg: Ref<HTMLElement> = ref({} as HTMLElement)
const zoomPdf: Ref<number> = ref(75)
const iframeKey: Ref<number> = ref(0)

const errors: Ref<string[]> = ref([])
const errorMsg: Ref<string> = ref('')

const visibleSections: Ref<boolean[]> = ref([
  isDocInfoExtacted.value,
  isDocInfoExtacted.value,
  isDocInfoExtacted.value,
  isDocInfoExtacted.value,
])
const loadingDocInfo: Ref<boolean> = ref(false)
const PoCValidationDone: Ref<boolean> = ref(false)

// HOOKS
onMounted(() => {
  if (props.fileUrl) {
    originalImg.value = props.fileUrl
    rotatedImg.value = props.fileUrl
  }

  washingDocChecks.value.sections.forEach((section) => {
    section.validationPoints.forEach((validationPoint) => {
      validationPoint.validated = false
    })
  })
})

// WATCHERS
// eslint-disable-next-line @typescript-eslint/no-unused-vars
watch(originalImg, async (newImg, oldImg) => {
  if (newImg) {
    createZoomEvent()
  }
})

// COMPUTED
const backgroundImgCss: ComputedRef<string> = computed(() => `url(${rotatedImg.value})`)
const iframeSrc = computed(() => {
  return originalImg.value + `#toolbar=0&navpanes=0&zoom=${zoomPdf.value}`
})

// METHODS
function handleClose() {
  showDocumentChecks.value = false
}

function showSectionsInfo() {
  let index = 0

  function showSection() {
    if (index < visibleSections.value.length) {
      visibleSections.value[index] = true
      index++
      setTimeout(showSection, 1000)
    } else {
      isDocInfoExtacted.value = true
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

function zoomIn() {
  zoomPdf.value += 25
  iframeKey.value++
}

function zoomOut() {
  if (zoomPdf.value > 25) zoomPdf.value -= 25
  iframeKey.value++
}

function createZoomEvent() {
  zoomImg.value?.addEventListener('mousemove', function (event: MouseEvent) {
    const targetElement = event.currentTarget as HTMLImageElement
    if (targetElement) {
      const x = (event.offsetX / targetElement.offsetWidth) * 100
      const y = (event.offsetY / targetElement.offsetHeight) * 100
      targetElement.style.backgroundPosition = x + '% ' + y + '%'
    }
  })
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
      pointArr.push({ title: point.title, isValidated: point.validated, required: point.required })
    })
  })

  return pointArr
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

function getProhibitedCodes() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const prohibitedPointsArray: any = []

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

function getValidationPoints() {
  const validationPoints = getValidatedChecks()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const validationPointsArray: any = []

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
</script>

<template>
  <div class="page-wrapper">
    <div class="document-detail">
      <!-- IMAGEN DEL DOCUMENTO -->
      <div class="image-wrapper">
        <figure
          v-if="!originalImg.startsWith('data:application/pdf')"
          ref="zoomImg"
          class="zoom-image"
          :style="[`background-image: ${backgroundImgCss}`]"
        >
          <img :src="rotatedImg" class="static-image" />
        </figure>
        <div class="zoom-buttons">
          <button @click="zoomOut()">-</button>
          <button @click="zoomIn()">+</button>
        </div>
        <iframe
          id="iframe"
          :key="iframeKey"
          class="pdf-image"
          :src="iframeSrc"
          frameborder="0"
          allow="fullscreen"
        >
        </iframe>
      </div>

      <!-- HEADER CERTIFICADO -->
      <div class="validation-wrapper">
        <div class="doc-number">
          <h3 class="title">
            Modelo:
            <u>
              {{
                documentData?.docType === docTypeEnum.ADR
                  ? 'Certificado ADR'
                  : 'Certificado de Lavado'
              }}
            </u>
          </h3>
          <div class="detail-header-icons">
            <img class="icon-close" src="@/assets/icons/close.svg" @click="handleClose" />
          </div>
        </div>

        <!-- CERTIFICADO DE LAVADO -->
        <div
          v-if="documentData?.docType === docTypeEnum.CertificadoLavado"
          class="section-container"
        >
          <div class="section-wrapper">
            <ul class="items-list">
              <li class="item" v-for="item in washingDocumentFields" :key="item.field">
                <b>{{ item.field }}:</b>
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
          <div class="prohibited-wrapper">
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
          <div class="export-button">
            <button
              class="button"
              :class="{ 'disabled-button': isDocInfoExtacted || visibleSections[0] }"
              v-if="!loadingDocInfo"
              @click="exportInfo"
            >
              Extraer datos
            </button>
            <button class="button disabled-button" v-else @click="exportInfo">
              <img class="spin" src="@/assets/icons/sync.svg" />
            </button>
          </div>

          <div class="content-wrapper">
            <div
              class="section-wrapper"
              :class="{ visible: visibleSections[0], invisible: !isDocInfoExtacted }"
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
              :class="{ visible: visibleSections[1], invisible: !isDocInfoExtacted }"
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
              :class="{ visible: visibleSections[2], invisible: !isDocInfoExtacted }"
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
              :class="{ visible: visibleSections[3], invisible: !isDocInfoExtacted }"
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
            <div v-if="isDocInfoExtacted" class="buttons">
              <button class="button" @click="handleClose">Rechazar documento</button>
              <button class="button" @click="handleClose">Validar documento</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page-wrapper {
  background-color: var(--c-grey-10);
  padding: 1rem;
  margin: 1rem 2.5rem;
}

.document-detail {
  display: flex;
  gap: 2rem;
  margin-top: 0.7rem;
  height: calc(100vh - 8.7rem);
  /* min-width: calc(100vw - 20rem); */
  overflow-y: auto;
  padding-bottom: 1rem;
}

.image-wrapper {
  position: relative;
  width: 45%;
}

.zoom-buttons {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.zoom-buttons > button {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 30px;
  height: 25px;
  border: none;
  cursor: pointer;
  border-radius: 8px;
  font-weight: bold;
  background-color: var(--c-turquoise-20);
}

.pdf-image {
  width: 100%;
  height: 45rem;
}

.zoom-image {
  cursor: zoom-in;
  position: absolute;
  overflow: hidden;
  background-size: 150%;
}

.zoom-image .static-image {
  transition: opacity 0.5s;
  width: 100%;
}

.zoom-image .static-image:hover {
  opacity: 0;
}

.validation-wrapper {
  display: flex;
  flex-direction: column;
  width: 55%;
  margin-right: 1rem;
  padding-bottom: 1rem;
}

.doc-number {
  display: flex;
  justify-content: space-between;
}

.doc-number .title {
  font-size: 1rem;
  margin-bottom: 1rem;
}

.button {
  cursor: pointer;
  margin-bottom: 1em;
  width: 180px;
  height: 2.5rem;
  border: none;
  color: var(--c-white);
  background-color: var(--c-turquoise-80);
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

.content-wrapper .invisible {
  opacity: 0;
  transition: opacity 1s ease-in-out;
}

.content-wrapper .visible {
  opacity: 1;
}

.section-container {
  display: flex;
  flex-direction: column;
}

.export-button {
  display: flex;
  justify-content: center;
}

.buttons {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 1.5rem;
  margin-top: 1.5rem;
}

.buttons .button:first-child {
  background-color: var(--c-turquoise-invent);
  color: var(--c-turquoise-80);
}

.section-wrapper {
  text-align: left;
  display: flex;
  flex-direction: column;
  margin-bottom: 1.5rem;
}

.section-title {
  margin-bottom: 8px;
}

.validation-list {
  background-color: var(--c-white);
  display: flex;
  flex-direction: column;
  padding: 0.5rem 1.5rem;
}

.validation-list .checkbox {
  margin: 0.4rem 1rem 0.4rem 0;
  text-align: left;
  line-height: 1.8;
}

.prohibited-wrapper {
  text-align: left;
}

.items-list {
  background-color: var(--c-white);
  display: flex;
  flex-direction: column;
  padding: 0.5rem 1.5rem;
  list-style: disc;
}

.items-list .item {
  margin: 0.2rem 0.7rem;
}

.items-list label {
  margin-bottom: 10px;
}

.error-text {
  text-align: left;
  color: var(--c-error);
  font-weight: bold;
}

.section-container:last-child {
  gap: 0.5rem;
}

.icon-close {
  width: 20px;
  cursor: pointer;
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
