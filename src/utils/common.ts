// METHODS
function createFormData(file: File | null) {
  const formData = new FormData()
  if (file) formData.append('file', file)

  return formData
}

function cleanName(name: string | undefined): string | undefined {
  const prefixs = ['NAP', 'NAM', 'NAME']

  if (!name) return

  for (const prefix of prefixs) {
    if (name.startsWith(prefix)) {
      return name.slice(prefix.length)
    }
  }

  return name
}

// DATA

const washingDocumentFields = [
  { field: 'ET', key: 'Nombre' },
  { field: 'Conductor', key: 'Conductor' },
  { field: 'Producto', key: 'Producto' },
  { field: 'Matrícula Vehículo', key: 'Vehículo' },
  { field: 'Matrícula Cisterna/Contenedor', key: 'Cisterna/Contenedor' },
]

const adrCertificateData = {
  section1: [
    { field: 'Certificado Nº', key: 'Numero_certificado' },
    { field: 'Constructor del Vehículo', key: 'Constructor_vehiculo' },
    { field: 'Nº Identificación del Vehículo', key: 'Identificacion_vehiculo' },
    { field: 'Nº de Matrícula', key: 'Matricula' },
  ],

  section3: [{ field: 'Descripción del vehículo', key: 'Descripcion_vehiculo' }],

  section5: [
    {
      field: 'No aplicable',
      key: 'Disp_frenos_resistencia_no_aplicable',
    },
    {
      field:
        'La eficacia según 9.2.3.1.2 del ADR es suficiente para un peso total de la unidad de transporte de',
      key: 'Disp_frenos_resistencia_eficacia_suficiente',
    },
    { field: 'Peso total', key: 'Peso_total' },
  ],

  section7: [
    {
      field: 'Mercancías de la clase 1, incluyendo el grupo de compatibilidad J',
      key: 'Mercancias_clase_1_incl_grupo_comp_j',
    },
    {
      field: 'Mercancías de la clase 1, exceptuando el grupo de compatibilidad J',
      key: 'Mercancias_clase_1_excep_grupo_comp_j',
    },
    {
      field:
        'Solamente se podrán transportar (5) las materias autorizadas de acuerdo con el código de cisterna y cualquier disposición especial indicada en el Nº9',
      key: 'Solo_trans_materias_autorizadas',
    },
    {
      field:
        'Solamente se podrán transportar las materias siguientes (Clase, Nº ONU, y si fuera necesario el grupo de embalaje y la designación oficial de transporte): Este certificado se complementa con un listado de 8 Mercancías Peligrosas.',
      key: 'Solo_trans_materias_siguientes',
    },
  ],
}
const washingDocumentCodes = [
  'C01',
  'C10',
  'C20',
  'E35',
  'E41',
  'E50',
  'E51',
  'E52',
  'E55',
  'E56',
  'E57',
  'E58',
  'E60',
  'E61',
  'E62',
  'E63',
  'E64',
  'E71',
  'E72',
  'E75',
  'E77',
  'E78',
  'E79',
  'E90',
  'F01',
  'F50',
  'P01',
  'P10',
  'P30',
  'P40',
  'W50',
]
const prohibitedCodes = ['C01', 'C10', 'C20', 'F51']

export {
  createFormData,
  cleanName,
  washingDocumentFields,
  adrCertificateData,
  washingDocumentCodes,
  prohibitedCodes,
}
