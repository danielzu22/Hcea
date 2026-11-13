import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import SampleShell from '../../components/layout/SampleShell.jsx'
import Select from '../../components/ui/Select.jsx'
import { DISCIPLINAS, PRIORIDADES, TECNICOS, USUARIO_ACTUAL } from '../../data/catalogos.js'
import { crearConsulta } from '../../store/interdisciplinaria.js'
import { hoyISO } from '../../lib/fechas.js'

const opcionesCoordinador = TECNICOS.map((tecnico) => ({ value: tecnico, label: tecnico }))

export default function InterdisciplinariaNueva() {
  const navegar = useNavigate()

  const [motivo, setMotivo] = useState('')
  const [fechaReunion, setFechaReunion] = useState(hoyISO())
  const [coordinador, setCoordinador] = useState(USUARIO_ACTUAL)
  const [prioridad, setPrioridad] = useState('media')
  const [disciplinas, setDisciplinas] = useState([])
  const [observaciones, setObservaciones] = useState('')
  const [errores, setErrores] = useState({})

  function alternarDisciplina(disciplina) {
    setDisciplinas((previas) =>
      previas.includes(disciplina)
        ? previas.filter((valor) => valor !== disciplina)
        : [...previas, disciplina],
    )
    setErrores((previos) => ({ ...previos, disciplinas: undefined }))
  }

  function guardar() {
    const nuevosErrores = {}
    if (!motivo.trim()) nuevosErrores.motivo = 'Describí el motivo de la consulta.'
    if (disciplinas.length === 0) {
      nuevosErrores.disciplinas = 'Seleccioná al menos una disciplina.'
    }

    if (Object.keys(nuevosErrores).length > 0) {
      setErrores(nuevosErrores)
      return
    }

    const id = crearConsulta({
      motivo,
      fechaReunion,
      coordinador,
      prioridad,
      disciplinas,
      observaciones,
    })

    navegar(`/interdisciplinaria/${id}`)
  }

  return (
    <SampleShell>
      <div className="content-card">
        <div className="ci-page-head">
          <div>
            <h1 className="ci-title">Nueva consulta interdisciplinaria</h1>
            <p className="ci-subtitle">
              Definí el motivo, las disciplinas convocadas y la fecha de la primera reunión.
            </p>
          </div>
          <Link to="/interdisciplinaria" className="btn btn--outline">
            ← Volver al listado
          </Link>
        </div>

        <div className="form-grid">
          <div className="form-field form-grid__full">
            <label htmlFor="ci-motivo">Motivo de la consulta</label>
            <input
              id="ci-motivo"
              type="text"
              value={motivo}
              placeholder="Ej.: Dolor torácico con ansiedad de difícil manejo"
              onChange={(evento) => {
                setMotivo(evento.target.value)
                setErrores((previos) => ({ ...previos, motivo: undefined }))
              }}
            />
            {errores.motivo ? <span className="form-field__error">{errores.motivo}</span> : null}
          </div>

          <div className="form-field">
            <label htmlFor="ci-fecha">Fecha de reunión</label>
            <input
              id="ci-fecha"
              type="date"
              value={fechaReunion}
              onChange={(evento) => setFechaReunion(evento.target.value)}
            />
          </div>

          <div className="form-field">
            <label>Coordinador</label>
            <Select
              ariaLabel="Coordinador"
              valor={coordinador}
              opciones={opcionesCoordinador}
              onChange={setCoordinador}
            />
          </div>

          <div className="form-field">
            <label>Prioridad</label>
            <Select
              ariaLabel="Prioridad"
              valor={prioridad}
              opciones={PRIORIDADES}
              onChange={setPrioridad}
            />
          </div>

          <div className="form-field">
            <label>Estado inicial</label>
            <input type="text" value="Pendiente de reunión" readOnly className="text-muted" />
            <span className="form-field__hint">El estado se gestiona desde el detalle del caso.</span>
          </div>

          <div className="form-field form-grid__full">
            <label>Disciplinas convocadas</label>
            <div className="ci-disciplinas">
              {DISCIPLINAS.map((disciplina) => (
                <button
                  type="button"
                  key={disciplina}
                  className={`ci-disciplina ${disciplinas.includes(disciplina) ? 'selected' : ''}`}
                  aria-pressed={disciplinas.includes(disciplina)}
                  onClick={() => alternarDisciplina(disciplina)}
                >
                  {disciplina}
                </button>
              ))}
            </div>
            {errores.disciplinas ? (
              <span className="form-field__error">{errores.disciplinas}</span>
            ) : (
              <span className="form-field__hint">
                {disciplinas.length === 0
                  ? 'Seleccioná una o más disciplinas.'
                  : `${disciplinas.length} disciplina${disciplinas.length === 1 ? '' : 's'} seleccionada${disciplinas.length === 1 ? '' : 's'}.`}
              </span>
            )}
          </div>

          <div className="form-field form-grid__full">
            <label htmlFor="ci-observaciones">Observaciones</label>
            <textarea
              id="ci-observaciones"
              value={observaciones}
              placeholder="Contexto clínico, objetivos de la reunión, etc."
              onChange={(evento) => setObservaciones(evento.target.value)}
            />
          </div>
        </div>

        <div className="dynamic-layout__actions">
          <span className="dynamic-layout__actions-info">
            Se crea en estado &quot;Pendiente de reunión&quot;.
          </span>
          <Link to="/interdisciplinaria" className="btn btn--outline">
            Cancelar
          </Link>
          <button type="button" className="btn btn--primary" onClick={guardar}>
            Crear consulta
          </button>
        </div>
      </div>
    </SampleShell>
  )
}
