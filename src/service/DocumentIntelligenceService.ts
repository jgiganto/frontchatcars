import type { AxiosResponse } from 'axios'
import { HTTPBaseService } from '@/service/httpBaseService'

export class DocumentIntelligenceService extends HTTPBaseService {
  private static classInstance?: DocumentIntelligenceService

  constructor() {
    super('https://app-docintback-dev-we-004.azurewebsites.net')
  }

  public static getInstance(): DocumentIntelligenceService {
    if (!this.classInstance) {
      this.classInstance = new DocumentIntelligenceService()
    }

    return this.classInstance
  }

  public getDocumentValidation = async (formData: FormData): Promise<AxiosResponse> => {
    return await this.instance.post(`DocumentIntelligence/GetDocumentIntelligence`, formData, {
      headers: {
        'content-type': 'multipart/form-data',
        accept: '*/*',
      },
    })
  }

  public getIdentityDocument = async (formData: FormData): Promise<AxiosResponse> => {
    return await this.instance.post(`DocumentIntelligence/GetIdentityDocument`, formData, {
      headers: {
        'content-type': 'multipart/form-data',
        accept: '*/*',
      },
    })
  }

  public getContractOrInvoiceDocument = async (formData: FormData): Promise<AxiosResponse> => {
    return await this.instance.post(`DocumentIntelligence/GetContractOrInvoiceDocument`, formData, {
      headers: {
        'content-type': 'multipart/form-data',
        accept: '*/*',
      },
    })
  }
}
