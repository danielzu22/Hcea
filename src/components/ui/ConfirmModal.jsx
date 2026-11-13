import Modal from './Modal.jsx'
import Icon from './Icon.jsx'

export default function ConfirmModal({
  abierto,
  titulo = 'Confirmar acción',
  mensaje,
  textoConfirmar = 'Confirmar',
  textoCancelar = 'Cancelar',
  peligro = false,
  onConfirmar,
  onCerrar,
}) {
  return (
    <Modal abierto={abierto} onCerrar={onCerrar} ariaLabel={titulo}>
      <div className="modal-criterios__header">
        <div className="modal-criterios__title">{titulo}</div>
        <button type="button" className="modal-criterios__close" aria-label="Cerrar" onClick={onCerrar}>
          <Icon nombre="Cerrar_bold" alt="Cerrar" />
        </button>
      </div>

      <div className="modal-criterios__body">
        <p className="text-muted" style={{ fontSize: '1.5rem', lineHeight: 1.6 }}>
          {mensaje}
        </p>
      </div>

      <div className="modal-criterios__footer">
        <span />
        <div className="modal-criterios__actions">
          <button
            type="button"
            className="modal-criterios__btn modal-criterios__btn--cancel"
            onClick={onCerrar}
          >
            {textoCancelar}
          </button>
          <button
            type="button"
            className={`modal-criterios__btn ${
              peligro ? 'modal-criterios__btn--danger' : 'modal-criterios__btn--confirm'
            }`}
            onClick={onConfirmar}
          >
            {textoConfirmar}
          </button>
        </div>
      </div>
    </Modal>
  )
}
