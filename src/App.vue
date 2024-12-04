<script setup lang="ts">
	import TheHeader from "@/components/TheHeader.vue";
</script>

<template>
	<TheHeader />
	<div class="bg">
		<RouterView />
	</div>
</template>

<style>
	.bg {
		height: calc(100vh - 70px);
		width: 100vw;
		background-image: url("@/assets/bg-qr.jpg");
		background-size: cover;
		background-position: top;
	}

	@media (max-width: 500px) {
		.bg {
			height: calc(100vh - 60px);
			background-position: right;
		}
	}
</style>
