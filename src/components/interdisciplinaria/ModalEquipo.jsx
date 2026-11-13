import { useState } from 'react'
import { Users } from 'lucide-react'
import Icon from '../ui/Icon.jsx'
import Modal from '../ui/Modal.jsx'

// Alta y edición del nombre de un equipo de trabajo.
// Los integrantes se administran aparte, desde el botón "Integrantes" de la fila.
// `equipo` = null → alta; con datos → edición del nombre.
export default function ModalEquipo({ equipo, onGuardar, onCerrar }) {
  const [nombre, setNombre] = useState(equipo?.nombre ?? '')
  const [error, setError] = useState('')

  function guardar() {
    if (!nombre.trim()) {
      setError('El equipo necesita un nombre.')
      return
    }
    onGuardar({ nombre: nombre.trim() })
  }

  return (
    <Modal
      abierto
      onCerrar={onCerrar}
      ariaLabel={equipo ? 'Editar equipo' : 'Nuevo equipo'}
      className="modal-criterios modal-criterios--alta"
    >
      <div className="modal-criterios__header">
        <div className="modal-criterios__title">
          <span className="modal-criterios__title-icono" aria-hidden="true">
            <Users size={26} strokeWidth={2} />
          </span>
          <span>{equipo ? 'Editar equipo de trabajo' : 'Nuevo equipo de trabajo'}</span>
        </div>
        <button type="button" className="modal-criterios__close" aria-label="Cerrar" onClick={onCerrar}>
          <Icon nombre="Cerrar_bold" alt="Cerrar" />
        </button>
      </div>

      <div className="modal-criterios__body">
        <div className="form-field">
          <label htmlFor="equipo-nombre">Nombre del equipo</label>
          <input
            id="equipo-nombre"
            type="text"
            value={nombre}
            placeholder="Ej.: Embarazo, parto y puerperio"
            onChange={(evento) => {
              setNombre(evento.target.value)
              setError('')
            }}
            onKeyDown={(evento) => {
              if (evento.key === 'Enter') {
                evento.preventDefault()
                guardar()
              }
            }}
          />
          <span className="form-field__hint">
            Es personal: solo vos vas a ver y administrar este equipo. Los integrantes se agregan
            desde el botón «Integrantes» de la lista.
          </span>
        </div>

        {error ? <span className="form-field__error">{error}</span> : null}
      </div>

      <div className="modal-criterios__footer">
        <span />
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
            onClick={guardar}
          >
            {equipo ? 'Guardar cambios' : 'Crear equipo'}
          </button>
        </div>
      </div>
    </Modal>
  )
}
