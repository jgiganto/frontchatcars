<template>
	<header>
		<div class="header-wrapper">
			<div class="logo-wrapper">
				<RouterLink to="/">
					<img src="@/assets/logo.jpg" alt="" />
					<h1>Stratesys Cars</h1>
				</RouterLink>
			</div>
			<!-- <nav>
				<RouterLink to="/chat">Chat with us!</RouterLink>
			</nav> -->
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
		display: flex;
		justify-content: space-between;
	}

	.logo-wrapper a {
		display: flex;
		align-items: center;
		gap: 10px;
		text-decoration: none;
		color: #174f5e;
	}

	.header-wrapper img {
		width: 50px;
	}
</style>
