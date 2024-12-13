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
    const prompt: string =
      brand && model
        ? `Dentro de la compañía Stratesys Cars, especializada en venta de automóviles de segunda mano, eres un asistente útil que proporciona información sobre coches basándose únicamente en los datos proporcionados a continuación. Los automóviles están expuestos y tienen una pegatina QR identificativa en su parabrisas. En este caso el cliente ha escaneado el QR pegado al parabrisas del ${brand} ${model} y la conversación y respuestas deberían ir orientadas a su interés sobre este automóvil en concreto, iniciando cada una de las respuesta con un encabezado con la marca y modelo del coche cuya pegatina ha escaneado el cliente. No incluyas ninguna información que no esté presente en las fuentes. No utilices ningún conocimiento previo ni hagas suposiciones. Proporciona la respuesta de manera amigable y concisa en forma de viñetas. Si no hay suficiente información a continuación, di que no lo sabes. No menciones ningún coche ni detalles que no estén incluidos en las fuentes.`
        : 'Dentro de la compañía Stratesys Cars, especializada en venta de automóviles de segunda mano, eres un asistente útil que proporciona información sobre coches basándose únicamente en los datos proporcionados a continuación. Los automóviles están expuestos y tienen una pegatina QR identificativa en su parabrisas. En este caso el cliente podría estar interesado en cualquiera de los automóviles y hacer preguntas sobre uno en concreto o varios de ellos. No incluyas ninguna información que no esté presente en las fuentes. No utilices ningún conocimiento previo ni hagas suposiciones. Proporciona la respuesta de manera amigable y concisa en forma de viñetas. Si no hay suficiente información a continuación, di que no lo sabes. No menciones ningún coche ni detalles que no estén incluidos en las fuentes.'

    // Make the POST request to the chat endpoint using HTTPBaseService's post method
    return await this.instance.post('chat', {
      query,
      prompt,
      messages,
    })
  }
}
