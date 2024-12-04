<script setup lang="ts">
// IMPORTS
import { computed, onMounted, ref, type Ref } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { CustomVisionService } from '@/service/CustomVisionService'
import { usePredictionStore } from '@/stores/predictionStore'
import { createFormData } from '@/utils/common'
import { PoCModel } from '@/types/common'
import UploadButton from '@/components/common/UploadButton.vue'
import AppButton from '@/components/common/AppButton.vue'
import orders from '@/assets/mocks/orders.json'
import camaraSrc from '@/assets/icons/camera.png'

// SERVICE
const { getPrediction } = CustomVisionService.getInstance()

// ROUTER
const router = useRouter()

// STORE
const {
  orderNumber,
  upperProbabilityThreshold,
  lowerProbabilityThreshold,
  imagePrediction,
  originalGroupedPredictions,
  highProbabilityPredictions,
  manualOptions,
  butano6,
  butano12,
  butano125,
  butanoPropano35,
} = storeToRefs(usePredictionStore())
const { groupPredictionsByTag, resetStore, updateTotalsFromResponse, shouldSuggestReview } =
  usePredictionStore()
const predictionStore = usePredictionStore()

// TYPE
interface ExpectedOrder {
  name: string
  key: 'butano6' | 'butano12' | 'butano125' | 'butanoPropano35'
  quantity: number
}

interface Order {
  orderNumber: number
  name: string
  address: string
  date: string
  order: ExpectedOrder[] | null
}

// DATA
const loading: Ref<boolean> = ref(false)

const deliveryInfo: Ref<{ field: string; value: string | number | Date }[]> = ref([])
const expectedOrder: Ref<ExpectedOrder[] | null> = ref(null)
const orderComparationDone: Ref<boolean> = ref(false)
const comparationErrorMessage: Ref<string> = ref('')

const fileData: Ref<string | null> = ref(null)
const uploadFile: Ref<File | null> = ref(null)
const originalImageWidth: Ref<number> = ref(0)
const originalImageHeight: Ref<number> = ref(0)

const canvas: Ref<HTMLCanvasElement | null> = ref(null)
const image: Ref<HTMLImageElement | null> = ref(null)

const errorMsg: Ref<string> = ref('')

const predictionDone: Ref<boolean> = ref(false)

// HOOKS
onMounted(() => {
  resetStore()
  predictionDone.value = false
  orderComparationDone.value = false
  comparationErrorMessage.value = ''
})

// COMPUTED
const disabledConfirm = computed(() => {
  return (
    butano6.value === 0 &&
    butano12.value === 0 &&
    butano125.value === 0 &&
    butanoPropano35.value === 0
  )
})

// METHODS
function setOrder(order: Order) {
  orderNumber.value = order.orderNumber

  deliveryInfo.value = [
    { field: 'Nombre completo', value: order.name },
    { field: 'Dirección', value: order.address },
    {
      field: 'Fecha de entrega',
      value: formatDate(new Date()),
    },
  ]

  expectedOrder.value = order.order
}

function formatDate(isoDate: Date) {
  const date = new Date(isoDate)
  const formatter = new Intl.DateTimeFormat('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })

  // Formatear la fecha y limpiar las partes no deseadas
  let formattedDate = formatter.format(date)

  // Eliminar las comas y palabras como "de"
  formattedDate = formattedDate
    .replace(',', '') // Eliminar comas
    .replace(/\sde\s/gi, ' ') // Eliminar "de"

  // Capitalizar la primera letra de cada palabra
  return formattedDate
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

function goToSummary() {
  if (expectedOrder.value && !orderComparationDone.value) {
    orderComparationDone.value = true

    const errors: { name: string; expected: number }[] = []

    expectedOrder.value.forEach((item) => {
      const registeredQuantity: number = predictionStore[item.key]
      if (registeredQuantity != item.quantity) {
        errors.push({ name: item.name, expected: item.quantity })
      }
    })

    if (errors.length > 0)
      comparationErrorMessage.value =
        '¿Seguro que quieres confirmar la entrega? Algunos valores registrados no coinciden con el pedido esperado.'
    else router.push('/repsol-custom-vision/summary')
  } else router.push('/repsol-custom-vision/summary')
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

    await getPrediction(upperProbabilityThreshold.value, lowerProbabilityThreshold.value, formData)
      .then((res) => {
        if (res && res.data) {
          errorMsg.value = ''
          imagePrediction.value = res.data
          loading.value = false

          updateTotalsFromResponse(highProbabilityPredictions.value)

          originalGroupedPredictions.value = groupPredictionsByTag(
            imagePrediction.value?.predictions,
          )
          predictionDone.value = true

          if (image.value?.complete) {
            setCanvasSize() // If image is already loaded
          }
        }
      })
      .catch((err) => {
        console.log('ERR', err)
        loading.value = false
        errorMsg.value = 'Hubo un error en la carga. Por favor, inténtelo de nuevo.'
      })
  }
}

function setCanvasSize() {
  if (canvas.value && image.value) {
    originalImageWidth.value = image.value.naturalWidth // Use naturalWidth to get original dimensions
    originalImageHeight.value = image.value.naturalHeight // Use naturalHeight to get original dimensions

    // Get the displayed image dimensions
    const displayedWidth = image.value.offsetWidth // Actual displayed width
    const displayedHeight = image.value.offsetHeight // Actual displayed height

    // Set canvas dimensions
    canvas.value.width = displayedWidth

    canvas.value.height = displayedHeight
    // Calculate scaling factors
    const scaleX = displayedWidth / originalImageWidth.value
    const scaleY = displayedHeight / originalImageHeight.value

    // Draw bounding boxes with adjusted dimensions
    drawBoundingBoxes(scaleX, scaleY)
  }
}

function drawBoundingBoxes(scaleX: number, scaleY: number) {
  const ctx = canvas.value?.getContext('2d')
  if (!ctx) return

  if (canvas.value) ctx.clearRect(0, 0, canvas.value.width, canvas.value.height) // Clear previous drawings

  // Draw each bounding box with adjusted coordinates
  highProbabilityPredictions.value?.forEach((prediction) => {
    const { left, top, width, height } = prediction.boundingBox

    // Scale the bounding box dimensions
    const scaledLeft = left * scaleX
    const scaledTop = top * scaleY
    const scaledWidth = width * scaleX
    const scaledHeight = height * scaleY

    ctx.strokeStyle = 'red' // Color of the bounding box
    ctx.lineWidth = 2
    ctx.strokeRect(scaledLeft, scaledTop, scaledWidth, scaledHeight) // Draw the bounding box

    // Optionally, add the label
    ctx.fillStyle = 'red'
    ctx.font = '10px Arial'
    ctx.fillText(prediction.tagName, scaledLeft, scaledTop - 4) // Position label above the box
  })
}

function updateTotal(key: string, newTotal: number) {
  switch (key) {
    case 'butano6':
      butano6.value = newTotal
      break
    case 'butano12':
      butano12.value = newTotal
      break
    case 'butano125':
      butano125.value = newTotal
      break
    case 'butanoPropano35':
      butanoPropano35.value = newTotal
      break
  }
}
</script>

<template>
  <!-- NÚMERO DE PEDIDO -->
  <div v-if="!predictionDone && orderNumber === 0" class="home-container">
    <h1 class="app-name">APP REPARTIDORES</h1>
    <h2>Entregas:</h2>
    <h2
      class="order-number truncate"
      v-for="order in orders"
      :key="order.orderNumber"
      @click="setOrder(order as Order)"
    >
      {{ order.orderNumber }} - {{ order.name.toLocaleUpperCase() }}
    </h2>
  </div>

  <!-- OPCIONES PARA REGISTRAR ENTREGA -->
  <div v-if="orderNumber !== 0" class="home-container">
    <div class="delivery-info-container">
      <h1>PEDIDO {{ orderNumber }}</h1>
      <div class="delivery-info">
        <span v-for="field in deliveryInfo" :key="field.field">
          <b>{{ field.field }}:</b> {{ field.value }}<br />
        </span>
        <hr />
        <div>
          <b>Pedido:</b>
          <ul v-if="expectedOrder && expectedOrder.length > 0">
            <li v-for="order in expectedOrder" :key="order.name">
              <u>{{ order.name }} kg:</u> {{ order.quantity }}
              {{ order.quantity === 1 ? 'unidad' : 'unidades' }}
            </li>
          </ul>
          <span v-else> <br />No se especifica</span>
        </div>
      </div>
    </div>

    <!-- REGISTRO PEDIDO -->
    <div class="register-container">
      <div class="register-title">
        <h2>Registrar Pedido</h2>
        <span class="subtitle"
          >(También puedes registrar los datos de la entrega tomando una foto)</span
        >
      </div>

      <UploadButton
        v-if="orderNumber !== 0"
        title="TOMAR FOTO"
        :loading="loading"
        :action="onFileChange"
        width="250"
        :model="PoCModel.RepsolCustom"
        :img="camaraSrc"
        class="button"
      />

      <!-- PREVIEW FOTO -->
      <div v-if="predictionDone" class="prediction-container">
        <img ref="image" :src="fileData ? fileData : ''" alt="" @load="setCanvasSize" />
        <canvas ref="canvas"></canvas>
        <div class="prediction-text">
          <h2>Cantidades registradas</h2>
          <span class="subtitle">**Modificar en caso de ser necesario**</span>
        </div>
      </div>

      <!-- INPUTS BOMBONAS -->
      <div class="manual-text">
        <div class="tags-total">
          <div class="tag-group" v-for="option in manualOptions" :key="option.name">
            <div class="tag-group-count">
              <div class="name-group">
                <img :src="option.image" alt="" />
                <h3>{{ option.name }}</h3>
              </div>
              <input
                :class="shouldSuggestReview(option.id) ? 'warn' : ''"
                type="text"
                v-model="option.total"
                @input="updateTotal(option.key, option.total)"
              />
            </div>
            <span v-if="shouldSuggestReview(option.id)">Se sugiere revisar cantidades</span>
          </div>
        </div>

        <span
          v-if="comparationErrorMessage.length > 0"
          class="error-message"
          :style="{ 'text-align': 'center' }"
          >{{ comparationErrorMessage }}</span
        >

        <span class="error-message">{{ errorMsg }}</span>

        <AppButton
          title="CONFIRMAR"
          :action="goToSummary"
          :width="'250'"
          :model="PoCModel.RepsolCustom"
          :class="loading || disabledConfirm ? 'disabled-button' : ''"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.home-container {
  min-height: calc(100vh - 72.67px);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 1em;
  padding: 10px 0;
  font-family: var(--font-repsol);
}

.app-name {
  font-style: italic;
  font-family: var(--font-repsol-bold);
  background-color: var(--c-turquoise-80);
  color: var(--c-white);
  width: 100vw;
  padding: 10px 0;
}

.home-container .order-number {
  font-family: var(--font-repsol-bold);
  text-align: center;
  border: none;
  background-color: var(--c-orange-70);
  color: var(--c-white);
  border-radius: 6px;
  padding: 15px;
  font-size: 16px;
  letter-spacing: 2px;
  width: 90%;
}

.delivery-info-container {
  width: 90%;
}

.delivery-info-container h1 {
  font-weight: bold;
}

.delivery-info-container .delivery-info {
  border: var(--c-turquoise-80) 1px solid;
  border-radius: 4px;
  padding: 10px 15px;
  text-align: left;
}

.delivery-info-container .delivery-info hr {
  margin: 10px 0;
  border-top: var(--c-turquoise-80) 1px solid;
}

.register-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.register-container .manual-text {
  width: 85vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: left;
}

.prediction-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}

.prediction-container img {
  max-width: 90%;
  margin-top: 18px;
}

.prediction-container .prediction-text {
  width: 100%;
  padding: 10px 20px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  text-align: left;
}

.register-title {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.register-title span {
  padding: 0 8px;
}

.subtitle {
  font-style: italic;
  color: var(--c-grey-60);
}

.tags-total {
  width: 100%;
  margin: 10px 0;
}

.tag-group {
  display: flex;
  flex-direction: column;
}

.tag-group .name-group {
  display: flex;
  align-items: center;
  gap: 0.5em;
}

.tag-group .name-group img {
  width: 20px;
  margin: 0;
}

.tag-group input {
  max-width: 80px;
  height: 30px;
  text-align: center;
  border: none;
  border: var(--c-grey-50) solid 1px;
  border-radius: 4px;
}

.tag-group .warn {
  border: #e4002b solid 1px;
}

.tag-group span {
  color: #e4002b;
  font-style: italic;
  font-weight: bold;
  font-size: 14px;
  margin: 0;
}

.tag-group-count {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: var(--c-grey-50) solid 1px;
  border-radius: 4px;
  margin: 10px 0 5px;
  padding: 10px;
}

canvas {
  margin-top: 20px;
  position: absolute;
  top: 0;
  left: 50%; /* Move to the horizontal center */
  transform: translateX(-50%); /* Adjust back by half its width to center */
  pointer-events: none; /* Allows clicks to pass through the canvas to the image */
}

.error-message {
  color: #e4002b;
  font-weight: bold;
  font-style: italic;
  text-align: center;
  /* white-space: pre-line; */
}

.truncate {
  height: 56px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.disabled-button {
  background: var(--c-grey-20);
  pointer-events: none;
  cursor: auto;
}

.button {
  margin-top: 10px;
}
</style>
