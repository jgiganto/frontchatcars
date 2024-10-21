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
		<div>
			<h1>La compra de tu auto, más fácil que nunca</h1>
			<ChatView class="chat" v-if="openChat" />
			<div class="qr-reader-fullscreen" v-if="showQrCodeReader">
				<QrcodeStream
					class="qr-lector"
					@decode="onDecode"
					@init="onInit"
				>
					<h3>¡Escanéa el QR!</h3>
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
				<span>¡Escanéa un QR!</span>
				<div class="chat-button">
					<img @click="showQrReader" src="@/assets/qr-code.png" />
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped>
	.chat-button-container {
		position: fixed; /* Makes the button stay in one position relative to the viewport */
		bottom: 20px; /* Adjust the distance from the bottom */
		right: 20px; /* Adjust the distance from the right */
		display: flex;
		/* flex-direction: column; */
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
	}

	.chat-button-container .chat-button {
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 70px;
		height: 70px;
		border-radius: 50%;
		border: 1px solid white;
		background-color: white;
	}

	.chat-button-container .chat-button img {
		width: 50px;
	}

	.hero {
		height: calc(100vh - 90px);
		background-image: url("@/assets/hero.jpg");
		background-size: cover;
		background-position: top;
		padding: 50px;
		position: relative;
		z-index: 1;
	}

	.hero > div > h1 {
		max-width: 60%;
		font-size: 90px;
		font-style: italic;
		color: #174f5e;
		position: absolute;
		top: 20%;
		text-shadow: 6px 6px 6px #ffffff;
	}

	.chat {
		position: absolute;
		right: 0;
		z-index: 10;
		margin-right: 60px;
		/* position: relative; */
	}

	.qr-reader-fullscreen {
		position: fixed;
		max-width: 26%;
		height: 67.5%;
		z-index: 11;
		top: 16.3%;
		right: 3%;
		border-radius: 5px;
		border: #174f5e solid 2px;
		background-color: #f9f9f9;
	}

	.qr-reader-fullscreen .qr-lector h3 {
		background-color: #174f5e5c;
		text-align: center;
		color: #f9f9f9;
		padding: 10px;
	}
</style>
