<script setup lang="ts">
import { onMounted, ref } from 'vue'

// HOOKS
onMounted(() => {
  setDate()
})

// DATA
const now = ref('')

// METHODS
const setDate = (): string => {
  const today = new Date()

  const formatedDate = new Intl.DateTimeFormat('es-ES', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(today)

  now.value = `${formatedDate.split(',')[0]} | ${formatedDate.split(',')[1]} h`

  setTimeout(() => {
    setDate()
  }, 60000)

  return formatedDate
}
</script>

<template>
  <div class="date-wrapper">
    <span class="date">{{ now }}</span>
  </div>
</template>

<style scoped>
.date {
  color: var(--c-turquoise-80);
  font-size: 0.7rem;
  font-family: var(--font-roboto-400);
}
</style>
