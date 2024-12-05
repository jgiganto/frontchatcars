import { defineStore } from 'pinia'

interface BoundingBox {
  left: number
  top: number
  width: number
  height: number
}

interface Prediction {
  probability: number
  tagId: string
  tagName: string
  isHighProbability: boolean
  boundingBox: BoundingBox
}

interface PredictionJson {
  predictions: Prediction[]
}

interface GroupedPredictions {
  [tagName: string]: Prediction[]
}

interface ManualOption {
  id: string
  key: 'butano6' | 'butano12' | 'butano125' | 'butanoPropano35'
  image: string
  name: string
  total: number
  totalSpected: number | null
}

interface CartItem {
  id: number
  name: string
  count: number
  unitPrice: number
  totalAmount: number
}

interface CartSummaryPrediction {
  totalAmount: number
  items: CartItem[]
  prediction: PredictionJson
}

export type RootState = {
  orderNumber: number
  imagePrediction: PredictionJson | null
  cartImagePrediction: CartSummaryPrediction | null
  upperProbabilityThreshold: number
  lowerProbabilityThreshold: number
  originalGroupedPredictions: GroupedPredictions | null
  butano6: number
  butano12: number
  butano125: number
  butanoPropano35: number
}

export const usePredictionStore = defineStore({
  id: 'prediction',
  state: () =>
    ({
      orderNumber: 0,
      imagePrediction: null,
      cartImagePrediction: null,
      upperProbabilityThreshold: 0.5,
      lowerProbabilityThreshold: 0.25,
      originalGroupedPredictions: null,
      butano6: 0,
      butano12: 0,
      butano125: 0,
      butanoPropano35: 0,
    }) as RootState,
  // persist: true,
  getters: {
    manualOptions(state): ManualOption[] {
      return [
        {
          id: '9fc45a4c-3443-4752-a2a3-3fdcd0cbfcfb',
          key: 'butano6',
          image: '/bombona-6.png',
          name: 'Butano 6 kg',
          total: state.butano6,
          totalSpected: null,
        },
        {
          id: '8fd4b2da-fce6-40c2-b62d-baa6f88b577e',
          key: 'butano12',
          image: '/bombona-12.png',
          name: 'Butano 12 kg',
          total: state.butano12,
          totalSpected: null,
        },
        {
          id: '40b49e70-6c5f-4542-bc15-291e98bb92b7',
          key: 'butano125',
          image: '/bombona-12.5.png',
          name: 'Butano 12,5 kg',
          total: state.butano125,
          totalSpected: null,
        },
        {
          id: '340357f5-080b-4c1d-acdf-cd60b771f064',
          key: 'butanoPropano35',
          image: '/bombona-propano.png',
          name: 'Propano 35 kg',
          total: state.butanoPropano35,
          totalSpected: null,
        },
      ]
    },

    highProbabilityPredictions: (state) => {
      return state.imagePrediction?.predictions.filter((prediction) => prediction.isHighProbability)
    },
  },
  actions: {
    groupPredictionsByTag(predictions: Prediction[] | undefined): GroupedPredictions | null {
      if (!predictions) return null

      return predictions.reduce((grouped, prediction) => {
        const { tagName } = prediction
        if (!grouped[tagName]) {
          grouped[tagName] = [] // Initialize an empty array if it doesn't exist
        }
        grouped[tagName].push(prediction) // Add the prediction to the correct group
        return grouped
      }, {} as GroupedPredictions)
    },

    shouldSuggestReview(id: string) {
      if (this.imagePrediction) {
        // Check if there are any predictions with the same id and a probability < 0.5
        return this.imagePrediction.predictions.some(
          (prediction) => prediction.tagId === id && !prediction.isHighProbability,
        )
      }
    },

    updateTotalsFromResponse(response: Prediction[] | undefined) {
      if (!response) return
      // Count occurrences of each tagId
      const counts: Record<string, number> = response.reduce(
        (acc, prediction) => {
          const { tagId } = prediction
          acc[tagId] = (acc[tagId] || 0) + 1
          return acc
        },
        {} as Record<string, number>,
      )

      // Assign the totals to the respective state properties
      this.butano6 = counts['9fc45a4c-3443-4752-a2a3-3fdcd0cbfcfb'] || 0
      this.butano12 = counts['8fd4b2da-fce6-40c2-b62d-baa6f88b577e'] || 0
      this.butano125 = counts['40b49e70-6c5f-4542-bc15-291e98bb92b7'] || 0
      this.butanoPropano35 = counts['340357f5-080b-4c1d-acdf-cd60b771f064'] || 0
    },

    resetStore() {
      this.orderNumber = 0
      this.imagePrediction = null
      this.cartImagePrediction = null
      this.originalGroupedPredictions = null
      this.butano6 = 0
      this.butano12 = 0
      this.butano125 = 0
      this.butanoPropano35 = 0
    },
  },
})
