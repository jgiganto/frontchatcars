import type { AxiosResponse } from 'axios'
import { HTTPBaseService } from '@/service/httpBaseService'

export class CustomVisionService extends HTTPBaseService {
  private static classInstance?: CustomVisionService

  constructor() {
    super('https://app-customvisionback-dev-we-004.azurewebsites.net')
  }

  public static getInstance(): CustomVisionService {
    if (!this.classInstance) {
      this.classInstance = new CustomVisionService()
    }

    return this.classInstance
  }

  public getPrediction = async (
    upperProbabilityThreshold: number,
    lowerProbabilityThreshold: number,
    formData: FormData,
  ): Promise<AxiosResponse> => {
    return await this.instance.post(`CustomVision/DetectImage`, formData, {
      params: { upperProbabilityThreshold, lowerProbabilityThreshold },
      headers: {
        'content-type': 'multipart/form-data',
        accept: '*/*',
      },
    })
  }

  public getInvoice = async (
    upperProbabilityThreshold: number,
    lowerProbabilityThreshold: number,
    formData: FormData,
  ): Promise<AxiosResponse> => {
    return await this.instance.post(`CustomVision/AutoInvoiceProcessor`, formData, {
      params: { upperProbabilityThreshold, lowerProbabilityThreshold },
      headers: {
        'content-type': 'multipart/form-data',
        accept: '*/*',
      },
    })
  }
}
