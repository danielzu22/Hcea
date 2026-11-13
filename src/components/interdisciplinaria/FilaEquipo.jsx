import { createPortal } from 'react-dom'
import { useState } from 'react'
import { ChevronRight, Plus, UserRound, Users } from 'lucide-react'
import Icon from '../ui/Icon.jsx'
import ModalAgregarIntegrantes from './ModalAgregarIntegrantes.jsx'
import { agregarIntegranteEquipo, eliminarIntegranteEquipo } from '../../store/equipos.js'

// Fila expandible de un equipo: el botón "Integrantes" (con chevron) abre una
// fila de detalle con la tabla de integrantes. "Agregar integrante" abre un
// popup con buscador, filtro por disciplina y sugerencias.
export default function FilaEquipo({
  equipo,
  abierta,
  onAlternar,
  onEditar,
  onEliminarEquipo,
}) {
  const [modalAgregar, setModalAgregar] = useState(false)
  const detalleId = `detalle-equipo-${equipo.id}`

  const abrirModal = () => {
    if (!abierta) onAlternar(equipo.id)
    setModalAgregar(true)
  }

  return (
    <>
      <tr className={`fila-expandible ${abierta ? 'is-expanded' : ''}`}>
        <td>
          <div className="equipo-celda">
            <span className="equipo-avatar" aria-hidden="true">
              <Users size={15} strokeWidth={2} />
            </span>
            <span>{equipo.nombre}</span>
          </div>
        </td>
        <td>
          {equipo.integrantes.length === 0 ? (
            <span className="text-muted">Sin integrantes</span>
          ) : (
            equipo.integrantes.map((integrante) => (
              <span className="ci-chip" key={integrante.id}>
                {integrante.nombre ? `${integrante.nombre} · ` : ''}
                {integrante.disciplina}
              </span>
            ))
          )}
        </td>
        <td>{equipo.integrantes.length}</td>
        <td>
          <div className="acciones-fila">
            <button
              type="button"
              className="action-btn action-btn--texto action-btn--expandir"
              aria-expanded={abierta}
              aria-controls={detalleId}
              aria-label={`Integrantes del equipo ${equipo.nombre}`}
              title="Ver integrantes"
              onClick={() => onAlternar(equipo.id)}
            >
              <span className="fila-expandible__chevron" aria-hidden="true">
                <ChevronRight size={16} strokeWidth={2} />
              </span>
              Integrantes
            </button>
            <button
              type="button"
              className="action-btn"
              title="Editar equipo"
              aria-label={`Editar equipo ${equipo.nombre}`}
              onClick={() => onEditar(equipo)}
            >
              <Icon nombre="Lapiz" alt="Editar" />
            </button>
            <button
              type="button"
              className="action-btn"
              title="Eliminar equipo"
              aria-label={`Eliminar equipo ${equipo.nombre}`}
              onClick={() => onEliminarEquipo(equipo)}
            >
              <Icon nombre="Papelera" alt="Eliminar" />
            </button>
          </div>
        </td>
      </tr>

      <tr id={detalleId} className={`fila-detalle ${abierta ? 'is-open' : ''}`}>
        <td colSpan={4}>
          <div className="fila-detalle__inner">
            <div className="fila-detalle__content">
              <div className="fila-detalle__panel">
                <div className="fila-detalle__header">
                  <h3 className="fila-detalle__titulo">Integrantes del equipo</h3>
                  <button
                    type="button"
                    className="btn btn--primary btn-agregar-integrante"
                    onClick={abrirModal}
                  >
                    <Plus size={16} strokeWidth={2.5} aria-hidden="true" />
                    Agregar integrante
                  </button>
                </div>

                <table className="data-table tabla-detalle">
                  <tbody>
                    {equipo.integrantes.length === 0 ? (
                      <tr>
                        <td>
                          <span className="text-muted">
                            Todavía no hay integrantes. Usá «Agregar integrante».
                          </span>
                        </td>
                      </tr>
                    ) : (
                      equipo.integrantes.map((integrante) => (
                        <tr key={integrante.id}>
                          <td>
                            <div className="integrante-celda">
                              <span className="integrante-avatar" aria-hidden="true">
                                <UserRound size={15} strokeWidth={2} />
                              </span>
                              <span className="integrante-nombre">{integrante.nombre || '—'}</span>
                              <span className="integrante-disciplina">({integrante.disciplina})</span>
                            </div>
                          </td>
                          <td className="integrante-accion">
                            <button
                              type="button"
                              className="action-btn"
                              title="Eliminar integrante"
                              aria-label={`Eliminar a ${integrante.nombre || integrante.disciplina} del equipo`}
                              onClick={() => eliminarIntegranteEquipo(equipo.id, integrante.id)}
                            >
                              <Icon nombre="Papelera" alt="Eliminar" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </td>
      </tr>

      {modalAgregar &&
        createPortal(
          <ModalAgregarIntegrantes
            equipo={equipo}
            onCerrar={() => setModalAgregar(false)}
            onConfirmar={(personas) => {
              personas.forEach((persona) => agregarIntegranteEquipo(equipo.id, persona))
            }}
          />,
          document.body,
        )}
    </>
  )
}
