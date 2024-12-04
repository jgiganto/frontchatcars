<script lang="ts" setup>
// IMPORTS
import TheChat from '@/components/stratesysCars/TheChat.vue'
</script>

<template>
  <div class="car-container">
    <TheChat />
  </div>
</template>

<style scoped>
.car-container {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

@media (max-width: 500px) {
  .car-container {
    height: 100%;
    background-position: right;
    padding: 5px;
  }
}
</style>
