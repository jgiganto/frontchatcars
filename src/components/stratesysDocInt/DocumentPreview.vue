<script setup lang="ts">
// IMPORTS
import { storeToRefs } from 'pinia'
import { useClassificationStore, type Analisys } from '@/stores/classificationStore'
import AppCheckbox from '../common/AppCheckbox.vue'

// STORE
const { showClasificationSelectedFileModal } = storeToRefs(useClassificationStore())

// TYPE
enum docType {
  Contrato = 'Contratos:Contratos',
  Factura = 'Facturas:Facturas',
  Otros = 'Otros',
}

enum errorType {
  FirmaContratante = 'FirmaContratante',
  FirmaContratista = 'FirmaContratista',
  DNIRepresentanteLegalContratante = 'DNIRepresentanteLegalContratante',
  DNIContratista = 'DNIContratista',
  CIFEmpresaContratante = 'CIFEmpresaContratante',
}

// PROPS
const props = defineProps<{
  src: string
  document: Analisys
}>()

// DATA
const dataContratante = [
  { name: 'Empresa contratante', field: 'EmpresaContratante' },
  { name: 'CIF', field: 'CIFEmpresaContratante' },
  { name: 'Representante legal', field: 'RepresentanteLegalContratante' },
  { name: 'DNI', field: 'DNIRepresentanteLegalContratante' },
]
const dataContratista = [
  { name: 'Contratista', field: 'NombreContratista' },
  { name: 'DNI', field: 'DNIContratista' },
]
const dataSolicitante = [
  { name: 'Dirección', field: 'DirecciónEnvío' },
  { name: 'Teléfono', field: 'TelefonoEnvio' },
]
const dataCliente = [
  { name: 'Dirección', field: 'DirecciónCliente' },
  { name: 'Teléfono', field: 'TelefonoCliente' },
]
const dataProveedor = [
  { name: 'Proveedor', field: 'NombreProveedor' },
  { name: 'Dirección', field: 'DirecciónProveedor' },
  { name: 'Teléfono', field: 'TelefonoVendedor' },
]

// METHODS
function handleErrors(errorkey: string) {
  switch (errorkey) {
    case errorType.FirmaContratante:
      return 'Falta la firma del contratante'

    case errorType.FirmaContratista:
      return 'Falta la firma del contratista'

    case errorType.CIFEmpresaContratante:
      return 'Se sugiere la revisión del CIF'

    case errorType.DNIRepresentanteLegalContratante:
      return 'Se sugiere la revisión del DNI del representante legal'

    case errorType.DNIContratista:
      return 'Se sugiere la revisión del DNI del contratista'

    default:
      return errorkey
  }
}
</script>

<template>
  <div class="preview-wrapper">
    <iframe
      id="iframe"
      class="pdf-iframe"
      :src="`${props.src}#toolbar=0`"
      allow="fullscreen"
    ></iframe>

    <div class="errors-preview">
      <div class="errors-header">
        <img
          class="close-icon"
          @click="showClasificationSelectedFileModal = false"
          src="../../assets/icons/close.png"
          alt=""
        />
      </div>
      <div class="content">
        <!-- CONTRATOS -->
        <div v-if="props.document.docType === docType.Contrato" class="document-info">
          <div>
            <div class="info-block">
              <h3>Datos del Contratante</h3>
              <hr />
              <div>
                <ul>
                  <li v-for="dato in dataContratante" :key="dato.field">
                    <b>{{ dato.name }}: </b>
                    {{
                      props.document.extractedFields[dato.field]
                        ? props.document.extractedFields[dato.field]!.replace(/,$/, '')
                        : 'Se requiere revisión'
                    }}
                  </li>
                </ul>
                <AppCheckbox
                  class="checkbox"
                  :title="'Firmado'"
                  :validated="props.document.extractedFields.FirmaContratante ? true : false"
                  :disabled="true"
                />
              </div>
            </div>

            <div class="info-block">
              <h3>Datos del Contratista</h3>
              <hr />
              <div>
                <ul>
                  <li v-for="dato in dataContratista" :key="dato.field">
                    <b>{{ dato.name }}: </b>
                    {{
                      props.document.extractedFields[dato.field]
                        ? props.document.extractedFields[dato.field]!.replace(/,$/, '')
                        : 'Se requiere revisión'
                    }}
                  </li>
                </ul>
                <AppCheckbox
                  class="checkbox"
                  :title="'Firmado'"
                  :validated="props.document.extractedFields.FirmaContratista ? true : false"
                  :disabled="true"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- FACTURAS -->
        <div v-if="props.document.docType === docType.Factura" class="document-info">
          <div>
            <!-- DATOS PROVEEDOR -->
            <div class="info-block">
              <h3>Datos del Proveedor</h3>
              <hr />
              <ul>
                <li v-for="dato in dataProveedor" :key="dato.field">
                  <b>{{ dato.name }}: </b>
                  {{
                    props.document.extractedFields[dato.field]
                      ? props.document.extractedFields[dato.field]
                      : 'Se requiere revisión'
                  }}
                </li>
              </ul>
            </div>

            <!-- DATOS SOLICITANTE -->
            <div class="info-block">
              <h3>Datos del Solicitante</h3>
              <hr />
              <ul>
                <li>
                  <b>Solicitante: </b>
                  {{ props.document.extractedFields['Solicitante'] }} -
                  {{ props.document.extractedFields['EnvíoDestinatario'] }}
                </li>
                <li v-for="dato in dataSolicitante" :key="dato.field">
                  <b>{{ dato.name }}: </b>
                  {{
                    props.document.extractedFields[dato.field]
                      ? props.document.extractedFields[dato.field]
                      : 'Se requiere revisión'
                  }}
                </li>
              </ul>
            </div>

            <!-- DATOS CLIENTE -->
            <div class="info-block">
              <h3>Datos del Cliente</h3>
              <hr />
              <ul>
                <li>
                  <b>Cliente: </b>
                  {{ props.document.extractedFields['NombreCliente'] }} -
                  {{ props.document.extractedFields['ClienteDestinatario'] }}
                </li>
                <li v-for="dato in dataCliente" :key="dato.field">
                  <b>{{ dato.name }}: </b>
                  {{
                    props.document.extractedFields[dato.field]
                      ? props.document.extractedFields[dato.field]
                      : 'Se requiere revisión'
                  }}
                </li>
              </ul>
            </div>

            <!-- A PAGAR -->
            <div class="info-block">
              <h3>Total a Pagar</h3>
              <hr />
              <ul>
                <li>
                  <b
                    >{{
                      props.document.extractedFields['FacturaTotal']
                        ? '$ ' + props.document.extractedFields['FacturaTotal']
                        : 'Se requiere revisión'
                    }}
                  </b>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <!-- ERRORES -->
        <div v-if="Object.keys(props.document.errorFields).length > 0" class="errors-block">
          <h3>Datos a revisar</h3>
          <hr />
          <ul>
            <li v-for="(value, key) in props.document.errorFields" :key="key">
              {{
                props.document.docType === docType.Contrato ? handleErrors(key as string) : value
              }}
            </li>
          </ul>
        </div>

        <!-- OTROS -->
        <div v-if="props.document.docType === docType.Otros">
          El documento no se identificó como "Factura" o "Contrato".
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.preview-wrapper {
  width: 98%;
  height: 85%;
  position: absolute;
  left: 0;
  right: 0;
  top: 13%;
  margin: auto;
  background-color: var(--c-white);
  border-radius: 4px;
  display: flex;
  justify-content: space-between;
  padding: 20px;
}

.pdf-iframe {
  width: 50%;
  border: none;
}

.errors-preview {
  width: 46%;
}

.content {
  overflow: scroll;
  overflow-x: hidden;
  scrollbar-width: thin;
  padding-right: 15px;
  max-height: 90%;
}

.errors-header {
  display: flex;
  align-items: center;
  justify-content: end;
  margin-bottom: 20px;
}

.close-icon {
  cursor: pointer;
  width: 15px;
}

.document-info {
  padding-right: 15px;
}

.document-info h3 {
  font-style: italic;
  font-size: 14px;
}

.info-block {
  margin-bottom: 20px;
}

.info-block > div {
  margin-top: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.errors-block {
  padding-right: 15px;
}

.errors-block h3 {
  font-style: italic;
  font-size: 14px;
}

.errors-block ul {
  margin-top: 10px;
  padding-left: 16px;
}

.errors-block li {
  background: url('@/assets/icons/error.png') no-repeat left 2px;
  padding-left: 20px; /* the width of your image + some space */
  padding-bottom: 5px;
  list-style: none;
  color: var(--c-error);
}

.checkbox {
  margin-top: 10px;
}

@media (max-width: 500px) {
  .preview-wrapper {
    width: 95%;
    height: 89%;
    top: 10%;
    border-radius: 4px;
    display: flex;
    flex-direction: column;
    /* justify-content: space-between; */
    align-items: center;
    padding: 10px;
    padding-left: 20px;
  }

  .pdf-iframe {
    width: 0;
    height: 0;
  }

  .errors-preview {
    width: 100%;
    height: 100%;
  }
}
</style>
