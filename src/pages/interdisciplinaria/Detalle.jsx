import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import SampleShell from '../../components/layout/SampleShell.jsx'
import Icon from '../../components/ui/Icon.jsx'
import Select from '../../components/ui/Select.jsx'
import ConfirmModal from '../../components/ui/ConfirmModal.jsx'
import { EstadoCI, EstadoOrden, PrioridadCI } from '../../components/ui/EstadoCI.jsx'
import { ESTADOS_CI, ROLES_EQUIPO } from '../../data/catalogos.js'
import { usarDb } from '../../store/db.js'
import {
  actualizarConsulta,
  agregarAcuerdo,
  agregarParticipante,
  eliminarAcuerdo,
  eliminarConsulta,
  eliminarParticipante,
} from '../../store/interdisciplinaria.js'
import { fechaHora, fechaLarga } from '../../lib/fechas.js'

const opcionesRol = ROLES_EQUIPO.map((rol) => ({ value: rol, label: rol }))

export default function InterdisciplinariaDetalle() {
  const { id } = useParams()
  const navegar = useNavigate()
  const db = usarDb()

  const consulta = db.consultas.find((item) => item.id === id)
  const paciente =
    db.pacientes.find((item) => item.id === consulta?.pacienteId) ?? db.pacientes[0]

  const [nuevoAcuerdo, setNuevoAcuerdo] = useState('')
  const [participante, setParticipante] = useState({ nombre: '', disciplina: '', rol: 'Colaborador' })
  const [errorParticipante, setErrorParticipante] = useState('')
  const [aEliminar, setAEliminar] = useState(false)

  useEffect(() => {
    if (!consulta) return
    setParticipante((previo) =>
      previo.disciplina ? previo : { ...previo, disciplina: consulta.disciplinas[0] ?? '' },
    )
  }, [consulta])

  if (!consulta) {
    return (
      <SampleShell>
        <div className="content-card">
          <div className="empty-state">
            <div className="empty-state__title">No encontramos esa consulta</div>
            <div className="empty-state__hint">
              Puede que se haya eliminado desde otra pestaña del navegador.
            </div>
            <Link
              to="/interdisciplinaria"
              className="btn btn--outline"
              style={{ marginTop: '1.6rem' }}
            >
              Volver al listado
            </Link>
          </div>
        </div>
      </SampleShell>
    )
  }

  const opcionesDisciplina = consulta.disciplinas.map((disciplina) => ({
    value: disciplina,
    label: disciplina,
  }))

  function sumarParticipante() {
    if (!participante.nombre.trim() || !participante.disciplina) {
      setErrorParticipante('Completá el nombre y la disciplina.')
      return
    }
    agregarParticipante(consulta.id, participante)
    setParticipante((previo) => ({ ...previo, nombre: '' }))
    setErrorParticipante('')
  }

  function sumarAcuerdo() {
    if (!nuevoAcuerdo.trim()) return
    agregarAcuerdo(consulta.id, nuevoAcuerdo)
    setNuevoAcuerdo('')
  }

  return (
    <SampleShell paciente={paciente}>
      <div className="content-card">
        <div className="ci-page-head">
          <div>
            <Link
              to="/interdisciplinaria"
              className="ci-subtitle"
              style={{ display: 'inline-block', marginBottom: '0.8rem' }}
            >
              ← Volver al listado
            </Link>
            <h1 className="ci-title">{consulta.motivo}</h1>
            <p className="ci-subtitle">
              Caso {consulta.id} · creado el {fechaLarga(consulta.creadaEn?.slice(0, 10))}
            </p>
          </div>

          <div className="ci-page-head__actions">
            <div className="form-field" style={{ minWidth: '200px' }}>
              <label>Estado del caso</label>
              <Select
                ariaLabel="Estado del caso"
                valor={consulta.estado}
                opciones={ESTADOS_CI}
                onChange={(valor) => actualizarConsulta(consulta.id, { estado: valor })}
              />
            </div>
            <button
              type="button"
              className="btn btn--danger"
              onClick={() => setAEliminar(true)}
            >
              Eliminar
            </button>
          </div>
        </div>

        <div className="ci-summary">
          <div>
            <div className="ci-summary__label">Paciente</div>
            <div className="ci-summary__value">{paciente?.nombre ?? '—'}</div>
          </div>
          <div>
            <div className="ci-summary__label">Coordinador</div>
            <div className="ci-summary__value">{consulta.coordinador}</div>
          </div>
          <div>
            <div className="ci-summary__label">Fecha de reunión</div>
            <div className="ci-summary__value">{fechaLarga(consulta.fechaReunion)}</div>
          </div>
          <div>
            <div className="ci-summary__label">Prioridad</div>
            <div className="ci-summary__value">
              <PrioridadCI prioridad={consulta.prioridad} />
            </div>
          </div>
          <div>
            <div className="ci-summary__label">Estado</div>
            <div className="ci-summary__value">
              <EstadoCI estado={consulta.estado} />
            </div>
          </div>
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <div className="ci-summary__label">Disciplinas convocadas</div>
          <div style={{ marginTop: '0.6rem' }}>
            {consulta.disciplinas.map((disciplina) => (
              <span key={disciplina} className="ci-chip">
                {disciplina}
              </span>
            ))}
          </div>
        </div>

        {consulta.observaciones ? (
          <div className="ci-panel" style={{ marginBottom: '2rem' }}>
            <div className="ci-panel__head">
              <h2 className="ci-panel__title">Observaciones</h2>
            </div>
            <p style={{ fontSize: '1.35rem', lineHeight: 1.6, color: '#33415c' }}>
              {consulta.observaciones}
            </p>
          </div>
        ) : null}

        <div className="ci-detail">
          <section className="ci-panel" aria-labelledby="ci-equipo">
            <div className="ci-panel__head">
              <h2 className="ci-panel__title" id="ci-equipo">
                Equipo interdisciplinario
              </h2>
              <span className="ci-panel__count">{consulta.participantes.length} integrantes</span>
            </div>

            <ul className="ci-list">
              {consulta.participantes.length === 0 ? (
                <li className="ci-item">
                  <div className="ci-item__meta">Todavía no hay integrantes asignados.</div>
                </li>
              ) : (
                consulta.participantes.map((integrante) => (
                  <li key={integrante.id} className="ci-item">
                    <div className="ci-item__main">
                      <div className="ci-item__title">{integrante.nombre}</div>
                      <div className="ci-item__meta">
                        {integrante.disciplina} · {integrante.rol}
                      </div>
                    </div>
                    <div className="ci-item__side">
                      <EstadoOrden estado={integrante.estado ?? 'pendiente'} />
                      <button
                        type="button"
                        className="ci-item__delete"
                        aria-label={`Quitar a ${integrante.nombre} del equipo`}
                        onClick={() => eliminarParticipante(consulta.id, integrante.id)}
                      >
                        <Icon nombre="Papelera" alt="Quitar" />
                      </button>
                    </div>
                  </li>
                ))
              )}
            </ul>

            <div className="ci-form-inline">
              <div className="ci-form-row">
                <input
                  type="text"
                  placeholder="Nombre y apellido"
                  value={participante.nombre}
                  onChange={(evento) => {
                    setParticipante((previo) => ({ ...previo, nombre: evento.target.value }))
                    setErrorParticipante('')
                  }}
                />
                <Select
                  ariaLabel="Disciplina del integrante"
                  valor={participante.disciplina}
                  opciones={opcionesDisciplina}
                  placeholder="Disciplina"
                  onChange={(valor) =>
                    setParticipante((previo) => ({ ...previo, disciplina: valor }))
                  }
                />
                <Select
                  ariaLabel="Rol en el equipo"
                  valor={participante.rol}
                  opciones={opcionesRol}
                  onChange={(valor) => setParticipante((previo) => ({ ...previo, rol: valor }))}
                />
              </div>
              {errorParticipante ? (
                <span className="form-field__error">{errorParticipante}</span>
              ) : null}
              <div>
                <button type="button" className="btn btn--primary" onClick={sumarParticipante}>
                  Agregar al equipo
                </button>
              </div>
            </div>
          </section>

          <section className="ci-panel" aria-labelledby="ci-acuerdos">
            <div className="ci-panel__head">
              <h2 className="ci-panel__title" id="ci-acuerdos">
                Acuerdos de la reunión
              </h2>
              <span className="ci-panel__count">{consulta.acuerdos.length} registrados</span>
            </div>

            <ul className="ci-list">
              {consulta.acuerdos.length === 0 ? (
                <li className="ci-item">
                  <div className="ci-item__meta">
                    Sin acuerdos registrados todavía. Anotá el primero abajo.
                  </div>
                </li>
              ) : (
                consulta.acuerdos.map((acuerdo) => (
                  <li key={acuerdo.id} className="ci-item">
                    <div className="ci-item__main">
                      <div className="ci-item__title">{acuerdo.texto}</div>
                      <div className="ci-item__meta">
                        {acuerdo.autor} · {fechaHora(acuerdo.fecha)}
                      </div>
                    </div>
                    <button
                      type="button"
                      className="ci-item__delete"
                      aria-label="Eliminar acuerdo"
                      onClick={() => eliminarAcuerdo(consulta.id, acuerdo.id)}
                    >
                      <Icon nombre="Papelera" alt="Eliminar" />
                    </button>
                  </li>
                ))
              )}
            </ul>

            <div className="ci-form-inline">
              <textarea
                placeholder="Nuevo acuerdo o conducta a seguir…"
                value={nuevoAcuerdo}
                onChange={(evento) => setNuevoAcuerdo(evento.target.value)}
              />
              <div>
                <button
                  type="button"
                  className="btn btn--primary"
                  onClick={sumarAcuerdo}
                  disabled={!nuevoAcuerdo.trim()}
                >
                  Registrar acuerdo
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>

      <ConfirmModal
        abierto={aEliminar}
        titulo="Eliminar consulta interdisciplinaria"
        mensaje={`Se eliminará el caso "${consulta.motivo}" con sus acuerdos y participantes. Esta acción no se puede deshacer.`}
        textoConfirmar="Eliminar"
        peligro
        onCerrar={() => setAEliminar(false)}
        onConfirmar={() => {
          eliminarConsulta(consulta.id)
          navegar('/interdisciplinaria')
        }}
      />
    </SampleShell>
  )
}
