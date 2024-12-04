<template>
  <div
    class="loader-wrapper"
    :style="{
      top: position + 'px',
      height: `calc(100% - ${position}px)`,
    }"
  >
    <img class="loader" src="@/assets/icons/loader.svg" alt="loader" />
  </div>
</template>

<script setup lang="ts">
// PROPS
defineProps({
  position: {
    type: Number,
    required: false,
    default: 0,
  },
})
</script>

<style scoped>
.loader-wrapper {
  z-index: 3;
  position: relative;
  width: 100%;
  height: 100%;
  transition: 0.5s;
  user-select: none;
}

.loader {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 4rem;
}
</style>
