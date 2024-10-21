<script setup>
	// IMPORTS
	// import { useRoute } from "vue-router";
	import TheChat from "@/components/TheChat.vue";

	// // ROUTER
	// const route = useRoute();

	// // DATA
	// const brand = route.query.brand;
	// const model = route.query.model;
</script>

<template>
	<div class="car-container">
		<!-- <h1>
			¿QUIERS SABER MÁS SOBRE EL
			{{ brand.toUpperCase() + " " + model.toUpperCase() }}?
		</h1> -->
		<TheChat />
	</div>
</template>

<style scoped>
	.car-container {
		height: calc(100vh - 90px);
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 50px;
		background-image: url("@/assets/hero.jpg");
		background-size: cover;
		background-position: top;
	}
</style>
