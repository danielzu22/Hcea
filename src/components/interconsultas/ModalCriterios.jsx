import { useState } from 'react'
import Icon from '../ui/Icon.jsx'
import Modal from '../ui/Modal.jsx'
import CriteriosGrid from '../ui/CriteriosGrid.jsx'
import { severidadCriterios } from '../../data/catalogos.js'

// Modal de criterios de derivación del alta. Se monta sólo cuando está
// abierto (la página lo hace con `key`), así el borrador interno arranca
// siempre desde la selección actual de la especialidad.
export default function ModalCriterios({ inicial = [], onConfirmar, onCerrar }) {
  const [seleccion, setSeleccion] = useState([...inicial])
  const severidad = severidadCriterios(seleccion.length)

  const alternar = (indice) =>
    setSeleccion((previo) =>
      previo.includes(indice)
        ? previo.filter((valor) => valor !== indice)
        : [...previo, indice].sort((a, b) => a - b),
    )

  return (
    <Modal abierto onCerrar={onCerrar} ariaLabel="Criterio de derivación">
      <div className="modal-criterios__header">
        <div className="modal-criterios__title">
          <Icon nombre="Notepad-check" alt="Notepad" className="modal-criterios__title-icon" />
          <span>Criterio de derivación</span>
        </div>
        <button type="button" className="modal-criterios__close" aria-label="Cerrar" onClick={onCerrar}>
          <Icon nombre="Cerrar_bold" alt="Cerrar" />
        </button>
      </div>

      <div className="modal-criterios__body">
        <CriteriosGrid seleccion={seleccion} onToggle={alternar} />
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
            onClick={() => onConfirmar(seleccion)}
          >
            Confirmar selección
          </button>
        </div>
      </div>
    </Modal>
  )
}
