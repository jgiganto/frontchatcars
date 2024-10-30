<script setup>
	// IMPORTS
	import TheChat from "@/components/TheChat.vue";
</script>

<template>
	<div class="car-container">
		<TheChat />
	</div>
</template>

<style scoped>
	.car-container {
		height: calc(100vh - 90px);
		display: flex;
		align-items: center;
		justify-content: center;
		background-image: url("@/assets/bg-qr.jpg");
		background-size: cover;
		background-position: top;
	}

	@media (max-width: 500px) {
		.car-container {
			height: calc(100vh - 72.07px);
			background-position: right;
			padding: 5px;
		}
	}
</style>
