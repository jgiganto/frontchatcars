<script setup lang="ts">
// IMPORTS
import IconsSidebar from './IconsSidebar.vue'

// DATA
const links = ['validation', 'access', 'occupancy', 'incidence', 'denied']
</script>

<template>
  <div class="wrapper-menu">
    <div class="links-wrapper">
      <div v-for="(link, index) in links" :key="index" class="side-link">
        <IconsSidebar :icon="link" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.wrapper-menu {
  width: var(--sidemenu-size);
  background-color: var(--c-turquoise-80);
}

.links-wrapper {
  align-items: center;
  display: flex;
  flex-direction: column;
  height: calc(100vh - var(--header-height));
  padding-top: 2rem;
  gap: 2rem;
  width: var(--sidemenu-size);
}

.side-link {
  width: 16px;
  height: 1.5rem;
  display: flex;
  align-items: center;
  position: relative;
}
</style>
