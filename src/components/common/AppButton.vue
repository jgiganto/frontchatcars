<script lang="ts" setup>
// IMPORTS
import { PoCModel } from '@/types/common'
import type { PropType } from 'vue'

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
  width: {
    type: String,
  },
  model: {
    type: String as PropType<PoCModel>,
    required: true,
  },
  disabled: {
    type: Boolean,
  },
})
</script>

<template>
  <div
    class="button"
    :class="{
      'disabled-button': props.disabled,
      common: props.model === PoCModel.Common,
      'repsol-custom-vision': props.model === PoCModel.RepsolCustom,
      'repsol-doc-intelligence': props.model === PoCModel.RepsolDocInt,
    }"
    :style="{ width: `${props.width}px` }"
    @click="props.action"
  >
    {{ props.title }}
  </div>
</template>

<style>
.button {
  font-size: 12px;
  cursor: pointer;
  padding: 0.5em;
  border: none;
  border-radius: 5px;
  text-align: center;
  font-weight: normal;
}

@media (max-width: 500px) {
  .button {
    font-size: 16px;
  }
}

.common {
  background-color: var(--c-white);
  border: 2px solid var(--c-grey-70);
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

.disabled-button {
  background: var(--c-grey-30);
  border-color: var(--c-grey-30);
  color: var(--c-grey-50);
  pointer-events: none;
  cursor: auto;
}
</style>
