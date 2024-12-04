<script setup lang="ts">
// IMPORTS
import { onMounted, ref, type Ref } from 'vue'
import { storeToRefs } from 'pinia'
import TheCamera from 'simple-vue-camera'
import { CustomVisionService } from '@/service/CustomVisionService'
import { usePredictionStore } from '@/stores/predictionStore'
import { createFormData } from '@/utils/common'
import { PoCModel } from '@/types/common'
import UploadButton from '@/components/common/UploadButton.vue'
import AppButton from '@/components/common/AppButton.vue'

// SERVICE
const { getInvoice } = CustomVisionService.getInstance()

// STORE
const { cartImagePrediction } = storeToRefs(usePredictionStore())
const { resetStore } = usePredictionStore()

// DATA
const fileData: Ref<string | null> = ref(null)
const uploadFile: Ref<File | null> = ref(null)
const camera: Ref<InstanceType<typeof TheCamera> | null> = ref(null)
const loading: Ref<boolean> = ref(false)
const isCamaraOn: Ref<boolean> = ref(false)
const errorMsg: Ref<string> = ref('')
const predictionDone: Ref<boolean> = ref(false)
const lowerProbabilityThreshold: Ref<number> = ref(0.2)
const upperProbabilityThreshold: Ref<number> = ref(0.5)

// HOOKS
onMounted(() => {
  resetStore()
})

// METHODS
function openCamara() {
  if (camera.value) {
    camera.value.start()
    isCamaraOn.value = true
  } else {
    console.error('Camera not initialized.')
  }
}

function reset() {
  resetStore()
  fileData.value = null
  uploadFile.value = null
  predictionDone.value = false
  errorMsg.value = ''
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

    await getInvoice(upperProbabilityThreshold.value, lowerProbabilityThreshold.value, formData)
      .then((res) => {
        if (res && res.data) {
          errorMsg.value = ''
          cartImagePrediction.value = res.data
          loading.value = false

          predictionDone.value = true
        }
      })
      .catch((err) => {
        console.log('ERR', err)
        loading.value = false
        errorMsg.value = 'Hubo un error en la carga. Por favor, inténtelo de nuevo.'
      })
  }
}
</script>

<template>
  <div class="shop-container">
    <!-- <div class="camara">
      <TheCamera ref="camera" :resolution="{ width: 375, height: 500 }" :autoplay="false" />
    </div> -->

    <!-- OPCIONES DE REGISTRO DE COMPRA -->
    <div class="register-preview">
      <div>
        <h1>ESCOJA UNA OPCIÓN PARA REGISTRAR LA COMPRA</h1>

        <div class="action-buttons">
          <AppButton
            title="Abrir Cámara"
            :model="PoCModel.Common"
            :action="openCamara"
            width="225"
            :disabled="true"
          />
          <UploadButton
            title="Cargar imagen"
            :action="onFileChange"
            :loading="loading"
            :model="PoCModel.Common"
          />
        </div>

        <div class="cart-image" v-if="predictionDone">
          <img :src="fileData ? fileData : ''" alt="" />
        </div>
      </div>

      <AppButton
        v-if="predictionDone && cartImagePrediction && cartImagePrediction.items.length > 0"
        title="Continuar con el pago"
        :model="PoCModel.Common"
        :action="reset"
        width="225"
      />
    </div>

    <!-- FACTURA -->
    <div class="summary-receipt">
      <h2>Resumen de la Compra:</h2>
      <div v-if="cartImagePrediction && cartImagePrediction.items.length > 0" class="summary-total">
        <div>
          <div v-for="item in cartImagePrediction.items" :key="item.id" class="shop-item">
            <h3 v-if="item.name">
              <u>
                {{ item.name }}
              </u>
            </h3>

            <div class="item-summary">
              <div class="cost-and-count">
                <div class="item-description">
                  <h4>Costo Unitario</h4>
                  <span>{{ item.unitPrice }} €</span>
                </div>
                <div class="item-description">
                  <h4>Cantidad</h4>
                  <!-- <input type="text" /> -->
                  <span>{{ item.count }}</span>
                </div>
              </div>

              <div class="item-description">
                <h4>Total</h4>
                <span>{{ item.totalAmount }} €</span>
              </div>
            </div>
          </div>
        </div>

        <div class="total-payment">
          <h3><b>TOTAL A PAGAR</b></h3>
          <h3>
            <b>{{ cartImagePrediction.totalAmount }} €</b>
          </h3>
        </div>
      </div>
      <div v-if="cartImagePrediction && cartImagePrediction.items.length === 0">
        No se registró ningún producto de la tienda en la imagen
      </div>
      <div v-if="!cartImagePrediction">No se registró ninguna compra</div>
    </div>
  </div>
</template>

<style scoped>
.shop-container {
  height: 100%;
  position: relative;
  display: flex;
  padding: 20px;
}

.camara {
  position: absolute;
  top: 10%;
  left: 10%;
}

.register-preview {
  width: 45%;
}

.register-preview {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
}

.register-preview h1 {
  font-weight: bold;
  text-align: center;
  color: var(--c-white);
  text-shadow: 2px 2px 2px black;
}

.action-buttons {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1em;
  margin-top: 15px;
}

.cart-image {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 15px;
}

.cart-image img {
  width: 80%;
}

.summary-receipt {
  width: 55%;
  background-color: var(--c-white);
  border-radius: 5px;
  padding: 15px 20px;
}

.summary-receipt h2 {
  margin-bottom: 15px;
}

.summary-total {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 90%;
}

.shop-item {
  margin-bottom: 1em;
  border-bottom: 1px solid var(--c-grey-20);
  padding-bottom: 10px;
}

.shop-item u {
  font-weight: bold;
}

.item-summary {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
}

.cost-and-count {
  display: flex;
  align-items: center;
  gap: 2em;
}

.item-description {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.item-description h4 {
  font-weight: bold;
  font-style: italic;
}

.total-payment {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 2px solid black;
  padding: 5px 10px;
}

@media (max-width: 500px) {
}
</style>
