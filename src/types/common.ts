export interface Model {
  legibilityStatus: boolean
  message: string
  docType: string
  extractedFields: {
    [key: string]: string | null | undefined
  }
}

export enum PoCModel {
  RepsolCustom = 'RepsolCustom',
  RepsolDocInt = 'RepsolDocInt',
  Common = 'Common',
}

// WASHING CERTIFICATE
export interface ValidationPoints {
  id: number
  title: string
  required: boolean
  validated: boolean
}

export interface Sections {
  id: number
  title: string
  validationPoints: ValidationPoints[]
}

export interface WashingCertificate {
  sections: [Sections]
  prohibitedCodes?: string[]
}

// VALIDATION POINTS
export interface ValidationPoint {
  title: string
  isValidated: boolean
  required: boolean
}

export interface ExtractedFieldPoint {
  extractedFieldPoint: string
  value: string | null | undefined
}

export interface ProhibitedExtractedFieldPoint {
  extractedProhibitedPoint: string
  value: string | null | undefined
}

export interface ProhibitedPoints {
  pocPoint: ProhibitedExtractedFieldPoint
}

export interface AllPoints {
  manualVal: ValidationPoint
  pocPoint: ExtractedFieldPoint
}

export enum docTypeEnum {
  CertificadoLavado = 'CertificadoLavado',
  ADR = 'ADR',
}

export interface Message {
  role: 'user' | 'assistant' | 'system'
  content: string
}
