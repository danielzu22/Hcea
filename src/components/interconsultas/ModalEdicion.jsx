import { useState } from 'react'
import Icon from '../ui/Icon.jsx'
import Modal from '../ui/Modal.jsx'
import Select from '../ui/Select.jsx'
import CriteriosGrid from '../ui/CriteriosGrid.jsx'
import {
  CRITERIOS,
  MODALIDADES,
  OPCIONES_ESTADO,
  severidadCriterios,
} from '../../data/catalogos.js'
import { fechaLarga } from '../../lib/fechas.js'

// Edición de una interconsulta ya existente: estado, modalidad, fecha
// coordinada, unidad, observaciones y criterios de derivación.
export default function ModalEdicion({ registro, onGuardar, onCerrar }) {
  const [campos, setCampos] = useState({
    estado: registro.estado,
    modalidad: registro.modalidad,
    fechaCoordinada: registro.fechaCoordinada ?? '',
    unidad: registro.unidad ?? '',
    observaciones: registro.observaciones ?? '',
  })
  const [criterios, setCriterios] = useState([...(registro.criterios ?? [])])

  const cambiar = (campo, valor) => setCampos((previo) => ({ ...previo, [campo]: valor }))

  const alternarCriterio = (indice) =>
    setCriterios((previo) =>
      previo.includes(indice)
        ? previo.filter((valor) => valor !== indice)
        : [...previo, indice].sort((a, b) => a - b),
    )

  const severidad = severidadCriterios(criterios.length)

  return (
    <Modal abierto onCerrar={onCerrar} ariaLabel="Editar interconsulta">
      <div className="modal-criterios__header">
        <div className="modal-criterios__title">
          <Icon nombre="Lapiz" alt="" className="modal-criterios__title-icon" />
          <span>Editar interconsulta</span>
        </div>
        <button type="button" className="modal-criterios__close" aria-label="Cerrar" onClick={onCerrar}>
          <Icon nombre="Cerrar_bold" alt="Cerrar" />
        </button>
      </div>

      <div className="modal-criterios__body">
        <div className="ci-summary" style={{ marginBottom: '2rem' }}>
          <div>
            <div className="ci-summary__label">Especialidad</div>
            <div className="ci-summary__value">{registro.especialidad}</div>
          </div>
          <div>
            <div className="ci-summary__label">Técnico</div>
            <div className="ci-summary__value">{registro.tecnico}</div>
          </div>
          <div>
            <div className="ci-summary__label">Fecha solicitud</div>
            <div className="ci-summary__value">{fechaLarga(registro.fechaSolicitud)}</div>
          </div>
        </div>

        <div className="form-grid">
          <div className="form-field">
            <label>Estado</label>
            <Select
              ariaLabel="Estado"
              valor={campos.estado}
              opciones={OPCIONES_ESTADO}
              onChange={(valor) => cambiar('estado', valor)}
            />
          </div>

          <div className="form-field">
            <label>Modalidad</label>
            <Select
              ariaLabel="Modalidad"
              valor={campos.modalidad}
              opciones={MODALIDADES}
              onChange={(valor) => cambiar('modalidad', valor)}
            />
          </div>

          <div className="form-field">
            <label htmlFor="edicion-fecha-coordinada">Fecha coordinada</label>
            <input
              id="edicion-fecha-coordinada"
              type="date"
              value={campos.fechaCoordinada}
              onChange={(evento) => cambiar('fechaCoordinada', evento.target.value)}
            />
          </div>

          <div className="form-field">
            <label htmlFor="edicion-unidad">Unidad que resuelve</label>
            <input
              id="edicion-unidad"
              type="text"
              value={campos.unidad}
              onChange={(evento) => cambiar('unidad', evento.target.value)}
            />
          </div>

          <div className="form-field form-grid__full">
            <label htmlFor="edicion-observaciones">Observaciones</label>
            <textarea
              id="edicion-observaciones"
              value={campos.observaciones}
              onChange={(evento) => cambiar('observaciones', evento.target.value)}
            />
          </div>

          <div className="form-field form-grid__full">
            <label>
              Criterios de derivación ({criterios.length} de {CRITERIOS.length})
            </label>
            <div className="form-field__hint">
              Editá la selección para recalcular la severidad del caso.
            </div>
            <CriteriosGrid seleccion={criterios} onToggle={alternarCriterio} />
          </div>
        </div>
      </div>

      <div className="modal-criterios__footer">
        <div className="modal-criterios__status">
          <span className="modal-criterios__status-label">Estado de criterio:</span>
          <span className={`modal-criterios__badge ${severidad.clase}`}>{severidad.texto}</span>
        </div>
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
            onClick={() => onGuardar({ ...campos, criterios })}
          >
            Guardar cambios
          </button>
        </div>
      </div>
    </Modal>
  )
}
