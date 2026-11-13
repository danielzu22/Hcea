// Acciones sobre la tabla "consultas" (Consulta Interdisciplinaria).
import { actualizar, crearId } from './db.js'
import { USUARIO_ACTUAL } from '../data/catalogos.js'
import { hoyISO } from '../lib/fechas.js'

export function crearConsulta(datos) {
  let id = null

  actualizar((estado) => {
    const generado = crearId(estado.secuencia, 'consulta', 'ci')
    id = generado.id
    const ahora = new Date().toISOString()
    return {
      ...estado,
      secuencia: generado.secuencia,
      consultas: [
        {
          id,
          pacienteId: datos.pacienteId ?? 'pac-1',
          motivo: datos.motivo?.trim() ?? '',
          disciplinas: [...(datos.disciplinas ?? [])],
          coordinador: datos.coordinador ?? USUARIO_ACTUAL,
          fechaReunion: datos.fechaReunion || hoyISO(),
          prioridad: datos.prioridad ?? 'media',
          estado: 'pendiente',
          observaciones: datos.observaciones?.trim() ?? '',
          participantes: [],
          acuerdos: [],
          creadaEn: ahora,
          actualizadaEn: ahora,
        },
        ...estado.consultas,
      ],
    }
  })

  return id
}

export function actualizarConsulta(id, cambios) {
  actualizar((estado) => ({
    ...estado,
    consultas: estado.consultas.map((consulta) =>
      consulta.id === id
        ? { ...consulta, ...cambios, actualizadaEn: new Date().toISOString() }
        : consulta,
    ),
  }))
}

export function eliminarConsulta(id) {
  actualizar((estado) => ({
    ...estado,
    consultas: estado.consultas.filter((consulta) => consulta.id !== id),
  }))
}

export function agregarParticipante(consultaId, participante) {
  actualizar((estado) => {
    const generado = crearId(estado.secuencia, 'participante', 'cp')
    return {
      ...estado,
      secuencia: generado.secuencia,
      consultas: estado.consultas.map((consulta) =>
        consulta.id === consultaId
          ? {
              ...consulta,
              actualizadaEn: new Date().toISOString(),
              participantes: [
                ...consulta.participantes,
                {
                  id: generado.id,
                  nombre: participante.nombre?.trim() ?? '',
                  disciplina: participante.disciplina ?? '',
                  rol: participante.rol ?? 'Colaborador',
                },
              ],
            }
          : consulta,
      ),
    }
  })
}

export function eliminarParticipante(consultaId, participanteId) {
  actualizar((estado) => ({
    ...estado,
    consultas: estado.consultas.map((consulta) =>
      consulta.id === consultaId
        ? {
            ...consulta,
            actualizadaEn: new Date().toISOString(),
            participantes: consulta.participantes.filter(
              (participante) => participante.id !== participanteId,
            ),
          }
        : consulta,
    ),
  }))
}

export function agregarAcuerdo(consultaId, texto) {
  const limpio = texto?.trim()
  if (!limpio) return

  actualizar((estado) => {
    const generado = crearId(estado.secuencia, 'acuerdo', 'ac')
    return {
      ...estado,
      secuencia: generado.secuencia,
      consultas: estado.consultas.map((consulta) =>
        consulta.id === consultaId
          ? {
              ...consulta,
              actualizadaEn: new Date().toISOString(),
              acuerdos: [
                ...consulta.acuerdos,
                {
                  id: generado.id,
                  texto: limpio,
                  autor: USUARIO_ACTUAL,
                  fecha: new Date().toISOString(),
                },
              ],
            }
          : consulta,
      ),
    }
  })
}

export function eliminarAcuerdo(consultaId, acuerdoId) {
  actualizar((estado) => ({
    ...estado,
    consultas: estado.consultas.map((consulta) =>
      consulta.id === consultaId
        ? {
            ...consulta,
            actualizadaEn: new Date().toISOString(),
            acuerdos: consulta.acuerdos.filter((acuerdo) => acuerdo.id !== acuerdoId),
          }
        : consulta,
    ),
  }))
}
