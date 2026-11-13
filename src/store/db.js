// Motor de la base de datos simulada.
//
// No hay backend: el estado vive en memoria y se persiste en localStorage
// (mismo espíritu que los stores de itc.cortex.demo, con persistencia extra
// para que la maqueta sobreviva a un refresh). Todos los componentes leen con
// `usarDb()`; las acciones viven en ./interconsultas.js y ./interdisciplinaria.js.
import { useSyncExternalStore } from 'react'
import { VERSION_DB, estadoInicial } from '../data/seed.js'
import { migrarEstado } from './migracion.js'

const CLAVE = 'hcea.demo.v1'

function clonar(valor) {
  if (typeof structuredClone === 'function') return structuredClone(valor)
  return JSON.parse(JSON.stringify(valor))
}

function esEstadoValido(datos) {
  return (
    datos &&
    datos.version === VERSION_DB &&
    Array.isArray(datos.interconsultas) &&
    Array.isArray(datos.consultas) &&
    Array.isArray(datos.pacientes) &&
    Array.isArray(datos.equipos) &&
    datos.secuencia &&
    typeof datos.secuencia === 'object'
  )
}

// Un estado de una versión anterior se migra en lugar de descartarse, así
// las pruebas y los datos cargados no se pierden al cambiar las semillas.
function leerGuardado() {
  try {
    const crudo = window.localStorage.getItem(CLAVE)
    if (!crudo) return null
    const datos = JSON.parse(crudo)
    // Un estado de una versión anterior se migra en vez de descartarse.
    if (datos && typeof datos.version === 'number' && datos.version < VERSION_DB) {
      return migrarEstado(datos)
    }
    return esEstadoValido(datos) ? datos : null
  } catch {
    return null
  }
}

let estado = leerGuardado() ?? clonar(estadoInicial())

// Deja constancia de la versión actual al arrancar.
persistir()

// Permite que pruebas o herramientas externas carguen un estado conocido.
export function definirEstado(nuevoEstado) {
  if (!nuevoEstado) return
  estado = { ...clonar(nuevoEstado), guardadoEn: new Date().toISOString() }
  persistir()
  emitir()
}

const suscriptores = new Set()
const emitir = () => suscriptores.forEach((suscriptor) => suscriptor())

function persistir() {
  try {
    window.localStorage.setItem(CLAVE, JSON.stringify(estado))
  } catch {
    // Modo privado o cuota llena: la maqueta sigue funcionando en memoria.
  }
}

export function suscribir(suscriptor) {
  suscriptores.add(suscriptor)
  return () => suscriptores.delete(suscriptor)
}

export const obtenerEstado = () => estado

export function usarDb() {
  return useSyncExternalStore(suscribir, obtenerEstado)
}

// Único punto de escritura: recibe el estado actual y devuelve el siguiente.
export function actualizar(transformar) {
  const siguiente = transformar(estado)
  if (!siguiente || siguiente === estado) return
  estado = { ...siguiente, guardadoEn: new Date().toISOString() }
  persistir()
  emitir()
}

// Sincroniza entre pestañas abiertas.
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (evento) => {
    if (evento.key !== CLAVE || !evento.newValue) return
    try {
      const datos = JSON.parse(evento.newValue)
      if (!esEstadoValido(datos)) return
      estado = datos
      emitir()
    } catch {
      // Ignorar escrituras externas inválidas.
    }
  })
}

// Utilidad interna para las acciones: genera ids legibles por tabla sin
// mutar el estado (la secuencia se propaga en el objeto que devuelve).
export function crearId(secuencia, tabla, prefijo) {
  const numero = (secuencia[tabla] ?? 0) + 1
  return { id: `${prefijo}-${numero}`, secuencia: { ...secuencia, [tabla]: numero } }
}
