<script lang="ts" setup>
import { ref, type Ref } from 'vue'
import { useRouter } from 'vue-router'
import { usePredictionStore } from '@/stores/predictionStore'
import EditableBar from './EditableBar.vue'

// ROUTER
const router = useRouter()

// STORE
const { resetStore } = usePredictionStore()

// DATA
const showMenu: Ref<boolean> = ref(false)

// METHODS
function goHome() {
  router.push('/')
  resetStore()
}
</script>

<template>
  <header class="header">
    <a href="/" @click="goHome">
      <img src="@/assets/icons/repsol.png" alt="" />
    </a>

    <img @click="showMenu = !showMenu" src="@/assets/icons/menu-repsol.png" alt="" />
  </header>
  <div v-if="showMenu" class="dropdown-menu">
    <span class="title"><u>Ajustes</u><img src="../assets/icons/setting.png" alt="" /></span>
    <EditableBar />
  </div>
</template>

<style scoped>
.header {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  gap: 0.4em;
  border-bottom: 1px solid var(--c-turquoise-80);
}

.header > img {
  height: 30px;
}
.header > a > img {
  height: 40px;
}

.dropdown-menu {
  position: fixed;
  right: 10px;
  margin-top: -8px;
  padding: 10px;
  border: 1px solid var(--c-grey-30);
  box-shadow: var(--c-grey-30) 1px 1px 1px 1px;
  border-radius: 5px;
  background-color: var(--c-white);
  display: flex;
  flex-direction: column;
  gap: 1.5em;
  z-index: 10;
}

.title {
  font-family: var(--font-repsol-bold);
  text-align: right;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 0.5em;
}
</style>
