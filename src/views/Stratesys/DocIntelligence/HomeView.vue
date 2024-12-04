<script setup lang="ts">
// DATA
const flows = [
  { name: 'Documentos Particulares', route: 'particular' },
  { name: 'Clasificación de Documentos', route: 'classification' },
  { name: 'Onboarding', route: 'onboarding' },
]
</script>

<template>
  <main class="home-container">
    <RouterLink v-for="flow in flows" :key="flow.name" :to="`/stratesys-docint/${flow.route}`">
      <button>{{ flow.name }}</button>
    </RouterLink>
  </main>
</template>

<style scoped>
.home-container {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1em;
}

button {
  background-color: var(--c-white);
  border: 2px solid #40454a;
  border-radius: 4px;
  padding: 1em;
  font-size: 14px;
  width: 250px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  cursor: pointer;
}

button:hover {
  background-color: #40454a;
  border-radius: 4px;
  color: var(--c-white);
}
</style>
