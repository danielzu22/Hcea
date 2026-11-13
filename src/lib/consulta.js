// Cálculos derivados de una consulta interdisciplinaria: estado de cada
// participante y estado general de la consulta (regla del v7).

export const ESTADO_PARTICIPANTE = {
  pendiente: { label: 'Pendiente', modificador: 'pendiente' },
  en_atencion: { label: 'En atención', modificador: 'en_atencion' },
  firmado: { label: 'Firmado', modificador: 'firmado' },
}

export const ESTADO_CONSULTA = {
  pendiente: { label: 'Pendiente' },
  en_curso: { label: 'En curso' },
  finalizada: { label: 'Finalizada' },
}

export function estadoParticipante(participante) {
  return ESTADO_PARTICIPANTE[participante?.estado] ?? ESTADO_PARTICIPANTE.pendiente
}

// Pendiente: nadie inició. En curso: alguien inició o firmó, pero no todos.
// Finalizada: todos firmaron.
export function estadoGeneral(consulta) {
  const participantes = consulta?.participantes ?? []
  if (participantes.length === 0) return 'pendiente'
  if (participantes.every((p) => p.estado === 'firmado')) return 'finalizada'
  if (participantes.every((p) => p.estado === 'pendiente')) return 'pendiente'
  return 'en_curso'
}

export function contarFirmados(consulta) {
  return (consulta?.participantes ?? []).filter((p) => p.estado === 'firmado').length
}

export function tieneEquipo(consulta) {
  return (consulta?.participantes ?? []).length > 0
}
