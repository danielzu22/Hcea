import { useState } from 'react'
import SampleShell from '../../components/layout/SampleShell.jsx'
import TabsMuestra from '../../components/ui/TabsMuestra.jsx'
import Icon from '../../components/ui/Icon.jsx'
import ConfirmModal from '../../components/ui/ConfirmModal.jsx'
import ModalEquipo from '../../components/interdisciplinaria/ModalEquipo.jsx'
import FilaEquipo from '../../components/interdisciplinaria/FilaEquipo.jsx'
import { usarDb } from '../../store/db.js'
import { crearEquipo, actualizarEquipo, eliminarEquipo } from '../../store/equipos.js'

export default function InterdisciplinariaEquipos() {
  const db = usarDb()

  // { modo: 'alta' } | { modo: 'edicion', equipo }  → nombre del equipo
  const [modal, setModal] = useState(null)
  // id del equipo con el detalle de integrantes abierto (uno a la vez)
  const [expandido, setExpandido] = useState(null)
  const [aEliminar, setAEliminar] = useState(null)

  // Equipos personales: solo los del profesional logueado.
  const equipos = db.equipos.filter((equipo) => equipo.propietario === db.usuario)

  function alternar(equipoId) {
    setExpandido((previo) => (previo === equipoId ? null : equipoId))
  }

  return (
    <SampleShell>
      <TabsMuestra
        items={[
          {
            label: 'CONSULTAS INTERDISCIPLINARIAS',
            to: '/interdisciplinaria',
            activo: false,
          },
          {
            label: 'EQUIPOS',
            to: '/interdisciplinaria/equipos',
            activo: true,
          },
        ]}
      />

      <div className="content-card">
        <div className="ci-page-head">
          <p className="ci-subtitle">
            Grupos de especialistas que se asignan a las consultas interdisciplinarias. Son
            personales: cada profesional convocante administra los suyos.
          </p>
          <button
            type="button"
            className="btn btn--primary"
            onClick={() => setModal({ modo: 'alta' })}
          >
            <Icon
              nombre="Circulo-plus"
              alt=""
              style={{ width: 16, height: 16, marginRight: 8, filter: 'brightness(0) invert(100%)' }}
            />
            Nuevo equipo
          </button>
        </div>

        <div className="table-container">
          <table className="data-table tabla-expandible">
            <thead>
              <tr>
                <th>EQUIPO</th>
                <th>INTEGRANTES · DISCIPLINA</th>
                <th>CANT. ({equipos.length})</th>
                <th>ACCIONES</th>
              </tr>
            </thead>
            <tbody>
              {equipos.length === 0 ? (
                <tr>
                  <td colSpan={4}>
                    <div className="empty-state">
                      <div className="empty-state__title">Sin equipos creados</div>
                      <div className="empty-state__hint">
                        Creá un equipo con las disciplinas que convocás habitualmente para
                        reutilizarlo en tus consultas.
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                equipos.map((equipo) => (
                  <FilaEquipo
                    key={equipo.id}
                    equipo={equipo}
                    abierta={expandido === equipo.id}
                    onAlternar={alternar}
                    onEditar={(item) => setModal({ modo: 'edicion', equipo: item })}
                    onEliminarEquipo={setAEliminar}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {modal ? (
        <ModalEquipo
          key={modal.modo === 'edicion' ? modal.equipo.id : 'alta'}
          equipo={modal.modo === 'edicion' ? modal.equipo : null}
          onCerrar={() => setModal(null)}
          onGuardar={({ nombre }) => {
            if (modal.modo === 'edicion') {
              actualizarEquipo(modal.equipo.id, { nombre })
            } else {
              // El equipo nace sin integrantes; se agregan desde la fila expandible.
              crearEquipo({ nombre, integrantes: [] })
            }
            setModal(null)
          }}
        />
      ) : null}

      <ConfirmModal
        abierto={Boolean(aEliminar)}
        titulo="Eliminar equipo de trabajo"
        mensaje={
          aEliminar
            ? `Se eliminará el equipo "${aEliminar.nombre}". Las consultas que ya lo tengan asignado no se modifican.`
            : ''
        }
        textoConfirmar="Eliminar"
        peligro
        onCerrar={() => setAEliminar(null)}
        onConfirmar={() => {
          if (aEliminar) eliminarEquipo(aEliminar.id)
          setAEliminar(null)
        }}
      />
    </SampleShell>
  )
}
