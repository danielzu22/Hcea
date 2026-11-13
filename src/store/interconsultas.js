// Acciones sobre la tabla "interconsultas" de la base simulada.
import { actualizar, crearId } from './db.js'
import { USUARIO_ACTUAL } from '../data/catalogos.js'
import { hoyISO } from '../lib/fechas.js'

function conHistorial(registro, estado, nota) {
  return {
    ...registro,
    estado,
    actualizadaEn: new Date().toISOString(),
    historial: [
      ...(registro.historial ?? []),
      { fecha: new Date().toISOString(), estado, nota },
    ],
  }
}

// Alta de una o varias interconsultas en una sola transacción (el formulario
// de "AGREGAR INTERCONSULTA" permite guardar todas las especialidades juntas).
export function crearInterconsultas(nuevas) {
  if (!nuevas.length) return []
  const ahora = new Date().toISOString()
  let secuencia = null
  const ids = []

  actualizar((estado) => {
    let secuenciaLocal = estado.secuencia
    const registros = nuevas.map((nueva) => {
      const { id, secuencia: siguiente } = crearId(secuenciaLocal, 'interconsulta', 'ic')
      secuenciaLocal = siguiente
      ids.push(id)
      return {
        id,
        pacienteId: nueva.pacienteId ?? 'pac-1',
        especialidad: nueva.especialidad,
        tecnico: nueva.tecnico ?? USUARIO_ACTUAL,
        fechaSolicitud: nueva.fechaSolicitud ?? hoyISO(),
        fechaCoordinada: nueva.fechaCoordinada ?? null,
        estado: nueva.estado ?? 'pendiente',
        modalidad: nueva.modalidad ?? 'presencial',
        unidad: nueva.unidad ?? 'Sin asignar',
        depto: nueva.depto ?? '',
        ua: nueva.ua ?? '',
        tipoConsulta: nueva.tipoConsulta ?? '',
        seguimientoDias: nueva.seguimientoDias ?? '30',
        motivo: nueva.motivo ?? '',
        criterios: [...(nueva.criterios ?? [])],
        observaciones: nueva.observaciones ?? '',
        creadaEn: ahora,
        actualizadaEn: ahora,
        historial: [{ fecha: ahora, estado: nueva.estado ?? 'pendiente', nota: 'Solicitud creada' }],
      }
    })
    secuencia = secuenciaLocal
    return {
      ...estado,
      secuencia,
      interconsultas: [...registros, ...estado.interconsultas],
    }
  })

  return ids
}

export function actualizarInterconsulta(id, cambios, nota = 'Datos actualizados') {
  actualizar((estado) => ({
    ...estado,
    interconsultas: estado.interconsultas.map((registro) => {
      if (registro.id !== id) return registro
      const siguiente = { ...registro, ...cambios, actualizadaEn: new Date().toISOString() }
      if (cambios.estado && cambios.estado !== registro.estado) {
        return {
          ...siguiente,
          historial: [
            ...registro.historial,
            { fecha: new Date().toISOString(), estado: cambios.estado, nota },
          ],
        }
      }
      return siguiente
    }),
  }))
}

export function cambiarEstadoInterconsulta(id, nuevoEstado, nota) {
  actualizar((estado) => ({
    ...estado,
    interconsultas: estado.interconsultas.map((registro) =>
      registro.id === id
        ? conHistorial(registro, nuevoEstado, nota ?? `Estado cambiado a "${nuevoEstado}"`)
        : registro,
    ),
  }))
}

export function eliminarInterconsulta(id) {
  actualizar((estado) => ({
    ...estado,
    interconsultas: estado.interconsultas.filter((registro) => registro.id !== id),
  }))
}
