<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import TheChat from '@/components/stratesysCars/TheChat.vue'
// @ts-expect-error - Not undefined
import { QrcodeStream } from 'vue3-qrcode-reader'
import ActionButton from '@/components/stratesysCars/ActionButton.vue'
import chatSrc from '@/assets/icons/chat-logo.png'
import qrSrc from '@/assets/icons/qr-code.png'
import classificationSrc from '@/assets/icons/data-classification.png'
import shoppingSrc from '@/assets/icons/shopping-bag.png'

// ROUTER
const router = useRouter()

// DATA
const openChat = ref<boolean>(false)
const showQrCodeReader = ref<boolean>(false)

const actionButtons = [
  {
    title: 'Registrar Compra',
    src: shoppingSrc,
    action: goToCustomVision,
  },
  {
    title: 'Clasificación Docs',
    src: classificationSrc,
    action: goToDocIntelligence,
  },
  {
    title: '¡Chat para dudas!',
    src: chatSrc,
    action: showChat,
  },
  {
    title: '¡Escanea un QR!',
    src: qrSrc,
    action: showQrReader,
  },
]

// METHODS
function showChat(): void {
  openChat.value = !openChat.value
  showQrCodeReader.value = false
}

function showQrReader(): void {
  showQrCodeReader.value = !showQrCodeReader.value
  openChat.value = false
}

function goToCustomVision(): void {
  router.push('/stratesys-cars/shop')
}

function goToDocIntelligence(): void {
  router.push('/stratesys-cars/classification')
}

function isValidUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch (e) {
    console.log(e)
    return false
  }
}

function onDecode(decodedString: string): void {
  console.log('Decoded QR code:', decodedString)

  if (isValidUrl(decodedString)) {
    window.location.href = decodedString
  } else {
    alert("The QR code doesn't contain a valid URL")
  }
}

function onInit(promise: Promise<void>): void {
  promise.catch((error: Error) => {
    console.error('Initialization error:', error.message)
  })
}
</script>

<template>
  <div class="hero">
    <div class="hero-content">
      <h1>La compra de tu auto, <u>más fácil que nunca</u></h1>
      <TheChat class="chat" v-if="openChat" />
      <div class="qr-reader-fullscreen" v-if="showQrCodeReader">
        <QrcodeStream class="qr-lector" @decode="onDecode" @init="onInit">
          <h3>¡Escanea el QR!</h3>
        </QrcodeStream>
      </div>
    </div>
    <div class="chat-button-container">
      <ActionButton
        v-for="button in actionButtons"
        :key="button.title"
        :title="button.title"
        :src="button.src"
        :action="button.action"
      />
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
  color: var(--c-white);
  position: absolute;
  top: 50%;
  text-shadow: 6px 6px 6px var(--c-dark-blue);
}

.chat-button-container {
  position: fixed;
  bottom: 20px;
  right: 20px;
  display: flex;
  align-items: center;
  gap: 20px;
  color: var(--c-white);
  font-size: 12px;
  text-align: center;
}

.chat-button-container div {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 5px;
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
    font-size: 68px;
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

  .chat-button-container {
    font-size: 12px;
  }

  .chat {
    z-index: 10;
    margin-left: auto;
    margin-right: auto;
    left: 0;
    right: 0;
    bottom: 117px;
    text-align: center;
  }

  .qr-reader-fullscreen {
    position: fixed;
    max-width: 93%;
    height: calc(100vh - 75px - 115px);
    z-index: 11;
    top: 74px;
    text-align: center;
  }

  .qr-reader-fullscreen .qr-lector h3 {
    font-size: 16px;
  }
}
</style>
