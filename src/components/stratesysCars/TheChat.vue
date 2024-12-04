<script lang="ts" setup>
// IMPORTS
import { ref, nextTick, onMounted, type Ref } from 'vue'
import { useRoute } from 'vue-router'
import { RagService } from '@/service/RagService'
import type { Message } from '@/types/common'

// SERVICE
const { sendChatRequest } = RagService.getInstance()

// ROUTER
const route = useRoute()

// DATA
const newMessage: Ref<string> = ref('')
const messages: Ref<Message[]> = ref([])
const chatDisplay: Ref<HTMLElement | null> = ref(null)
const loadingMessage: Ref<boolean> = ref(false)
const brand: Ref<string | null> = ref(null)
const model: Ref<string | null> = ref(null)
const filteredMessages: Ref<Message[]> = ref([])
const textarea: Ref<HTMLTextAreaElement | null> = ref(null)

// HOOKS
onMounted(() => {
  brand.value = route.query.brand as string | null
  model.value = route.query.model as string | null

  if (brand.value && model.value) {
    const brandCapitalized =
      brand.value === 'bmw'
        ? brand.value.toUpperCase()
        : brand.value.charAt(0).toUpperCase() + brand.value.slice(1)
    const modelCapitalized = model.value.charAt(0).toUpperCase() + model.value.slice(1)

    messages.value.push({
      role: 'assistant',
      content: `¿Quieres saber más sobre el ${brandCapitalized} ${modelCapitalized}?`,
    })
  } else {
    messages.value.push({
      role: 'assistant',
      content: '¡Hola, soy CarsBot! Tu asistente virtual, ¿en qué puedo ayudarte?',
    })
  }

  filteredMessages.value = messages.value.filter((message) => message.role !== 'system')
})

// METHODS
async function sendMessage(): Promise<void> {
  if (textarea.value) textarea.value.style.height = '28px'

  if (newMessage.value.trim() !== '') {
    loadingMessage.value = true

    // Add the user's message to the chat history
    messages.value.push({ role: 'user', content: newMessage.value })

    filteredMessages.value = messages.value.filter((message) => message.role !== 'system')

    // Add system message if not already present
    if (messages.value[0]?.role !== 'system') {
      messages.value.unshift({
        role: 'system',
        content:
          brand.value && model.value
            ? `Dentro de la compañía Stratesys Cars, especializada en venta de automóviles de segunda mano, eres un asistente útil que proporciona información sobre el automóvil ${brand.value} ${model.value} todas las preguntas que va hacer el usuario serán sobre esa marca y modelo de automóvil, basándose únicamente en los datos proporcionados a continuación, ...`
            : 'Dentro de la compañía Stratesys Cars, especializada en venta de automóviles de segunda mano, eres un asistente útil que proporciona información sobre coches basándose únicamente en los datos proporcionados a continuación. ...',
      })
    }

    // Store the user message for backend request
    const userMessage = newMessage.value

    let query = userMessage

    // Include brand and model in query if defined
    if (brand.value && model.value) {
      query += ` ${brand.value} ${model.value}`
    }

    newMessage.value = ''

    // Make a POST request to the backend
    await sendChatRequest(query, brand.value, model.value, messages.value)
      .then((res) => {
        if (res) {
          const assistantMessage = res.data.response

          // Agrega la respuesta del asistente al historial
          messages.value.push({
            role: 'assistant',
            content: assistantMessage,
          })
        }
      })
      .catch((error) => {
        console.error('Error al comunicarse con el backend:', error)

        messages.value.push({
          role: 'assistant',
          content: 'Lo siento, hubo un error al procesar tu solicitud.',
        })
      })
      .finally(() => {
        filteredMessages.value = messages.value.filter((message) => message.role !== 'system')
        loadingMessage.value = false
        // Desplazarse hacia abajo
        nextTick(() => {
          if (chatDisplay.value) {
            chatDisplay.value.scrollTop = chatDisplay.value.scrollHeight
          }
        })
      })
  }
}

function handleInput(): void {
  if (textarea.value) {
    textarea.value.style.height = '28px'

    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    textarea.value.scrollHeight < 50
      ? (textarea.value.style.height = textarea.value.scrollHeight + 'px')
      : (textarea.value.style.height = '50px')
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
      <textarea
        ref="textarea"
        v-model="newMessage"
        @keyup.enter="sendMessage"
        @input="handleInput"
        placeholder="Escribe tu mensaje aquí"
      ></textarea>
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
  width: 400px;
  background-color: var(--c-white);
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

/* Encabezado */
.chat-header {
  background-color: var(--c-dark-blue);
  color: var(--c-white);
  text-align: center;
  padding: 0.5rem;
  font-size: 20px;
  font-weight: bold;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
}

.chat-header i {
  font-weight: bold;
}

/* Área de mensajes */
.chat-display {
  padding: 1rem;
  height: 270px;
  overflow-y: auto;
  background-color: #f9f9f9;
  display: flex;
  flex-direction: column;
}

/* Mensajes */
.chat-message {
  max-width: 80%;
  margin-bottom: 0.5rem;

  word-break: break-word; /* Hace que las palabras largas se dividan */
  overflow-wrap: break-word; /* Alternativa para navegadores más modernos */
  white-space: normal; /* Permite que el texto se envuelva */
}

/* Mensajes */
.chat-message div {
  display: flex;
  flex-direction: column;
}

.chat-message i {
  font-size: 14px;
  margin: 0 5px;
  color: var(--c-dark-blue);
}

.chat-message span {
  background-color: #1e355256;
  padding: 5px 10px;
  border-radius: 5px;
  color: black;
}

.chat-message.user {
  align-self: flex-end;
}

.chat-message.user i {
  font-size: 14px;
}

.chat-message.user i {
  text-align: right;
  font-size: 14px;
}

.chat-message.assistant {
  align-self: flex-start;
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
  align-items: center;
  padding: 1rem;
  background-color: var(--c-white);
  border-top: 1px solid var(--c-grey-50);
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
}

.chat-input textarea {
  flex: 1;
  padding: 3px 8px;
  margin-right: 0.5rem;
  border: 1px solid var(--c-dark-blue);
  border-radius: 5px;
  font-size: 12px;
  line-height: 20px;
  font-family: inherit;
  scrollbar-width: none;
  height: 28px;
  max-height: 100px;
  resize: none;
}

.chat-input textarea::-webkit-scrollbar {
  width: 0;
}

.chat-input textarea:focus {
  outline: none;
}

/* Botón de enviar */
.chat-input button {
  background-color: var(--c-dark-blue);
  color: var(--c-white);
  font-size: 12px;

  border: none;
  width: 80px;
  min-height: 30px;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  letter-spacing: 1.5px;
}

.chat-input button:hover {
  border: 1px solid var(--c-dark-blue);
  background-color: var(--c-white);
  color: var(--c-dark-blue);
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
  width: 5px;
  aspect-ratio: 1;
  border-radius: 50%;
  animation: l5 1s infinite linear alternate;
}

@keyframes l5 {
  0% {
    box-shadow:
      20px 0 #fff,
      -20px 0 #fff2;
    background: #fff;
  }
  33% {
    box-shadow:
      20px 0 #fff,
      -20px 0 #fff2;
    background: #fff2;
  }
  66% {
    box-shadow:
      20px 0 #fff2,
      -20px 0 #fff;
    background: #fff2;
  }
  100% {
    box-shadow:
      20px 0 #fff2,
      -20px 0 #fff;
    background: #fff;
  }
}

@media (max-width: 500px) {
  .chat-container {
    width: 350px;
    height: 480px;
    height: calc(100vh - 80px - 110px);
  }

  .chat-display {
    height: calc(100vh - 80px - 110px - 65px);
  }

  .chat-header {
    font-size: 22px;
  }

  .chat-message {
    text-align: left;
  }

  .chat-message i {
    font-size: 14px;
  }

  .chat-input textarea {
    line-height: 16px;
  }

  /* Botón de enviar */
  .chat-input button {
  }
}

@media (max-width: 360px) {
  .chat-container {
    width: 330px;
  }
}
</style>
