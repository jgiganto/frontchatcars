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

<style scoped>
	header {
		display: flex;
		align-items: center;
		padding: 0px 5%;
		position: relative;
		height: 70px;
		background-color: #f4f4f4;
	}

	.logo-wrapper a {
		display: flex;
		align-items: center;
		gap: 10px;
		text-decoration: none;
		color: #1e3552;
		font-size: 14px;
	}

	.logo-wrapper a h1 {
		font-weight: normal;
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
