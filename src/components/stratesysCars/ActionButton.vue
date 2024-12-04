<script lang="ts" setup>
// IMPORTS
import type { PropType } from 'vue'

// PROPS
const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  src: {
    type: String,
    required: true,
  },
  action: {
    type: Function as PropType<(event: Event) => void>,
    required: true,
  },
})
</script>

<template>
  <div>
    <span>{{ props.title }}</span>
    <div class="chat-button">
      <img @click="props.action" :src="props.src" />
    </div>
  </div>
</template>

<style scoped>
.chat-button {
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: 1px solid var(--c-white);
  background-color: var(--c-white);
}

.chat-button img {
  width: 35px;
}

@media (max-width: 500px) {
  .chat-button img {
    width: 30px;
  }
}
</style>
