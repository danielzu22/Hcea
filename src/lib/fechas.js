// Utilidades de fecha. Las fechas de negocio son strings ISO "YYYY-MM-DD"
// y se formatean a mano para no correrse un día por zona horaria.

export function hoyISO() {
  const ahora = new Date()
  const desfase = ahora.getTimezoneOffset()
  return new Date(ahora.getTime() - desfase * 60 * 1000).toISOString().slice(0, 10)
}

function partes(iso) {
  if (!iso) return null
  const [anio, mes, dia] = String(iso).slice(0, 10).split('-')
  if (!anio || !mes || !dia) return null
  return { anio, mes, dia }
}

export function fechaCorta(iso) {
  const valor = partes(iso)
  if (!valor) return '//'
  return `${valor.dia}/${valor.mes}/${valor.anio.slice(2)}`
}

export function fechaDiaMes(iso) {
  const valor = partes(iso)
  if (!valor) return '//'
  return `${valor.dia}/${valor.mes}`
}

export function fechaLarga(iso) {
  const valor = partes(iso)
  if (!valor) return '//'
  return `${valor.dia}/${valor.mes}/${valor.anio}`
}

export function fechaHora(iso) {
  if (!iso) return '//'
  const fecha = new Date(iso)
  if (Number.isNaN(fecha.getTime())) return '//'
  return new Intl.DateTimeFormat('es-UY', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(fecha)
}

export function diasDesde(iso) {
  const valor = partes(iso)
  if (!valor) return Number.POSITIVE_INFINITY
  const objetivo = new Date(Number(valor.anio), Number(valor.mes) - 1, Number(valor.dia))
  const ahora = new Date()
  const base = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate())
  return Math.round((base.getTime() - objetivo.getTime()) / 86_400_000)
}

export function hoyLarga() {
  return new Intl.DateTimeFormat('es-UY', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date())
}
