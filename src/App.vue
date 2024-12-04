<script setup lang="ts">
// IMPORTS
import { useRoute } from 'vue-router'
import RepsolDocIntHeader from './components/repsolDocInt/RepsolDocIntHeader.vue'
import StratesysDocIntHeader from './components/stratesysDocInt/StratesysDocIntHeader.vue'
import StratesysCarsHeader from './components/stratesysCars/StratesysCarsHeader.vue'
import RepsolCusVisHeader from './components/repsolCustomVision/RepsolCusVisHeader.vue'

// ROUTER
const route = useRoute()

//METHODS
function handleBg(routePath: string) {
  if (routePath.startsWith('/stratesys-cars')) return 'cars-bg'
  if (routePath.startsWith('/stratesys-docint')) return 'docint-bg'
  else return ''
}
</script>

<template>
  <RepsolDocIntHeader v-if="route.path.startsWith('/repsol-docint')" />
  <StratesysDocIntHeader v-if="route.path.startsWith('/stratesys-docint')" />
  <StratesysCarsHeader v-if="route.path.startsWith('/stratesys-cars')" />
  <RepsolCusVisHeader v-if="route.path.startsWith('/repsol-custom-vision')" />
  <div :class="handleBg(route.path)">
    <RouterView />
  </div>
</template>

<style>
.cars-bg {
  height: calc(100vh - 70px);
  width: 100vw;
  background-image: url('@/assets/bg-qr.jpg');
  background-size: cover;
  background-position: top;
}

.docint-bg {
  height: calc(100vh - 4em);
  width: 100vw;
  background-image: url('@/assets/bg-1.jpg');
  background-size: cover;
  background-repeat: no-repeat;
}

@media (max-width: 500px) {
  .cars-bg {
    min-height: calc(100vh - 60px);
    background-position: right;
  }
}
</style>
