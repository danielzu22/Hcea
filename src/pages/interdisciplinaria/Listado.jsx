import { useMemo, useState } from 'react'
import SampleShell from '../../components/layout/SampleShell.jsx'
import TabsMuestra from '../../components/ui/TabsMuestra.jsx'
import Icon from '../../components/ui/Icon.jsx'
import { ClipboardCheck, PencilLine, Users } from 'lucide-react'
import Select from '../../components/ui/Select.jsx'
import Pagination from '../../components/ui/Pagination.jsx'
import ModalEquipoConsulta from '../../components/interdisciplinaria/ModalEquipoConsulta.jsx'
import ModalSeguimiento from '../../components/interdisciplinaria/ModalSeguimiento.jsx'
import { ESTADOS_CI } from '../../data/catalogos.js'
import { usarDb } from '../../store/db.js'
import {
  ESTADO_CONSULTA,
  contarFirmados,
  estadoGeneral,
  tieneEquipo,
} from '../../lib/consulta.js'
import { fechaDiaMes } from '../../lib/fechas.js'

const FILTROS_VACIOS = {
  paciente: '',
  documento: '',
  profesional: '',
  fecha: '',
  estado: '',
}

const POR_PAGINA = 8
const OPCIONES_ESTADO = [{ value: '', label: 'Todos' }, ...ESTADOS_CI]

// Fila de la consulta: fecha, paciente, equipo y estado.
function FilaConsulta({ consulta, paciente, onAbrirEquipo, onAbrirSeguimiento }) {
  const general = estadoGeneral(consulta)
  const firmados = contarFirmados(consulta)
  const total = consulta.participantes.length
  const sinEquipo = !tieneEquipo(consulta)

  return (
    <tr>
      <td>{fechaDiaMes(consulta.fechaReunion)}</td>
      <td>
        <div className="consulta-paciente">
          <span className="consulta-paciente__nombre">{paciente?.nombre ?? '—'}</span>
          <span className="consulta-paciente__doc">{paciente?.ci ?? '—'}</span>
        </div>
      </td>

      {/* Equipo: botón que abre el popup para asignar / quitar */}
      <td>
        {sinEquipo ? (
          <button
            type="button"
            className="btn btn--outline tabla-accion accion-equipo"
            aria-label={`Asignar equipo a la consulta de ${paciente?.nombre ?? ''}`}
            onClick={() => onAbrirEquipo(consulta.id)}
          >
            <Users size={14} strokeWidth={2} aria-hidden="true" />
            Equipo
            <span className="badge-sin-asignar">Sin asignar</span>
          </button>
        ) : (
          <div className="equipo-celda-acciones">
            <span
              className="equipo-nombre-chip"
              title={`Participantes: ${consulta.participantes.map((p) => p.nombre).join(', ')}`}
            >
              <Users size={14} strokeWidth={2} aria-hidden="true" />
              {consulta.equipoAsignadoNombre}
            </span>
            <button
              type="button"
              className="action-btn"
              title="Cambiar equipo"
              aria-label={`Cambiar el equipo de la consulta de ${paciente?.nombre ?? ''}`}
              onClick={() => onAbrirEquipo(consulta.id)}
            >
              <PencilLine size={14} strokeWidth={2} aria-hidden="true" />
            </button>
          </div>
        )}
      </td>

      {/* Estado: botón Seguimiento con el badge de estado + firmas */}
      <td>
        {sinEquipo ? (
          <button
            type="button"
            className="btn btn--outline tabla-accion"
            disabled
            title="Primero asigná el equipo"
          >
            <ClipboardCheck size={14} strokeWidth={2} aria-hidden="true" />
            Seguimiento
          </button>
        ) : (
          <button
            type="button"
            className="btn btn--outline tabla-accion accion-seguimiento"
            aria-label={`Seguimiento de la consulta de ${paciente?.nombre ?? ''}`}
            onClick={() => onAbrirSeguimiento(consulta.id)}
          >
            <ClipboardCheck size={14} strokeWidth={2} aria-hidden="true" />
            Seguimiento
            <span className={`badge-progreso badge-progreso--${general}`}>
              {general === 'finalizada' ? '\u2713 ' : ''}
              {ESTADO_CONSULTA[general].label} {firmados}/{total}
            </span>
          </button>
        )}
      </td>
    </tr>
  )
}

export default function InterdisciplinariaListado() {
  const db = usarDb()

  const [borrador, setBorrador] = useState(FILTROS_VACIOS)
  const [filtros, setFiltros] = useState(FILTROS_VACIOS)
  const [pagina, setPagina] = useState(1)
  const [modalEquipoId, setModalEquipoId] = useState(null)
  const [modalSeguimientoId, setModalSeguimientoId] = useState(null)

  const pacientes = useMemo(
    () => Object.fromEntries(db.pacientes.map((paciente) => [paciente.id, paciente])),
    [db.pacientes],
  )

  // Una fila por consulta (cada consulta la inicia un profesional convocante).
  const consultas = useMemo(() => {
    const pacienteTexto = filtros.paciente.trim().toLowerCase()
    const documento = filtros.documento.trim().toLowerCase()
    const profesional = filtros.profesional.trim().toLowerCase()

    return db.consultas.filter((consulta) => {
      const paciente = pacientes[consulta.pacienteId]
      if (pacienteTexto && !(paciente?.nombre ?? '').toLowerCase().includes(pacienteTexto)) return false
      if (documento && !(paciente?.ci ?? '').toLowerCase().includes(documento)) return false
      if (filtros.fecha && consulta.fechaReunion !== filtros.fecha) return false
      if (filtros.estado && estadoGeneral(consulta) !== filtros.estado) return false
      if (profesional) {
        const enEquipo = consulta.participantes.some(
          (p) =>
            p.nombre.toLowerCase().includes(profesional) ||
            p.disciplina.toLowerCase().includes(profesional),
        )
        if (!enEquipo) return false
      }
      return true
    })
  }, [db.consultas, pacientes, filtros])

  const totalPaginas = Math.max(1, Math.ceil(consultas.length / POR_PAGINA))
  const paginaActual = Math.min(pagina, totalPaginas)
  const visibles = consultas.slice((paginaActual - 1) * POR_PAGINA, paginaActual * POR_PAGINA)

  const cambiarFiltro = (campo, valor) =>
    setBorrador((previo) => ({ ...previo, [campo]: valor }))

  function aplicar(evento) {
    evento.preventDefault()
    setFiltros(borrador)
    setPagina(1)
  }

  function limpiar() {
    setBorrador(FILTROS_VACIOS)
    setFiltros(FILTROS_VACIOS)
    setPagina(1)
  }

  return (
    <SampleShell>
      <TabsMuestra
        items={[
          {
            label: 'CONSULTAS INTERDISCIPLINARIAS',
            to: '/interdisciplinaria',
            activo: true,
          },
          {
            label: 'EQUIPOS',
            to: '/interdisciplinaria/equipos',
            activo: false,
          },
        ]}
      />

      <div className="content-card">
        <div className="ci-page-head">
          <p className="ci-subtitle">
            Casos que requieren el abordaje conjunto de dos o más disciplinas.
          </p>
        </div>

        <div className="filters-box">
          <form className="filters-box__grid" onSubmit={aplicar}>
            <div className="filters-box__group">
              <label className="filters-box__label" htmlFor="ci-paciente">
                Paciente:
              </label>
              <input
                id="ci-paciente"
                type="text"
                className="filters-box__input"
                value={borrador.paciente}
                onChange={(evento) => cambiarFiltro('paciente', evento.target.value)}
              />
            </div>

            <div className="filters-box__group">
              <label className="filters-box__label" htmlFor="ci-documento">
                Documento:
              </label>
              <input
                id="ci-documento"
                type="text"
                className="filters-box__input"
                value={borrador.documento}
                onChange={(evento) => cambiarFiltro('documento', evento.target.value)}
              />
            </div>

            <div className="filters-box__group">
              <label className="filters-box__label">Estado:</label>
              <Select
                ariaLabel="Estado"
                valor={borrador.estado}
                opciones={OPCIONES_ESTADO}
                onChange={(valor) => cambiarFiltro('estado', valor)}
              />
            </div>

            <div className="filters-box__group">
              <label className="filters-box__label" htmlFor="ci-profesional">
                Profesional convocado:
              </label>
              <input
                id="ci-profesional"
                type="text"
                className="filters-box__input"
                value={borrador.profesional}
                onChange={(evento) => cambiarFiltro('profesional', evento.target.value)}
              />
            </div>

            <div className="filters-box__group">
              <label className="filters-box__label" htmlFor="ci-fecha">
                Fecha:
              </label>
              <input
                id="ci-fecha"
                type="date"
                className="filters-box__input"
                value={borrador.fecha}
                onChange={(evento) => cambiarFiltro('fecha', evento.target.value)}
              />
            </div>

            <div className="filters-box__action">
              <button type="submit" className="btn btn--primary">
                <Icon nombre="Lupa" alt="Buscar" style={{ width: 18, marginRight: 8 }} />
                Buscar
              </button>
            </div>

            <div className="filters-box__action">
              <button type="button" className="btn btn--outline" onClick={limpiar}>
                Limpiar
              </button>
            </div>
          </form>
        </div>

        <p className="text-muted" style={{ fontSize: '1.2rem' }}>
          {consultas.length === 0
            ? 'Sin consultas para los filtros aplicados.'
            : `${consultas.length} consulta${consultas.length === 1 ? '' : 's'} · página ${paginaActual} de ${totalPaginas}`}
        </p>

        <div className="table-container">
          <table className="data-table tabla-consultas">
            <thead>
              <tr>
                <th>FECHA</th>
                <th>PACIENTE</th>
                <th>EQUIPO</th>
                <th>ESTADO</th>
              </tr>
            </thead>
            <tbody>
              {visibles.length === 0 ? (
                <tr>
                  <td colSpan={4}>
                    <div className="empty-state">
                      <div className="empty-state__title">Sin consultas para esos filtros</div>
                      <div className="empty-state__hint">
                        Probá limpiando los filtros o creá una consulta nueva.
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                visibles.map((consulta) => (
                  <FilaConsulta
                    key={consulta.id}
                    consulta={consulta}
                    paciente={pacientes[consulta.pacienteId]}
                    onAbrirEquipo={setModalEquipoId}
                    onAbrirSeguimiento={setModalSeguimientoId}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>

        <Pagination
          total={consultas.length}
          pagina={paginaActual}
          porPagina={POR_PAGINA}
          onChange={setPagina}
        />
      </div>

      <ModalEquipoConsulta
        consultaId={modalEquipoId}
        onCerrar={() => setModalEquipoId(null)}
      />

      <ModalSeguimiento
        consultaId={modalSeguimientoId}
        onCerrar={() => setModalSeguimientoId(null)}
      />
    </SampleShell>
  )
}
