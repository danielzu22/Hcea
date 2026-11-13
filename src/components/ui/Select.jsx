import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'

const ALTO_OPCION = 34
const ALTO_MAXIMO = 260

// Reemplazo React del <select> nativo que armaba funciones.js:
// mismo markup (.custom-select) para conservar los estilos.
// La lista se abre hacia arriba o hacia abajo según el espacio disponible, y
// dentro de un modal con scroll la lista se recorta a ese espacio (nunca queda
// tapada por el contenedor).
export default function Select({
  valor,
  opciones,
  onChange,
  onAbrir,
  placeholder = 'Seleccionar...',
  ariaLabel,
  className = '',
}) {
  const [abierto, setAbierto] = useState(false)
  const contenedor = useRef(null)
  const listaRef = useRef(null)
  const [posicion, setPosicion] = useState({ arriba: false, altoMax: ALTO_MAXIMO })
  const seleccionada = opciones.find((opcion) => opcion.value === valor)

  // Avisa al contenedor cuando la lista se abre (lo usa el popup de integrantes
  // para cerrar sus propias sugerencias).
  const onAbiertoLocal = onAbrir ?? (() => {})

  // Devuelve el contenedor con scroll más cercano (por ejemplo el cuerpo de un modal).
  const contenedorDesplazable = useCallback(() => {
    let elemento = contenedor.current?.parentElement
    while (elemento && elemento !== document.body) {
      const estilo = window.getComputedStyle(elemento)
      const desborda = /(auto|scroll)/.test(estilo.overflowY)
      if (desborda && elemento.scrollHeight > elemento.clientHeight) return elemento
      elemento = elemento.parentElement
    }
    return null
  }, [])

  const calcularPosicion = useCallback(() => {
    const trigger = contenedor.current?.querySelector('.custom-select__trigger')
    if (!trigger) return

    const rect = trigger.getBoundingClientRect()
    const limite = contenedorDesplazable()?.getBoundingClientRect()
    const margen = 8

    const abajoTop = rect.bottom
    const arribaBottom = rect.top

    const espacioAbajo = Math.min(
      limite ? limite.bottom - margen : window.innerHeight - margen,
      window.innerHeight - margen,
    ) - abajoTop
    const espacioArriba = arribaBottom - Math.max(limite ? limite.top + margen : margen, margen)

    const arriba = espacioAbajo < 140 && espacioArriba > espacioAbajo
    const disponible = Math.max(arriba ? espacioArriba : espacioAbajo, 0)
    const altoMax = Math.min(Math.max(disponible, ALTO_OPCION * 3), ALTO_MAXIMO)

    setPosicion({ arriba, altoMax })
  }, [contenedorDesplazable])

  useLayoutEffect(() => {
    if (!abierto) return
    calcularPosicion()
  }, [abierto, calcularPosicion])

  // Al hacer scroll o cambiar el tamaño, se recalcula o se cierra (si la lista
  // quedó fuera de la ventana visible).
  useEffect(() => {
    if (!abierto) return undefined

    const alDesplazar = (evento) => {
      const lista = listaRef.current
      if (!lista) return
      const rect = lista.getBoundingClientRect()
      const modal = lista.closest('.modal-criterios')
      if (modal) {
        const modalRect = modal.getBoundingClientRect()
        if (rect.bottom < modalRect.top || rect.top > modalRect.bottom) setAbierto(false)
      }
      const scroll = evento.target === document ? null : evento.target
      if (scroll && scroll.contains && scroll.contains(contenedor.current)) setAbierto(false)
    }

    const alRedimensionar = () => calcularPosicion()

    document.addEventListener('scroll', alDesplazar, true)
    window.addEventListener('resize', alRedimensionar)

    return () => {
      document.removeEventListener('scroll', alDesplazar, true)
      window.removeEventListener('resize', alRedimensionar)
    }
  }, [abierto, calcularPosicion])

  useEffect(() => {
    if (!abierto) return undefined

    const alTocarFuera = (evento) => {
      if (contenedor.current && !contenedor.current.contains(evento.target)) {
        setAbierto(false)
      }
    }
    const alPresionarTecla = (evento) => {
      if (evento.key === 'Escape') setAbierto(false)
    }

    document.addEventListener('mousedown', alTocarFuera)
    document.addEventListener('keydown', alPresionarTecla)
    return () => {
      document.removeEventListener('mousedown', alTocarFuera)
      document.removeEventListener('keydown', alPresionarTecla)
    }
  }, [abierto])

  const estiloLista = {
    maxHeight: `${posicion.altoMax}px`,
    overflowY: 'auto',
  }

  return (
    <div ref={contenedor} className={`custom-select-wrapper ${className}`}>
      <div
        className={`custom-select ${abierto ? 'open' : ''} ${abierto && posicion.arriba ? 'custom-select--arriba' : ''}`}
      >
        <button
          type="button"
          className="custom-select__trigger"
          aria-haspopup="listbox"
          aria-expanded={abierto}
          aria-label={ariaLabel}
          onClick={() => {
            const siguiente = !abierto
            setAbierto(siguiente)
            if (siguiente) onAbiertoLocal()
          }}
        >
          <span>{seleccionada ? seleccionada.label : placeholder}</span>
          <span className={`arrow ${posicion.arriba && abierto ? 'arrow--arriba' : ''}`} aria-hidden="true" />
        </button>

        <div
          ref={listaRef}
          className="custom-select__options"
          role="listbox"
          aria-label={ariaLabel}
          style={estiloLista}
        >
          {opciones.map((opcion) => (
            <button
              type="button"
              role="option"
              aria-selected={opcion.value === valor}
              key={opcion.value}
              className={`custom-select__option ${opcion.value === valor ? 'selected' : ''}`}
              onClick={() => {
                onChange(opcion.value)
                setAbierto(false)
              }}
            >
              {opcion.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
