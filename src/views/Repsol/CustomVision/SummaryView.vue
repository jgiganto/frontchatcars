<script lang="ts" setup>
// IMPORTS
import { ref, type Ref } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { usePredictionStore } from '@/stores/predictionStore'
import AppButton from '@/components/common/AppButton.vue'
import { PoCModel } from '@/types/common'

// ROUTER
const router = useRouter()

// STORE
const { orderNumber, manualOptions } = storeToRefs(usePredictionStore())

// DATA
const isDeliveryConfirm: Ref<boolean> = ref(false)

// METHODS
function handleClose() {
  isDeliveryConfirm.value = true

  setTimeout(() => {
    router.push('/repsol-custom-vision')
  }, 2000)
}
</script>

<template>
  <div v-if="!isDeliveryConfirm" class="home-container">
    <h1 class="app-name">PEDIDO {{ orderNumber }}</h1>
    <div v-for="option in manualOptions" :key="option.key" class="tag-group">
      <div>
        <img :src="option.image" alt="" />
        <h3>{{ option.name }}:</h3>
      </div>
      <h3>{{ option.total }}</h3>
    </div>
    <AppButton
      title="CONFIRMAR ENTREGA"
      :model="PoCModel.RepsolCustom"
      :action="handleClose"
      width="250"
    />
  </div>

  <div v-if="isDeliveryConfirm" class="home-container final-text">
    <h1>Se confirmó correctamente la entrega.</h1>
  </div>
</template>

<style scoped>
.home-container {
  height: calc(100vh - 75px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  text-align: center;
  gap: 2em;
  padding: 10px 20px 20px;
  font-family: var(--font-repsol-bold);
}

.final-text {
  justify-content: center;
}

.app-name {
  font-style: italic;
  font-family: var(--font-repsol-bold);
  background-color: var(--c-turquoise-80);
  color: var(--c-white);
  width: 100vw;
  padding: 11px 0;
  font-size: 30px;
}

.tag-group {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: var(--c-grey-50) solid 1px;
  border-radius: 5px;
  padding: 10px;
  font-size: 15px;
}

.tag-group div {
  display: flex;
  align-items: center;
  gap: 0.5em;
}

.tag-group div img {
  width: 30px;
}
</style>
