import axios from 'axios'
import type { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios'

export abstract class HTTPBaseService {
  protected instance: AxiosInstance
  protected maxRecallNumber: number
  protected numberOfCalls: number
  protected readonly baseURL: string | undefined | boolean

  public constructor(baseURL: string) {
    this.baseURL = baseURL
    this.instance = axios.create({
      baseURL: `${this.baseURL}/`,
    })
    this.maxRecallNumber = 5
    this.numberOfCalls = 0
    this.initializeRequestInterceptor()
    this.initializeResponseInterceptor()
  }

  private initializeRequestInterceptor = () => {
    this.instance.interceptors.request.use((requestConfig) => {
      return this.handleRequest(requestConfig)
    })
  }

  private initializeResponseInterceptor = () => {
    this.instance.interceptors.response.use((response) => {
      this.numberOfCalls = 0
      return response
    }, this.handleError)
  }

  private handleRequest = (config: InternalAxiosRequestConfig) => {
    console.log(config)
    return config
  }

  private handleError = async (error: AxiosError) => {
    if (!error.response && error.message === 'Network Error') {
      // HTTP STATUS - 504 TIMEOUT
      console.log('interceptors Network Error', JSON.parse(JSON.stringify(error)))
      return Promise.reject(error)
    }

    if (error?.response?.status === 400) {
      console.log('interceptors 400', error?.response?.data)
      return Promise.reject(error)
    }

    if (error.response?.status === 401 || error.response?.status === 403) {
      console.log('interceptors 401 / 403', error?.response?.data)
    }

    if (error?.response?.status === 404) {
      console.log('interceptors 404', error?.response?.data)

      return Promise.reject(error)
    }

    if (error.response?.status === 309) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const errorList: any = error.response.data
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      errorList.errors.forEach((el: any, index: number) => {
        console.log(`Business error ${index + 1} ->`, el)
      })

      return Promise.reject(error)
    }

    if (error?.response?.status === 500) {
      console.log('interceptors 500', error?.response?.data)
      return Promise.reject(error)
    }

    if (error?.response?.status === 504) {
      // EN 504 TIMEOUT - error.response === undefined
      console.log('interceptors 504', error?.response?.data)
      return Promise.reject(error)
    }
    return Promise.reject(error)
  }
}
