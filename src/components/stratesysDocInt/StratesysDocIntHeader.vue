<script setup lang="ts">
// IMPORTS
import { useClassificationStore } from '@/stores/classificationStore'
import { useParticularDocStore } from '@/stores/particularDocStore'
// import { useOnboardingStore } from '@/stores/onboardingStore'
import { onMounted } from 'vue'

// STORE
const clasificationStore = useClassificationStore()
const particularStore = useParticularDocStore()
// const onboardingStore = useOnboardingStore()

// HOOKS
onMounted(() => {
  clasificationStore.$reset()
  particularStore.$reset()
  // onboardingStore.$reset()
})
</script>

<template>
  <header>
    <RouterLink to="/stratesys-docint">
      <img src="../../assets/logo/logo-stratesys.png" alt="" />
      <span><i>Document Intelligence</i></span>
    </RouterLink>
    <input type="text" placeholder="Realiza tu búsqueda" />
    <img src="../../assets/icons/menu.png" alt="" />
  </header>
</template>

<style scoped>
header {
  height: 4em;
  background-color: #40454ad6;
  width: 100vw;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1.5em;
}

header a {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 0.6em;
}

header a img {
  height: 26px;
}

header span {
  color: var(--c-white);
  font-size: 16px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  margin-bottom: 3px;
}

header input {
  color: #40454a;
  border: none;
  border-radius: 50px;
  padding: 6px;
  font-size: 12px;
  font-weight: bold;
  width: 400px;
  text-align: center;
}

header h1 {
  color: var(--c-white);
}

header > img {
  height: 25px;
}
</style>
