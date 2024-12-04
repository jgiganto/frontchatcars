<script setup lang="ts">
import HeaderDate from './HeaderDate.vue'
</script>

<template>
  <header>
    <div class="header-wrapper">
      <div class="left-header">
        <img class="logo-repsol" src="@/assets/logo/repsol-logo.svg" />
        <div class="separator-title"></div>
        <span class="title">Expediciones</span>
      </div>

      <div class="right-header">
        <div class="search-wrapper">
          <input type="text" class="search-input" placeholder="Buscar albaranes" />
          <img class="search-icon" src="@/assets/icons/search.svg" />
        </div>

        <div class="separator"></div>

        <div class="user-wrapper">
          <div class="user">
            <span class="user-name">NN</span>
          </div>
        </div>
        <div class="wrapper-date-hour">
          <HeaderDate />
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped>
header {
  display: flex;
  height: var(--header-height);
  width: 100vw;
  justify-content: center;
  align-items: center;
  border-bottom: 1px solid var(--c-grey-30);
  padding: 0px 5%;
  position: relative;
  font-family: var(--font-roboto-400);
}

.header-wrapper {
  width: 100%;
  margin-left: 3rem;
  display: flex;
  justify-content: space-between;
}

.left-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 15rem;
  color: var(--c-grey-70);
}

.left-header .logo-repsol {
  width: 100px;
}

.left-header .title {
  font-family: var(--font-roboto-500);
  color: var(--c-grey-70);
}

.left-header .separator-title {
  width: 1px;
  height: 1.5rem;
  border-left: 1px solid var(--c-grey-30);
}

.right-header {
  display: flex;
  align-items: center;
}

.right-header .separator {
  width: 1px;
  height: 1.5rem;
  border-left: 1px solid var(--c-grey-30);
}

.right-header .search-wrapper {
  display: flex;
  align-items: center;
  padding: 0 0.2rem;
  border-radius: 0.5rem;
  margin-right: 2rem;
  border: 1px solid var(--c-grey-30);
  position: relative;
}

.right-header .search-wrapper .search-input {
  width: 17rem;
  height: 1.5rem;
  border: none;
  outline: none;
  font-size: 10px;
}

.right-header .search-wrapper .search-input::placeholder {
  color: var(--c-grey-50);
}

.right-header .search-wrapper .search-icon {
  border-radius: 4px;
  padding: 0.3rem;
  width: 1.5rem;
}

.user-wrapper .user {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.user-wrapper .user .user-name {
  color: var(--c-white);
  margin: 0 3rem 0 2rem;
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--c-orange-70);
}
</style>
