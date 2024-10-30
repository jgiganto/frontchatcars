<template>
	<header>
		<div class="header-wrapper">
			<div class="logo-wrapper">
				<RouterLink to="/">
					<img src="@/assets/logo.jpg" alt="" />
					<h1>Stratesys Cars</h1>
				</RouterLink>
			</div>
		</div>
	</header>
</template>

<!-- <script setup lang="ts"></script> -->

<style scoped>
	header {
		display: flex;
		align-items: flex-start;
		padding: 0px 5%;
		position: relative;
		background-color: #f4f4f4;
	}

	.header-wrapper {
		padding: 20px 0;
	}

	.logo-wrapper a {
		display: flex;
		align-items: center;
		gap: 10px;
		text-decoration: none;
		color: #1e3552;
	}

	.header-wrapper img {
		width: 50px;
	}

	@media (max-width: 500px) {
		header {
			justify-content: center;
		}

		.header-wrapper h1 {
			font-size: 20px;
		}

		.header-wrapper img {
			width: 30px;
		}
	}
</style>
