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
		min-height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	@media (max-width: 500px) {
		.car-container {
			height: calc(100vh - 72.07px);
			background-position: right;
			padding: 5px;
		}
	}
</style>
