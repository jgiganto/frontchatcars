<script setup>
import { ref, nextTick } from 'vue';
import axios from 'axios';

const newMessage = ref('');
const messages = ref([]);
const chatDisplay = ref(null);

async function sendMessage() {
  if (newMessage.value.trim() !== '') {
    // Agrega el mensaje del usuario al historial
    messages.value.push({ sender: 'user', text: newMessage.value });

    // Guarda el mensaje para enviarlo al backend
    const userMessage = newMessage.value;
    newMessage.value = '';

    try {
      // Realiza una solicitud POST a tu servidor backend
      const response = await axios.post('https://appservicecoche-a3emdug0gfeggxfk.westeurope-01.azurewebsites.net/chat', {
        query: userMessage,
        prompt:" You are a helpful assistant that provides information about cars based solely on the data provided below.\nDo not include any information that is not present in the sources.\nDo not use any prior knowledge or make assumptions.\nProvide the answer in a friendly and concise bulleted manner.\nIf there isn't enough information below, say you don't know.\nDo not mention any cars or details not included in the sources."
      });

      const assistantMessage = response.data.response;

      // Agrega la respuesta del asistente al historial
      messages.value.push({ sender: 'assistant', text: assistantMessage });
    } catch (error) {
      console.error('Error al comunicarse con el backend:', error);
      messages.value.push({
        sender: 'assistant',
        text: 'Lo siento, hubo un error al procesar tu solicitud.',
      });
    }

    // Desplazarse hacia abajo
    nextTick(() => {
      chatDisplay.value.scrollTop = chatDisplay.value.scrollHeight;
    });
  }
}
</script>

<template>
  <div class="chat-container">
    <h1 class="chat-header">CarsBot</h1>
    <div class="chat-display" ref="chatDisplay">
      <div
        v-for="(message, index) in messages"
        :key="index"
        :class="['chat-message', message.sender]"
      >
        <strong v-if="message.sender === 'user'">Tú:</strong>
        <strong v-else>CarsBot:</strong>
        {{ message.text }}
      </div>
    </div>
    <div class="chat-input">
      <input
        v-model="newMessage"
        @keyup.enter="sendMessage"
        type="text"
        placeholder="Escribe tu mensaje aquí"
      />
      <button @click="sendMessage">Enviar</button>
    </div>
  </div>
</template>


<style scoped>
/* Estilos generales */
body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: #f0f2f5;
  margin: 0;
  padding: 0;
}

/* Contenedor principal */
.chat-container {
  display: flex;
  flex-direction: column;
  max-width: 500px;
  margin: 2rem auto;
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

/* Encabezado */
.chat-header {
  background-color: #007bff;
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
}

.chat-message.user {
  align-self: flex-start;
}

.chat-message.assistant {
  align-self: flex-end;
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
}

/* Botón de enviar */
.chat-input button {
  padding: 0.75rem 1rem;
  background-color: #007bff;
  color: #ffffff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.chat-input button:hover {
  background-color: #0056b3;
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
</style>
