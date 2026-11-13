import { estadoInicial } from '../data/seed.js'

// Estados guardados con una versión anterior de la base simulada se migran
// a la versión actual. "equipos" y "consultas" cambiaron de forma (asignación
// de equipo, firmas por participante), así que se re-siembran; el resto se
// conserva si ya existía.
export function migrarEstado(datos) {
  if (!datos || typeof datos !== 'object') return null

  const base = estadoInicial()

  return {
    ...base,
    guardadoEn: datos.guardadoEn ?? null,
    usuario: datos.usuario ?? base.usuario,
    // Tablas que cambiaron de estructura: se re-siembran.
    equipos: base.equipos,
    consultas: base.consultas,
    // La secuencia queda coherente con lo re-sembrado; se conserva sólo la de
    // interconsultas para no pisar ids de esa muestra.
    secuencia: {
      ...base.secuencia,
      interconsulta: datos.secuencia?.interconsulta ?? base.secuencia.interconsulta,
    },
    pacientes: Array.isArray(datos.pacientes) ? datos.pacientes : base.pacientes,
    interconsultas: Array.isArray(datos.interconsultas) ? datos.interconsultas : base.interconsultas,
  }
}
