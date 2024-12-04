<template>
  <header>
    <div class="header-wrapper">
      <RouterLink to="/stratesys-cars">
        <img src="@/assets/logo/logo-cars.jpg" alt="" />
        <h1>Stratesys Cars</h1>
      </RouterLink>
    </div>
  </header>
</template>

<style scoped>
header {
  display: flex;
  align-items: center;
  padding: 0px 5%;
  position: relative;
  height: 70px;
  background-color: var(--c-white-header);
}

.header-wrapper a {
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  color: var(--c-dark-blue);
  font-size: 14px;
}

.header-wrapper img {
  width: 45px;
}

@media (max-width: 500px) {
  header {
    justify-content: center;
    height: 60px;
  }

  .header-wrapper h1 {
    font-size: 20px;
  }

  .header-wrapper img {
    width: 30px;
  }
}
</style>
