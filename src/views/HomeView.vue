<script setup>
	import { ref } from "vue";
	import ChatView from "../components/TheChat.vue";

	// DATA
	const openChat = ref(false);

	// METHODS
	function toggleChat() {
		openChat.value = !openChat.value;
		console.log(openChat.value);
	}
</script>

<template>
	<div class="hero">
		<div>
			<h1>La compra de tu auto, más fácil que nunca</h1>
			<ChatView class="chat" v-if="openChat" />
		</div>
		<div class="chat-button-conatiner">
			<span>Chat with us!</span>
			<div class="chat-button">
				<img @click="toggleChat" src="@/assets/chat-logo.png" />
			</div>
		</div>
	</div>
</template>

<style scoped>
	.chat-button-conatiner {
		position: fixed; /* Makes the button stay in one position relative to the viewport */
		bottom: 20px; /* Adjust the distance from the bottom */
		right: 20px; /* Adjust the distance from the right */
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 5px;
	}

	.chat-button-conatiner span {
		color: #ffffff;
	}

	.chat-button-conatiner .chat-button {
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

	.chat-button-conatiner .chat-button img {
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
		/* background-color: #f4f4f4; */
		/* color: white; */
		color: #174f5e;
		border-radius: 5px;
		padding: 0 20px;
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
</style>
