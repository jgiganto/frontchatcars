import type { AxiosResponse } from 'axios'
import { HTTPBaseService } from '@/service/httpBaseService'
import type { Message } from '@/types/common'

export class RagService extends HTTPBaseService {
  private static classInstance?: RagService
 
  //this.baseURL = 'https://asppython-rag-dev-fc-008.azurewebsites.net';   //Maria Pia.
//this.baseURL = 'https://app-ragback-dev-frc-002.azurewebsites.net/chat'; //Sergio asppython-rag-dev-fc-011.azurewebsites.net aspback-rag-dev-fc-poc03

  constructor() {
    super('https://aspback-rag-dev-fc-poc03.azurewebsites.net')
  }

  public static getInstance(): RagService {
    if (!this.classInstance) {
      this.classInstance = new RagService()
    }

    return this.classInstance
  }

  public sendChatRequest = async (
    query: string,
    brand: string | null,
    model: string | null,
    messages: Message[],
  ): Promise<AxiosResponse> => {
    // Define the prompt based on brand and model values
    // const prompt: string =
    //   brand && model
    //     ? `Dentro de la compañía Stratesys Cars, especializada en venta de automóviles de segunda mano, eres un asistente útil que proporciona información sobre coches basándose únicamente en los datos proporcionados a continuación. Los automóviles están expuestos y tienen una pegatina QR identificativa en su parabrisas. En este caso el cliente ha escaneado el QR pegado al parabrisas del ${brand} ${model} y la conversación y respuestas deberían ir orientadas a su interés sobre este automóvil en concreto, iniciando cada una de las respuesta con un encabezado con la marca y modelo del coche cuya pegatina ha escaneado el cliente. No incluyas ninguna información que no esté presente en las fuentes. No utilices ningún conocimiento previo ni hagas suposiciones. Proporciona la respuesta de manera amigable y concisa en forma de viñetas. Si no hay suficiente información a continuación, di que no lo sabes. No menciones ningún coche ni detalles que no estén incluidos en las fuentes.`
    //     : 'Dentro de la compañía Stratesys Cars, especializada en venta de automóviles de segunda mano, eres un asistente útil que proporciona información sobre coches basándose únicamente en los datos proporcionados a continuación. Los automóviles están expuestos y tienen una pegatina QR identificativa en su parabrisas. En este caso el cliente podría estar interesado en cualquiera de los automóviles y hacer preguntas sobre uno en concreto o varios de ellos. No incluyas ninguna información que no esté presente en las fuentes. No utilices ningún conocimiento previo ni hagas suposiciones. Proporciona la respuesta de manera amigable y concisa en forma de viñetas. Si no hay suficiente información a continuación, di que no lo sabes. No menciones ningún coche ni detalles que no estén incluidos en las fuentes.'

    // Secciones del prompt para un caso en el que ya conocemos la marca y modelo
      const promptHeaderWithBrandModel = (brand: string, model: string) => `
      Eres un asistente virtual que trabaja para la compañía Stratesys Cars, especializada en venta de automóviles de segunda mano.
      El cliente ha escaneado el QR pegado al parabrisas del ${brand} ${model} y tiene interés en este automóvil en concreto. 
      Tus respuestas deben centrarse únicamente en la información disponible en las fuentes provistas más adelante.

      Instrucciones:
      1. Empieza cada respuesta con un encabezado que incluya la marca y modelo (${brand} ${model}).
      2. No incluyas ninguna información que no aparezca en las fuentes.
      3. No utilices ningún conocimiento previo ni hagas suposiciones.
      4. Si no hay suficiente información, di que no lo sabes.
      5. Proporciona las respuestas de manera amigable y concisa, usando viñetas.
      6. No menciones ningún coche ni detalles que no estén en las fuentes.
      `.trim();

      // Secciones del prompt para un caso genérico (sin marca y modelo específicos)
      const promptHeaderGeneric = `
      Eres un asistente virtual que trabaja para la compañía Stratesys Cars, especializada en venta de automóviles de segunda mano.
      Los automóviles en venta tienen una pegatina QR identificativa en su parabrisas, y el cliente puede tener preguntas
      sobre uno o varios vehículos.

      NOTA IMPORTANTE: 
      . **Si el usuario solicita la “Descripcion” de un coche (o menciona “descripción” en singular/plural), responde EXCLUSIVAMENTE con el texto que aparezca en la propiedad "Descripcion" del campo "manualCar".**  
        - No incluyas otros datos (no menciones características, motor, dimensiones, etc.).
        - No incluyas ninguna explicación adicional.
        - No agregues más contexto, NI INFORMACIÓN más allá del valor literal de "Descripcion", ES DECIR EL VALOR DE LA PROPIEDAD Descripcion.
        - ES DECIR EXCLUYE CaracteristicasExterior, Seguridad, etc.

      Instrucciones:
      1. Responde únicamente con la información disponible en las fuentes provistas más adelante.
      2. No incluyas ningún conocimiento previo ni hagas suposiciones.
      3. Si no hay suficiente información, di que no lo sabes.
      4. Proporciona las respuestas de manera amigable y concisa, usando viñetas.
      5. No menciones ningún coche ni detalles que no estén en las fuentes.
      6. Responde siempre en español.
      `.trim();

    // Pie de prompt con instrucciones generales para la sección de fuentes
      const promptFooter = `
      Por favor, revisa las fuentes a continuación y responde en español, siguiendo las directrices anteriores.
      `.trim();

      function buildPrompt(brand?: string, model?: string): string {
        if (brand && model) {
          return `
          ${promptHeaderWithBrandModel(brand, model)}
          
          ${promptFooter}
          `.trim();
          } else {
            return `
        ${promptHeaderGeneric}
        
        ${promptFooter}
        `.trim();
          }
        }

    const prompt: string = buildPrompt(brand ?? undefined, model ?? undefined);



    // Make the POST request to the chat endpoint using HTTPBaseService's post method
    return await this.instance.post('chat', {
      query,
      prompt,
      messages,
    })
  }
}
