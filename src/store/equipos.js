// Acciones sobre la tabla "equipos" (grupos de especialistas personales del
// profesional convocante). No hay backend: se guardan en localStorage.
import { actualizar, crearId } from './db.js'
import { USUARIO_ACTUAL } from '../data/catalogos.js'

function normalizarIntegrantes(integrantes, secuencia) {
  let secuenciaLocal = secuencia
  const resultado = integrantes
    .filter((integrante) => integrante.disciplina)
    .map((integrante) => {
      // Si el integrante ya existe conserva su id; los nuevos uno generado.
      if (integrante.id) {
        return {
          id: integrante.id,
          nombre: integrante.nombre ?? '',
          disciplina: integrante.disciplina,
        }
      }
      const generado = crearId(secuenciaLocal, 'equipoIntegrante', 'eqi')
      secuenciaLocal = generado.secuencia
      return {
        id: generado.id,
        nombre: integrante.nombre ?? '',
        disciplina: integrante.disciplina,
      }
    })
  return { integrantes: resultado, secuencia: secuenciaLocal }
}

export function crearEquipo(datos) {
  let id = null

  actualizar((estado) => {
    const generado = crearId(estado.secuencia, 'equipo', 'eq')
    id = generado.id
    const { integrantes, secuencia } = normalizarIntegrantes(
      datos.integrantes ?? [],
      generado.secuencia,
    )
    const ahora = new Date().toISOString()

    return {
      ...estado,
      secuencia,
      equipos: [
        ...estado.equipos,
        {
          id,
          propietario: USUARIO_ACTUAL,
          nombre: datos.nombre?.trim() ?? '',
          integrantes,
          creadoEn: ahora,
          actualizadoEn: ahora,
        },
      ],
    }
  })

  return id
}

export function actualizarEquipo(id, datos) {
  actualizar((estado) => {
    const equipo = estado.equipos.find((item) => item.id === id)
    if (!equipo) return estado

    const { integrantes, secuencia } = normalizarIntegrantes(
      datos.integrantes ?? equipo.integrantes,
      estado.secuencia,
    )

    return {
      ...estado,
      secuencia,
      equipos: estado.equipos.map((item) =>
        item.id === id
          ? {
              ...item,
              nombre: datos.nombre?.trim() ?? item.nombre,
              integrantes,
              actualizadoEn: new Date().toISOString(),
            }
          : item,
      ),
    }
  })
}

export function eliminarEquipo(id) {
  actualizar((estado) => ({
    ...estado,
    equipos: estado.equipos.filter((equipo) => equipo.id !== id),
  }))
}

// Agrega un integrante (lo usan las filas expandibles de la tabla de equipos)
export function agregarIntegranteEquipo(equipoId, integrante) {
  if (!integrante?.disciplina) return

  actualizar((estado) => {
    const generado = crearId(estado.secuencia, 'equipoIntegrante', 'eqi')
    return {
      ...estado,
      secuencia: generado.secuencia,
      equipos: estado.equipos.map((equipo) =>
        equipo.id === equipoId
          ? {
              ...equipo,
              integrantes: [
                ...equipo.integrantes,
                {
                  id: generado.id,
                  nombre: integrante.nombre?.trim() ?? '',
                  disciplina: integrante.disciplina,
                },
              ],
              actualizadoEn: new Date().toISOString(),
            }
          : equipo,
      ),
    }
  })
}

export function eliminarIntegranteEquipo(equipoId, integranteId) {
  actualizar((estado) => ({
    ...estado,
    equipos: estado.equipos.map((equipo) =>
      equipo.id === equipoId
        ? {
            ...equipo,
            integrantes: equipo.integrantes.filter((integrante) => integrante.id !== integranteId),
            actualizadoEn: new Date().toISOString(),
          }
        : equipo,
    ),
  }))
}
