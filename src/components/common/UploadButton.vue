<script lang="ts" setup>
// IMPORTS
import type { PropType } from 'vue'
import { PoCModel } from '@/types/common'

// PROPS
const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  action: {
    type: Function as PropType<(event: Event) => void>,
    required: true,
  },
  loading: {
    type: Boolean,
    required: true,
  },
  model: {
    type: String as PropType<PoCModel>,
    required: true,
  },
  width: {
    type: String,
    default: '225',
  },
  img: {
    type: String,
  },
})
</script>

<template>
  <label
    class="upload-wrapper"
    :class="{
      'disabled-button': props.loading,
      common: props.model === PoCModel.Common,
      'repsol-custom-vision': props.model === PoCModel.RepsolCustom,
      'repsol-doc-intelligence': props.model === PoCModel.RepsolDocInt,
    }"
    :style="{ width: `${props.width}px`, gap: props.img ? '10px' : 0 }"
  >
    <div v-if="!props.loading">
      {{ props.title }}
      <input type="file" accept=".pdf, .png, .jpg, .jpeg" @change="props.action" />
    </div>
    <img v-if="props.img && !props.loading" :src="props.img" alt="" />
    <img
      v-if="
        (props.loading && props.model === PoCModel.RepsolCustom) ||
        (props.loading && props.model === PoCModel.RepsolDocInt)
      "
      class="spin"
      src="@/assets/icons/sync.svg"
    />
    <div v-if="props.loading && props.model === PoCModel.Common" class="lds-spinner">
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  </label>
</template>

<style scoped>
.upload-wrapper {
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5em;
  border: none;
  border-radius: 5px;
  text-align: center;
}

.common {
  background-color: var(--c-white);
  border: 2px solid var(--c-grey-70);
}

.common div {
  font-weight: bold;
}

.repsol-custom-vision {
  color: var(--c-white);
  background-color: var(--c-orange-70);
  font-family: var(--font-repsol-bold);
}

.repsol-doc-intelligence {
  color: var(--c-white);
  background-color: var(--c-turquoise-80);
  font-family: var(--font-roboto-400);
}

.upload-wrapper img {
  width: 18px;
  margin-bottom: 2px;
}

.upload-wrapper input {
  display: none;
}

.upload-wrapper .spin {
  animation: spin linear 0.5s infinite;
}

.disabled-button {
  background: var(--c-grey-30);
  border-color: var(--c-grey-30);
  color: var(--c-grey-50);
  pointer-events: none;
  cursor: auto;
}

.lds-spinner,
.lds-spinner div,
.lds-spinner div:after {
  box-sizing: border-box;
}

.lds-spinner {
  color: currentColor;
  display: inline-block;
  position: relative;
  width: 20px; /* Ajustado a 20px */
  height: 20px; /* Ajustado a 20px */
}

.lds-spinner div {
  transform-origin: 10px 10px; /* Centrado a la mitad de 20px */
  animation: lds-spinner 1.2s linear infinite;
}

.lds-spinner div:after {
  content: ' ';
  display: block;
  position: absolute;
  top: 1px; /* Ajustado para el spinner más pequeño */
  left: 9px; /* Ajustado para el spinner más pequeño */
  width: 2px; /* Tamaño reducido del punto */
  height: 4px; /* Proporción ajustada */
  border-radius: 20%;
  background: currentColor;
}

.lds-spinner div:nth-child(1) {
  transform: rotate(0deg);
  animation-delay: -1.1s;
}

.lds-spinner div:nth-child(2) {
  transform: rotate(30deg);
  animation-delay: -1s;
}

.lds-spinner div:nth-child(3) {
  transform: rotate(60deg);
  animation-delay: -0.9s;
}

.lds-spinner div:nth-child(4) {
  transform: rotate(90deg);
  animation-delay: -0.8s;
}

.lds-spinner div:nth-child(5) {
  transform: rotate(120deg);
  animation-delay: -0.7s;
}

.lds-spinner div:nth-child(6) {
  transform: rotate(150deg);
  animation-delay: -0.6s;
}

.lds-spinner div:nth-child(7) {
  transform: rotate(180deg);
  animation-delay: -0.5s;
}

.lds-spinner div:nth-child(8) {
  transform: rotate(210deg);
  animation-delay: -0.4s;
}

.lds-spinner div:nth-child(9) {
  transform: rotate(240deg);
  animation-delay: -0.3s;
}

.lds-spinner div:nth-child(10) {
  transform: rotate(270deg);
  animation-delay: -0.2s;
}

.lds-spinner div:nth-child(11) {
  transform: rotate(300deg);
  animation-delay: -0.1s;
}

.lds-spinner div:nth-child(12) {
  transform: rotate(330deg);
  animation-delay: 0s;
}

@keyframes lds-spinner {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
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
