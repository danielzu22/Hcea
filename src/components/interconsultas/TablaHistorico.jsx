import Icon from '../ui/Icon.jsx'
import StatusPill from '../ui/StatusPill.jsx'
import { MODALIDAD_POR_VALOR } from '../../data/catalogos.js'
import { fechaCorta } from '../../lib/fechas.js'

export default function TablaHistorico({ filas, onEditar, onCerrar }) {
  return (
    <div className="table-container">
      <table className="data-table">
        <thead>
          <tr>
            <th>ESPECIALIDAD/DISCIPLINA</th>
            <th>TÉCNICO</th>
            <th>FECHA SOLICITUD</th>
            <th>FECHA COORDINADA</th>
            <th>ESTADO</th>
            <th>MODALIDAD</th>
            <th>UNIDAD QUE RESUELVE</th>
            <th>ACCIONES</th>
          </tr>
        </thead>
        <tbody>
          {filas.length === 0 ? (
            <tr>
              <td colSpan={8}>
                <div className="empty-state">
                  <div className="empty-state__title">Sin resultados</div>
                  <div className="empty-state__hint">
                    Probá con otros filtros o agregá una interconsulta nueva.
                  </div>
                </div>
              </td>
            </tr>
          ) : (
            filas.map((fila) => (
              <tr key={fila.id}>
                <td>{fila.especialidad}</td>
                <td>{fila.tecnico}</td>
                <td>{fechaCorta(fila.fechaSolicitud)}</td>
                <td>{fechaCorta(fila.fechaCoordinada)}</td>
                <td>
                  <StatusPill estado={fila.estado} />
                </td>
                <td>{MODALIDAD_POR_VALOR[fila.modalidad]?.label ?? '—'}</td>
                <td>{fila.unidad}</td>
                <td>
                  <button
                    type="button"
                    className="action-btn"
                    title="Editar"
                    aria-label={`Editar interconsulta de ${fila.especialidad}`}
                    onClick={() => onEditar(fila)}
                  >
                    <Icon nombre="Lapiz" alt="Editar" />
                  </button>
                  <button
                    type="button"
                    className="action-btn"
                    title="Cerrar"
                    aria-label={`Cerrar interconsulta de ${fila.especialidad}`}
                    disabled={fila.estado === 'cancelado'}
                    onClick={() => onCerrar(fila)}
                  >
                    <Icon nombre="Cerrar_bold" alt="Cerrar" />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
