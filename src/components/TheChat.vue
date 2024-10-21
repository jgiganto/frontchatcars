<script setup>
	// IMPORTS
	import { ref, nextTick, onMounted } from "vue";
	import { useRoute } from "vue-router";
	import axios from "axios";

	// ROUTER
	const route = useRoute();

	// DATA
	const newMessage = ref("");
	const messages = ref([]);
	const chatDisplay = ref(null);
	const loadingMessage = ref(false);
	const brand = ref(null);
	const model = ref(null);
	const filteredMessages = ref([]);

	// HOOKS
	onMounted(() => {
		brand.value = route.query.brand;
		model.value = route.query.model;

		if (brand.value && model.value) {
			const brandCapitalized =
				brand.value === "bmw"
					? brand.value.toUpperCase()
					: brand.value.charAt(0).toUpperCase() +
					  brand.value.slice(1);
			const modelCapitalized =
				model.value.charAt(0).toUpperCase() + model.value.slice(1);

			messages.value.push({
				role: "assistant",
				content: `¿Quieres saber más sobre el ${brandCapitalized} ${modelCapitalized}?`,
			});
		} else {
			messages.value.push({
				role: "assistant",
				content:
					"¡Hola, soy CarsBot! Tu asistente virtual, ¿en qué puedo ayudarte?",
			});
		}

		filteredMessages.value = messages.value.filter(
			(message) => message.role !== "system"
		);

		console.log(filteredMessages.value);
	});

	// METHODS
	async function sendMessage() {
		if (newMessage.value.trim() !== "") {
			loadingMessage.value = true;

			// Agrega el mensaje del usuario al historial
			messages.value.push({ role: "user", content: newMessage.value });

			filteredMessages.value = messages.value.filter(
				(message) => message.role !== "system"
			);

			// Incluye el mensaje del sistema si aún no está en el historial
			if (messages.value[0]?.role !== "system") {
				messages.value.unshift({
					role: "system",
					content:
						brand.value && model.value
							? `Dentro de la compañía Stratesys Cars, especializada en venta de automóviles de segunda mano, eres un asistente útil que proporciona información sobre el ${brand.value} ${model.value} basándose únicamente en los datos proporcionados a continuación. ...`
							: "Dentro de la compañía Stratesys Cars, especializada en venta de automóviles de segunda mano, eres un asistente útil que proporciona información sobre coches basándose únicamente en los datos proporcionados a continuación. ...",
				});
			}

			// Guarda el mensaje para enviarlo al backend
			const userMessage = newMessage.value;
			newMessage.value = "";

			try {
				// Realiza una solicitud POST a tu servidor backend
				const response = await axios.post(
					"https://appservicecoche-a3emdug0gfeggxfk.westeurope-01.azurewebsites.net/chat",
					{
						query: userMessage,
						prompt:
							brand.value && model.value
								? `Dentro de la compañía Stratesys Cars, especializada en venta de automóviles de segunda mano, eres un asistente útil que proporciona información sobre coches basándose únicamente en los datos proporcionados a continuación. Los automóviles están expuestos y tienen una pegatina QR identificativa en su parabrisas. En este caso el cliente ha escaneado el QR pegado al parabrisas del ${brand.value} ${model.value} y la conversación y respuestas deberían ir orientadas a su interés sobre este automóvil en concreto, iniciando cada una de las respuesta con un encabezado con la marca y modelo del coche cuya pegatina ha escaneado el cliente. No incluyas ninguna información que no esté presente en las fuentes. No utilices ningún conocimiento previo ni hagas suposiciones. Proporciona la respuesta de manera amigable y concisa en forma de viñetas. Si no hay suficiente información a continuación, di que no lo sabes. No menciones ningún coche ni detalles que no estén incluidos en las fuentes.`
								: "Dentro de la compañía Stratesys Cars, especializada en venta de automóviles de segunda mano, eres un asistente útil que proporciona información sobre coches basándose únicamente en los datos proporcionados a continuación. Los automóviles están expuestos y tienen una pegatina QR identificativa en su parabrisas. En este caso el cliente podría estar interesado en cualquiera de los automóviles y hacer preguntas sobre uno en concreto o varios de ellos. No incluyas ninguna información que no esté presente en las fuentes. No utilices ningún conocimiento previo ni hagas suposiciones. Proporciona la respuesta de manera amigable y concisa en forma de viñetas. Si no hay suficiente información a continuación, di que no lo sabes. No menciones ningún coche ni detalles que no estén incluidos en las fuentes.",
						messages: messages.value,
					}
				);

				const assistantMessage = response.data.response;

				// Agrega la respuesta del asistente al historial
				messages.value.push({
					role: "assistant",
					content: assistantMessage,
				});
			} catch (error) {
				console.error("Error al comunicarse con el backend:", error);
				messages.value.push({
					role: "assistant",
					content:
						"Lo siento, hubo un error al procesar tu solicitud.",
				});
			} finally {
				filteredMessages.value = messages.value.filter(
					(message) => message.role !== "system"
				);
				loadingMessage.value = false;
				// Desplazarse hacia abajo
				nextTick(() => {
					chatDisplay.value.scrollTop =
						chatDisplay.value.scrollHeight;
				});
			}
		}
	}
</script>

<template>
	<div class="chat-container">
		<h1 class="chat-header">Chat with <i>CarsBot</i></h1>
		<div class="chat-display" ref="chatDisplay">
			<div
				v-for="(message, index) in filteredMessages"
				:key="index"
				:class="['chat-message', message.role]"
			>
				<div v-if="message.role === 'user'">
					<i>Tú</i>
					<span>
						{{ message.content }}
					</span>
				</div>
				<div class="chat-assistant" v-else>
					<i>CarsBot</i>
					<span>
						{{ message.content }}
					</span>
				</div>
			</div>
		</div>
		<div class="chat-input">
			<input
				v-model="newMessage"
				@keyup.enter="sendMessage"
				type="text"
				placeholder="Escribe tu mensaje aquí"
			/>
			<button v-if="!loadingMessage" @click="sendMessage">Enviar</button>
			<button class="loading-button" v-else>
				<div class="loader"></div>
			</button>
		</div>
	</div>
</template>

<style scoped>
	/* Contenedor principal */
	.chat-container {
		display: flex;
		flex-direction: column;
		width: 500px;
		background-color: #ffffff;
		border-radius: 10px;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
	}

	/* Encabezado */
	.chat-header {
		background-color: #174f5e;
		color: #ffffff;
		text-align: center;
		padding: 1rem;
		border-top-left-radius: 10px;
		border-top-right-radius: 10px;
	}

	/* Área de mensajes */
	.chat-display {
		padding: 1rem;
		height: 400px;
		overflow-y: auto;
		background-color: #f9f9f9;
		display: flex;
		flex-direction: column;
	}

	/* Mensajes */
	.chat-message {
		max-width: 80%;
		margin-bottom: 0.5rem;
		font-size: 16px;
	}

	/* Mensajes */
	.chat-message div {
		display: flex;
		flex-direction: column;
	}

	.chat-message i {
		font-size: 20px;
		color: #174f5e;
	}

	.chat-message span {
		background-color: #174f5e56;
		padding: 5px 10px;
		border-radius: 5px;
		color: black;
	}

	.chat-message.user {
		align-self: flex-start;
	}

	.chat-message.assistant {
		align-self: flex-end;
	}

	.chat-assistant i {
		text-align: right;
	}

	.message-content {
		background-color: #e9ecef;
		padding: 0.75rem;
		border-radius: 5px;
	}

	/* Diferenciar colores de mensajes */
	.chat-message.user .message-content {
		background-color: #d1e7dd; /* Verde claro */
	}

	.chat-message.assistant .message-content {
		background-color: #bee5eb; /* Azul claro */
	}

	/* Entrada de mensaje */
	.chat-input {
		display: flex;
		padding: 1rem;
		background-color: #ffffff;
		border-top: 1px solid #dee2e6;
		border-bottom-left-radius: 10px;
		border-bottom-right-radius: 10px;
	}

	/* Campo de texto */
	.chat-input input {
		flex: 1;
		padding: 0.75rem;
		margin-right: 0.5rem;
		border: 1px solid #ced4da;
		border-radius: 5px;
		font-size: 16px;
	}

	/* Botón de enviar */
	.chat-input button {
		padding: 0.75rem 1rem;
		background-color: #174f5e;
		color: #ffffff;
		font-size: 16px;
		border: none;
		width: 100px;
		border-radius: 5px;
		cursor: pointer;
		font-weight: bold;
		letter-spacing: 1.5px;
	}

	.chat-input button:hover {
		border: 1px solid #174f5e;
		background-color: #ffffff;
		color: #174f5e;
	}

	/* Scroll personalizado */
	.chat-display::-webkit-scrollbar {
		width: 8px;
	}

	.chat-display::-webkit-scrollbar-thumb {
		background-color: #ced4da;
		border-radius: 4px;
	}

	.chat-display::-webkit-scrollbar-thumb:hover {
		background-color: #adb5bd;
	}

	.loading-button {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.loader {
		width: 10px;
		aspect-ratio: 1;
		border-radius: 50%;
		animation: l5 1s infinite linear alternate;
	}
	@keyframes l5 {
		0% {
			box-shadow: 20px 0 #fff, -20px 0 #fff2;
			background: #fff;
		}
		33% {
			box-shadow: 20px 0 #fff, -20px 0 #fff2;
			background: #fff2;
		}
		66% {
			box-shadow: 20px 0 #fff2, -20px 0 #fff;
			background: #fff2;
		}
		100% {
			box-shadow: 20px 0 #fff2, -20px 0 #fff;
			background: #fff;
		}
	}
</style>
