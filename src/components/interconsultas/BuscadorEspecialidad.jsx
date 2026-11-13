import { useEffect, useMemo, useRef, useState } from 'react'
import Icon from '../ui/Icon.jsx'
import { DISCIPLINAS } from '../../data/catalogos.js'

// Buscador con autocompletado del alta de interconsultas. Replica el
// comportamiento de initAutocomplete() de funciones.js.
export default function BuscadorEspecialidad({
  valor,
  onCambiar,
  onSeleccionar,
  onLimpiar,
  onEnter,
}) {
  const [abierto, setAbierto] = useState(false)
  const contenedor = useRef(null)

  const coincidencias = useMemo(() => {
    const texto = valor.trim().toLowerCase()
    if (!texto) return []
    return DISCIPLINAS.filter((disciplina) => disciplina.toLowerCase().includes(texto)).slice(0, 8)
  }, [valor])

  useEffect(() => {
    if (!abierto) return undefined

    const alTocarFuera = (evento) => {
      if (contenedor.current && !contenedor.current.contains(evento.target)) setAbierto(false)
    }

    document.addEventListener('mousedown', alTocarFuera)
    return () => document.removeEventListener('mousedown', alTocarFuera)
  }, [abierto])

  const mostrarLista = abierto && coincidencias.length > 0

  return (
    <div
      ref={contenedor}
      className={`add-interconsulta__search ${mostrarLista ? 'open' : ''}`}
      id="interconsulta-search-container"
    >
      <div className="add-interconsulta__input-wrapper">
        <Icon
          nombre="Lupa"
          alt="Buscar"
          className="add-interconsulta__input-icon add-interconsulta__input-icon--left"
        />
        <input
          id="interconsulta-input"
          type="text"
          className="add-interconsulta__input"
          placeholder="Buscar especialidad..."
          value={valor}
          autoComplete="off"
          role="combobox"
          aria-expanded={mostrarLista}
          aria-controls="interconsulta-dropdown"
          onChange={(evento) => {
            onCambiar(evento.target.value)
            setAbierto(true)
          }}
          onFocus={() => setAbierto(true)}
          onKeyDown={(evento) => {
            if (evento.key === 'Enter') {
              evento.preventDefault()
              if (onEnter) onEnter()
            }
          }}
        />
        {valor ? (
          <button
            type="button"
            className="add-interconsulta__clear"
            id="interconsulta-clear"
            aria-label="Borrar búsqueda"
            onClick={() => {
              onLimpiar()
              setAbierto(false)
            }}
          >
            <Icon
              nombre="Circulo-cerrar"
              alt="Borrar"
              className="add-interconsulta__input-icon add-interconsulta__input-icon--right"
            />
          </button>
        ) : null}
      </div>

      {mostrarLista ? (
        <div className="add-interconsulta__dropdown" id="interconsulta-dropdown" role="listbox">
          {coincidencias.map((disciplina) => (
            <div
              key={disciplina}
              className="add-interconsulta__dropdown-item"
              role="option"
              aria-selected="false"
              tabIndex={0}
              onMouseDown={(evento) => evento.preventDefault()}
              onClick={() => {
                onSeleccionar(disciplina)
                setAbierto(false)
              }}
              onKeyDown={(evento) => {
                if (evento.key === 'Enter') {
                  onSeleccionar(disciplina)
                  setAbierto(false)
                }
              }}
            >
              {disciplina}
            </div>
          ))}
        </div>
      ) : null}
    </div>
  )
}
