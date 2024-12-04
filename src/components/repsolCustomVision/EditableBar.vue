<script lang="ts" setup>
// IMPORTS
import { ref, computed, onMounted, type Ref } from 'vue'
import { storeToRefs } from 'pinia'
import { usePredictionStore } from '@/stores/predictionStore'

// STORE
const { upperProbabilityThreshold, lowerProbabilityThreshold } = storeToRefs(usePredictionStore())

// DATA
const sliderTrack = ref<HTMLElement | null>(null)
const lowerThumbPosition: Ref<number> = ref(25) // Posición inicial del primer thumb en porcentaje
const upperThumbPosition: Ref<number> = ref(50) // Posición inicial del segundo thumb en porcentaje
const minValue = 0
const maxValue = 100

// COMPUTED
// Calcula los valores de los thumbs según sus posiciones
const currentLowerValue = computed(() =>
  Math.round((lowerThumbPosition.value / 100) * (maxValue - minValue) + minValue),
)
const currentUpperValue = computed(() =>
  Math.round((upperThumbPosition.value / 100) * (maxValue - minValue) + minValue),
)

// Calcula el ancho del rango entre los thumbs
const rangeWidth = computed(() => upperThumbPosition.value - lowerThumbPosition.value)

//METHODS
function startDrag(dragTarget: 'thumb1' | 'thumb2' | 'track') {
  const onMove = (event: MouseEvent | TouchEvent) => {
    const clientX = event instanceof TouchEvent ? event.touches[0].clientX : event.clientX
    if (sliderTrack.value) {
      const rect = sliderTrack.value.getBoundingClientRect()
      const offsetX = clientX - rect.left
      const percentage = Math.max(0, Math.min((offsetX / rect.width) * 100, 100))

      // Ajusta la posición según el slider que se está arrastrando
      if (dragTarget === 'thumb1' && percentage < upperThumbPosition.value) {
        lowerThumbPosition.value = percentage
        lowerProbabilityThreshold.value = lowerThumbPosition.value / 100
      } else if (dragTarget === 'thumb2' && percentage > lowerThumbPosition.value) {
        upperThumbPosition.value = percentage
        upperProbabilityThreshold.value = upperThumbPosition.value / 100
      }
    }
  }

  const onEnd = () => {
    document.removeEventListener('mousemove', onMove)
    document.removeEventListener('mouseup', onEnd)
    document.removeEventListener('touchmove', onMove)
    document.removeEventListener('touchend', onEnd)
  }

  document.addEventListener('mousemove', onMove)
  document.addEventListener('mouseup', onEnd)
  document.addEventListener('touchmove', onMove)
  document.addEventListener('touchend', onEnd)
}

// HOOKS
onMounted(() => {
  lowerThumbPosition.value = lowerProbabilityThreshold.value * 100
  upperThumbPosition.value = upperProbabilityThreshold.value * 100
})
</script>

<template>
  <div class="slider-container">
    <!-- Valores de salida -->
    <div class="value-display">
      Límites de Probabilidad: <b>{{ currentLowerValue }}% - {{ currentUpperValue }}%</b>
    </div>

    <div class="slider-track" @mousedown="startDrag('track')" ref="sliderTrack">
      <!-- Línea de selección entre los dos puntos de control -->
      <div
        class="slider-range"
        :style="{ left: lowerThumbPosition + '%', width: rangeWidth + '%' }"
      ></div>

      <!-- Primer punto de control -->
      <div
        class="slider-thumb"
        :style="{ left: lowerThumbPosition + '%' }"
        @mousedown.stop.prevent="startDrag('thumb1')"
        @touchstart.stop.prevent="startDrag('thumb1')"
      ></div>

      <!-- Segundo punto de control -->
      <div
        class="slider-thumb"
        :style="{ left: upperThumbPosition + '%' }"
        @mousedown.stop.prevent="startDrag('thumb2')"
        @touchstart.stop.prevent="startDrag('thumb2')"
      ></div>
    </div>
  </div>
</template>

<style scoped>
.slider-container {
  width: 300px;
  font-family: var(--font-repsol);
}

.slider-track {
  position: relative;
  width: 100%;
  height: 6px;
  background-color: var(--c-grey-30);
  border-radius: 3px;
  cursor: pointer;
}

.slider-range {
  position: absolute;
  height: 100%;
  background-color: var(--c-turquoise-20);
  border-radius: 3px;
}

.slider-thumb {
  position: absolute;
  top: -4px;
  width: 14px;
  height: 14px;
  background-color: var(--c-turquoise-80);
  border-radius: 50%;
  cursor: pointer;
  z-index: 1;
}

.value-display {
  margin-bottom: 10px;
  font-size: 16px;
}

.value-display b {
  font-family: var(--font-repsol-bold);
}
</style>
