<script setup>
	import { ref } from "vue";
	import ChatView from "../components/TheChat.vue";
	// @ts-expect-error - Not undefined
	import { QrcodeStream } from "vue3-qrcode-reader";

	// DATA
	const openChat = ref(false);
	const showQrCodeReader = ref(false);

	// METHODS
	function showChat() {
		openChat.value = !openChat.value;
		showQrCodeReader.value = false;
	}
	function showQrReader() {
		showQrCodeReader.value = !showQrCodeReader.value;
		openChat.value = false;
	}

	function isValidUrl(url) {
		try {
			new URL(url);
			return true;
		} catch (e) {
			return false;
		}
	}

	function onDecode(decodedString) {
		console.log("Decoded QR code:", decodedString);

		if (isValidUrl(decodedString)) {
			window.location.href = decodedString;
		} else {
			alert("The QR code doesn't contain a valid URL");
		}
	}

	function onInit(promise) {
		promise.catch((error) => {
			console.error("Initialization error:", error.message);
		});
	}
</script>

<template>
	<div class="hero">
		<div class="hero-content">
			<h1>La compra de tu auto, <u>más fácil que nunca</u></h1>
			<ChatView class="chat" v-if="openChat" />
			<div class="qr-reader-fullscreen" v-if="showQrCodeReader">
				<QrcodeStream
					class="qr-lector"
					@decode="onDecode"
					@init="onInit"
				>
					<h3>¡Escanea el QR!</h3>
				</QrcodeStream>
			</div>
		</div>
		<div class="chat-button-container">
			<div>
				<span>¡Chat para dudas!</span>
				<div class="chat-button">
					<img @click="showChat" src="@/assets/chat-logo.png" />
				</div>
			</div>
			<div>
				<span>¡Escanea un QR!</span>
				<div class="chat-button">
					<img @click="showQrReader" src="@/assets/qr-code.png" />
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped>
	.hero {
		padding: 50px;
		position: relative;
		z-index: 1;
	}

	.hero > div > h1 {
		max-width: 60%;
		font-size: 75px;
		font-style: italic;
		color: #fff;
		position: absolute;
		top: 50%;
		text-shadow: 6px 6px 6px #1e3552;
		font-weight: normal;
	}

	.chat-button-container {
		position: fixed; /* Makes the button stay in one position relative to the viewport */
		bottom: 20px; /* Adjust the distance from the bottom */
		right: 20px; /* Adjust the distance from the right */
		display: flex;
		align-items: center;
		gap: 20px;
	}

	.chat-button-container div {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 5px;
	}

	.chat-button-container span {
		color: #ffffff;
		font-size: 12px;
	}

	.chat-button-container .chat-button {
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 50px;
		height: 50px;
		border-radius: 50%;
		border: 1px solid white;
		background-color: white;
	}

	.chat-button-container .chat-button img {
		width: 35px;
	}

	.chat {
		position: absolute;
		right: 30px;
		top: 10px;
		z-index: 10;
	}

	.qr-reader-fullscreen {
		position: fixed;
		max-width: 26%;
		height: 67.5%;
		z-index: 11;
		top: 14.5%;
		right: 3%;
		border: #1e3552 solid 2px;
		background-color: #f9f9f9;
	}

	.qr-reader-fullscreen .qr-lector h3 {
		background-color: #1e35525c;
		text-align: center;
		color: #f9f9f9;
		padding: 10px;
	}

	@media (max-width: 500px) {
		.hero {
			padding: 5px;
		}

		.hero > .hero-content {
			min-width: 100%;
		}

		.hero > div > h1 {
			max-width: 100%;
			font-size: 70px;
			text-align: center;
			top: 0;
			right: 0;
			left: 0;
			bottom: 0;
			margin: 0 10px;
		}

		.chat-button-container {
			bottom: 20px;
			right: 10px;
			gap: 10px;
		}

		.chat-button-container span {
			font-size: 12px;
		}

		.chat-button-container .chat-button {
			width: 50px;
			height: 50px;
		}

		.chat-button-container .chat-button img {
			width: 30px;
		}

		.chat {
			z-index: 10;
			margin-left: auto;
			margin-right: auto;
			left: 0;
			right: 0;
			bottom: 120px;
			text-align: center;
		}

		.qr-reader-fullscreen {
			position: fixed;
			max-width: 93%;
			height: calc(100vh - 75px - 110px);
			z-index: 11;
			top: 80px;
			text-align: center;
		}

		.qr-reader-fullscreen .qr-lector h3 {
			font-size: 16px;
		}
	}
</style>
