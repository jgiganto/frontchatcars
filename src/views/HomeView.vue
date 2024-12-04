<script setup lang="ts"></script>

<template>
  <main>
    <RouterLink to="/repsol-docint">
      <button>Repsol Doc Intelligence</button>
    </RouterLink>
    <RouterLink to="/repsol-custom-vision">
      <button>Repsol Custom Vision</button>
    </RouterLink>
    <RouterLink to="/stratesys-cars">
      <button>Stratesys Cars</button>
    </RouterLink>
    <RouterLink to="/stratesys-docint">
      <button>Stratesys Doc Intelligence</button>
    </RouterLink>
  </main>
</template>

<style scoped>
main {
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 1.5em;
}

button {
  background-color: var(--c-white);
  border: 2px solid #40454a;
  border-radius: 4px;
  padding: 1em;
  font-size: 16px;
  width: 250px;
  cursor: pointer;
}
</style>
