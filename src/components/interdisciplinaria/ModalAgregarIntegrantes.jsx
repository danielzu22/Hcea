import { useEffect, useMemo, useRef, useState } from 'react'
import { UserRoundPlus } from 'lucide-react'
import Modal from '../ui/Modal.jsx'
import Select from '../ui/Select.jsx'
import Icon from '../ui/Icon.jsx'
import { PROFESIONALES } from '../../data/profesionales.js'

// Normaliza texto para comparar sin acentos ni mayúsculas.
function normalizar(texto) {
  return texto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
}

const OPCIONES_DISCIPLINA = [
  { value: '', label: 'Todas las disciplinas' },
  ...Array.from(new Set(PROFESIONALES.map((profesional) => profesional.especialidad)))
    .sort((a, b) => a.localeCompare(b, 'es'))
    .map((disciplina) => ({ value: disciplina, label: disciplina })),
]

const claveProfesional = (profesional) => `${profesional.nombre}|${profesional.especialidad}`

// Popup para agregar integrantes. Funciona como "selector + confirmación":
// buscar/clickear una sugerencia la suma a una lista pendiente, donde se puede
// quitar; recién "Agregar" confirma y pasa los integrantes al equipo.
export default function ModalAgregarIntegrantes({ equipo, onConfirmar, onCerrar }) {
  const [texto, setTexto] = useState('')
  const [disciplina, setDisciplina] = useState('')
  const [abierto, setAbierto] = useState(false)
  const [pendientes, setPendientes] = useState([])
  const contenedor = useRef(null)

  const yaEnEquipo = useMemo(
    () =>
      new Set(
        equipo.integrantes.map((integrante) => `${integrante.nombre}|${integrante.disciplina}`),
      ),
    [equipo.integrantes],
  )

  const yaPendiente = useMemo(
    () => new Set(pendientes.map(claveProfesional)),
    [pendientes],
  )

  const coincidencias = useMemo(() => {
    const consulta = normalizar(texto.trim())
    if (!consulta && !disciplina) return []
    return PROFESIONALES.filter((profesional) => {
      if (disciplina && profesional.especialidad !== disciplina) return false
      if (!consulta) return true
      return normalizar(`${profesional.nombre} ${profesional.especialidad}`).includes(consulta)
    }).slice(0, 8)
  }, [texto, disciplina])

  const mostrarLista = abierto && coincidencias.length > 0

  useEffect(() => {
    if (!abierto) return undefined

    const alTocarFuera = (evento) => {
      if (contenedor.current && !contenedor.current.contains(evento.target)) {
        setAbierto(false)
      }
    }

    document.addEventListener('mousedown', alTocarFuera)
    return () => document.removeEventListener('mousedown', alTocarFuera)
  }, [abierto])

  const limpiar = () => {
    setTexto('')
    setAbierto(false)
  }

  const seleccionar = (profesional) => {
    const clave = claveProfesional(profesional)
    if (yaEnEquipo.has(clave) || yaPendiente.has(clave)) return
    setPendientes((previos) => [
      ...previos,
      { nombre: profesional.nombre, disciplina: profesional.especialidad },
    ])
    limpiar()
  }

  const quitarPendiente = (indice) => {
    setPendientes((previos) => previos.filter((_, posicion) => posicion !== indice))
  }

  const confirmar = () => {
    onConfirmar(pendientes)
    setPendientes([])
    onCerrar()
  }

  return (
    <Modal
      abierto
      onCerrar={onCerrar}
      ariaLabel="Agregar integrantes"
      className="modal-criterios modal-criterios--integrante"
    >
      <div className="modal-criterios__header">
        <div className="modal-criterios__title">
          <span className="modal-criterios__title-icono" aria-hidden="true">
            <UserRoundPlus size={24} strokeWidth={2} />
          </span>
          <span>Agregar integrantes</span>
        </div>
        <button type="button" className="modal-criterios__close" aria-label="Cerrar" onClick={onCerrar}>
          <Icon nombre="Cerrar_bold" alt="Cerrar" />
        </button>
      </div>

      <div className="modal-criterios__body">
        <p className="text-muted" style={{ fontSize: '1.2rem', marginBottom: '1.4rem' }}>
          Equipo «{equipo.nombre}» · buscá y elegí profesionales; después confirmá con «Agregar».
        </p>

        <div className="buscador-integrantes">
          <div
            ref={contenedor}
            className={`add-interconsulta__search buscador-integrantes__campo ${mostrarLista ? 'open' : ''}`}
          >
            <div className="add-interconsulta__input-wrapper">
              <Icon
                nombre="Lupa"
                alt="Buscar"
                className="add-interconsulta__input-icon add-interconsulta__input-icon--left"
              />
              <input
                type="text"
                className="add-interconsulta__input"
                placeholder="Buscar por nombre, apellido o disciplina..."
                value={texto}
                autoComplete="off"
                autoFocus
                role="combobox"
                aria-expanded={mostrarLista}
                aria-controls="sugerencias-integrantes"
                aria-label="Buscar profesional"
                onChange={(evento) => {
                  setTexto(evento.target.value)
                  setAbierto(true)
                }}
                onFocus={() => setAbierto(true)}
              />
              {texto ? (
                <button
                  type="button"
                  className="add-interconsulta__clear"
                  aria-label="Borrar búsqueda"
                  onClick={limpiar}
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
              <div
                className="add-interconsulta__dropdown"
                id="sugerencias-integrantes"
                role="listbox"
              >
                {coincidencias.map((profesional) => {
                  const clave = claveProfesional(profesional)
                  const enEquipo = yaEnEquipo.has(clave)
                  const enLista = yaPendiente.has(clave)
                  return (
                    <div
                      key={profesional.id}
                      className={`add-interconsulta__dropdown-item ${enEquipo || enLista ? 'is-disabled' : ''}`}
                      role="option"
                      aria-selected={enEquipo || enLista}
                      aria-disabled={enEquipo || enLista}
                      tabIndex={enEquipo || enLista ? -1 : 0}
                      onMouseDown={(evento) => evento.preventDefault()}
                      onClick={() => {
                        if (!enEquipo && !enLista) seleccionar(profesional)
                      }}
                      onKeyDown={(evento) => {
                        if (evento.key === 'Enter' && !enEquipo && !enLista) {
                          seleccionar(profesional)
                        }
                      }}
                    >
                      {profesional.nombre}
                      <span className="add-interconsulta__dropdown-detalle">
                        {enEquipo ? 'Ya en el equipo' : enLista ? 'En la lista' : profesional.especialidad}
                      </span>
                    </div>
                  )
                })}
              </div>
            ) : null}
          </div>

          <div className="buscador-integrantes__filtro">
            <Select
              ariaLabel="Filtrar por disciplina"
              valor={disciplina}
              opciones={OPCIONES_DISCIPLINA}
              onAbrir={() => setAbierto(false)}
              onChange={(valor) => {
                setDisciplina(valor)
                setAbierto(true)
              }}
            />
          </div>
        </div>

        {abierto && coincidencias.length === 0 && (texto.trim() || disciplina) ? (
          <p className="text-muted" style={{ fontSize: '1.2rem', marginTop: '0.8rem' }}>
            No hay profesionales que coincidan.
          </p>
        ) : null}

        <div className="seleccion-integrantes">
          <h3 className="fila-detalle__titulo">
            Para agregar ({pendientes.length})
          </h3>

          {pendientes.length === 0 ? (
            <p className="seleccion-integrantes__vacio">
              Los profesionales que elijas arriba aparecen acá, y podés quitarlos antes de
              confirmar.
            </p>
          ) : (
            <table className="data-table tabla-detalle">
              <thead>
                <tr>
                  <th>NOMBRE Y APELLIDO</th>
                  <th>DISCIPLINA</th>
                  <th>ACCIÓN</th>
                </tr>
              </thead>
              <tbody>
                {pendientes.map((persona, indice) => (
                  <tr key={`${persona.nombre}-${persona.disciplina}`}>
                    <td>{persona.nombre}</td>
                    <td>{persona.disciplina}</td>
                    <td>
                      <button
                        type="button"
                        className="action-btn"
                        title="Quitar de la lista"
                        aria-label={`Quitar a ${persona.nombre} de la lista`}
                        onClick={() => quitarPendiente(indice)}
                      >
                        <Icon nombre="Papelera" alt="Quitar" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <div className="modal-criterios__footer">
        <span className="text-muted" style={{ fontSize: '1.2rem' }}>
          {equipo.integrantes.length} integrante{equipo.integrantes.length === 1 ? '' : 's'} en el equipo
        </span>
        <div className="modal-criterios__actions">
          <button
            type="button"
            className="modal-criterios__btn modal-criterios__btn--cancel"
            onClick={onCerrar}
          >
            Cancelar
          </button>
          <button
            type="button"
            className="modal-criterios__btn modal-criterios__btn--confirm"
            disabled={pendientes.length === 0}
            onClick={confirmar}
          >
            Agregar{pendientes.length > 0 ? ` (${pendientes.length})` : ''}
          </button>
        </div>
      </div>
    </Modal>
  )
}
