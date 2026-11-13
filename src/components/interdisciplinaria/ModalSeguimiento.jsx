import { Clock, FileSignature } from 'lucide-react'
import Modal from '../ui/Modal.jsx'
import Icon from '../ui/Icon.jsx'
import { usarDb } from '../../store/db.js'
import { estadoParticipante } from '../../lib/consulta.js'
import { fechaHora } from '../../lib/fechas.js'

// Popup de "Seguimiento": sólo la tabla con el estado de cada profesional.
export default function ModalSeguimiento({ consultaId, onCerrar }) {
  const db = usarDb()
  const consulta = db.consultas.find((item) => item.id === consultaId)

  if (!consulta) return null

  return (
    <Modal
      abierto
      onCerrar={onCerrar}
      ariaLabel="Seguimiento"
      className="modal-criterios modal-criterios--seguimiento"
    >
      <div className="modal-criterios__header">
        <div className="modal-criterios__title">Seguimiento</div>
        <button type="button" className="modal-criterios__close" aria-label="Cerrar" onClick={onCerrar}>
          <Icon nombre="Cerrar_bold" alt="Cerrar" />
        </button>
      </div>

      <div className="modal-criterios__body">
        <table className="data-table tabla-seguimiento">
          <thead>
            <tr>
              <th>PROFESIONAL</th>
              <th>DISCIPLINA</th>
              <th>INGRESO</th>
              <th>FIRMA</th>
              <th>ESTADO</th>
            </tr>
          </thead>
          <tbody>
            {consulta.participantes.length === 0 ? (
              <tr>
                <td colSpan={5}>
                  <div className="empty-state">
                    <div className="empty-state__title">La consulta no tiene equipo</div>
                  </div>
                </td>
              </tr>
            ) : (
              consulta.participantes.map((participante) => {
                const meta = estadoParticipante(participante)
                return (
                  <tr key={participante.id}>
                    <td>{participante.nombre}</td>
                    <td>{participante.disciplina}</td>
                    <td>
                      {participante.inicioEn ? (
                        <span className="tabla-seguimiento__fecha">
                          <Clock size={14} strokeWidth={2} aria-hidden="true" />
                          {fechaHora(participante.inicioEn)}
                        </span>
                      ) : (
                        <span className="text-muted">—</span>
                      )}
                    </td>
                    <td>
                      {participante.firmadoEn ? (
                        <span className="tabla-seguimiento__fecha tabla-seguimiento__fecha--ok">
                          <FileSignature size={14} strokeWidth={2} aria-hidden="true" />
                          {fechaHora(participante.firmadoEn)}
                        </span>
                      ) : (
                        <span className="text-muted">—</span>
                      )}
                    </td>
                    <td>
                      <span className={`ci-state ci-state--${meta.modificador}`}>
                        {meta.label}
                      </span>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="modal-criterios__footer">
        <span />
        <div className="modal-criterios__actions">
          <button
            type="button"
            className="modal-criterios__btn modal-criterios__btn--confirm"
            onClick={onCerrar}
          >
            Cerrar
          </button>
        </div>
      </div>
    </Modal>
  )
}
