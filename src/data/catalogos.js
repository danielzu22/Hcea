// Catálogos de la maqueta. Son datos fijos (no se editan desde la UI):
// funcionan como las tablas "maestro" de la base simulada.

export const DISCIPLINAS = [
  'Cardiología',
  'Cardiología Pediátrica',
  'Dermatología',
  'Endocrinología',
  'Fisioterapia',
  'Gastroenterología',
  'Geriatría',
  'Ginecología',
  'Lic. en Enfermería',
  'Medicina General',
  'Nefrología',
  'Neurología',
  'Nutrición',
  'Oftalmología',
  'Psicología',
  'Psiquiatría',
  'Reumatología',
  'Trabajo Social',
  'Traumatología',
  'Urología',
]

export const TECNICOS = [
  'BURGUEÑO FERNANDO',
  'TESTING SERGIO',
  'PEREZ MARIA',
  'GONZALEZ JUAN',
  'RODRIGUEZ LUCIA',
]

export const USUARIO_ACTUAL = 'BURGUEÑO FERNANDO'

export const DEPARTAMENTOS = [
  'Montevideo',
  'Canelones',
  'Artigas',
  'Salto',
  'Paysandú',
  'Rivera',
]

export const UNIDADES = [
  'CENTRO DEPARTAMENTAL ARTIGAS',
  'HOSPITAL DE ARTIGAS',
  'SANATORIO CAMS',
  'POLICLINICA SAN ANTONIO',
  'Unidad Asistencial 1',
  'Unidad Asistencial 2',
]

export const MODALIDADES = [
  { value: 'presencial', label: 'Presencial' },
  { value: 'teleconsulta', label: 'Teleconsulta' },
  { value: 'tele_sincronica', label: 'Teleinterconsulta/sincrónica' },
  { value: 'tele_asincronica', label: 'Teleinterconsulta/asincrónica' },
]

export const MODALIDAD_POR_VALOR = Object.fromEntries(
  MODALIDADES.map((modalidad) => [modalidad.value, modalidad]),
)

export const RESOLUCIONES = [
  { value: 'otra', label: 'Otra' },
  { value: 'propia', label: 'Propia' },
]

export const SEGUIMIENTOS = [
  { value: '10', label: '10 días' },
  { value: '30', label: '30 días' },
  { value: '60', label: '2 meses' },
  { value: '90', label: '3 meses' },
  { value: '180', label: '6 meses' },
  { value: '360', label: '12 meses' },
  { value: '720', label: '24 meses' },
]

export const MOTIVOS = [
  'Arritmia',
  'HTA no controlada',
  'Dolor torácico',
  'Insuficiencia cardíaca',
  'Seguimiento post IAM',
  'Valoración prequirúrgica',
  'Otro',
]

export const ESTADOS = [
  { value: 'pendiente', label: 'Pendiente de coordinar', icono: 'Reloj', modificador: 'pendiente' },
  { value: 'coordinada', label: 'Coordinada', icono: 'Favoritos', modificador: 'coordinada' },
  { value: 'cumplido', label: 'Cumplido', icono: 'Chequeado', modificador: 'cumplido' },
  { value: 'cancelado', label: 'Cancelado', icono: 'Cerrar_bold', modificador: 'cancelado' },
  { value: 'inasistencia', label: 'Inasistencia', icono: 'Advertencia', modificador: 'inasistencia' },
]

export const ESTADO_POR_VALOR = Object.fromEntries(
  ESTADOS.map((estado) => [estado.value, estado]),
)

export const OPCIONES_ESTADO = ESTADOS.map((estado) => ({
  value: estado.value,
  label: estado.label,
}))

export const ESTADOS_CI = [
  { value: 'pendiente', label: 'Pendiente de reunión' },
  { value: 'en_curso', label: 'En curso' },
  { value: 'cerrada', label: 'Cerrada' },
]

export const ESTADO_CI_POR_VALOR = Object.fromEntries(
  ESTADOS_CI.map((estado) => [estado.value, estado]),
)

// Estado individual de la orden de cada profesional convocado.
export const ESTADOS_ORDEN = [
  { value: 'pendiente', label: 'Pendiente' },
  { value: 'en_atencion', label: 'En atención' },
  { value: 'firmado', label: 'Firmado' },
]

export const ESTADO_ORDEN_POR_VALOR = Object.fromEntries(
  ESTADOS_ORDEN.map((estado) => [estado.value, estado]),
)

export const PRIORIDADES = [
  { value: 'baja', label: 'Baja' },
  { value: 'media', label: 'Media' },
  { value: 'alta', label: 'Alta' },
]

export const ROLES_EQUIPO = [
  'Referente',
  'Cotratante',
  'Coordinador',
  'Colaborador',
  'Observador',
]

// Disciplinas usadas por los equipos de trabajo (incluye los nombres cortos
// que aparecen en las capturas del documento v7).
export const DISCIPLINAS_EQUIPO = [
  'Ginecología',
  'Partería',
  'Obstetricia',
  'Medicina fam.',
  'Medicina General',
  'Pediatría',
  'S. Mental',
  'Psicología',
  'Psiquiatría',
  'T. Social',
  'Trabajo Social',
  'Nutrición',
  'Lic. en Enfermería',
  'Fisioterapia',
  'Cardiología',
  'Endocrinología',
  'Geriatría',
  'Neurología',
  'Traumatología',
]

export const OPCIONES_DISCIPLINA_EQUIPO = DISCIPLINAS_EQUIPO.map((disciplina) => ({
  value: disciplina,
  label: disciplina,
}))

export const OPCIONES_ROL_EQUIPO = ROLES_EQUIPO.map((rol) => ({ value: rol, label: rol }))

// Criterio de derivación (modal de la muestra de Interconsultas).
export const CRITERIOS = [
  'HTA No controlada',
  'HTA con refractariedad al tratamiento (3 fármacos)',
  'HTA severa Cifras > 160/100',
  'HTA Sospecha de HTA Secundaria',
  'HTA con lesión de órgano blanco. Cardiopatía isquémica con criterio clínico',
  'Alto riesgo de enfermedad CV',
  'Sincopes reiterados, dolor torácico atípico *, ECG patológico',
  'Arritmias Cardiacas',
  'HTA Pulmonar con diagnóstico confirmado para seguimiento y tratamiento',
  'Cardiooncología?',
  'Otras causas específicas',
]

// Severidad derivada de la cantidad de criterios seleccionados.
export function severidadCriterios(cantidad) {
  if (!cantidad) return { texto: 'Sin selección', clase: 'badge-none', color: '' }
  if (cantidad <= 1) return { texto: 'Baja', clase: 'badge-leve', color: 'status-baja' }
  if (cantidad <= 3) return { texto: 'Media', clase: 'badge-moderada', color: 'status-media' }
  return { texto: 'Alta', clase: 'badge-grave', color: 'status-alta' }
}
