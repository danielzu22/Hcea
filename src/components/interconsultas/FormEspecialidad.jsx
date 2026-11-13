import Icon from '../ui/Icon.jsx'
import Select from '../ui/Select.jsx'
import CriterioBanner from './CriterioBanner.jsx'
import {
  DEPARTAMENTOS,
  MODALIDADES,
  MOTIVOS,
  RESOLUCIONES,
  SEGUIMIENTOS,
  UNIDADES,
} from '../../data/catalogos.js'

const opcionesUnidad = UNIDADES.map((unidad) => ({ value: unidad, label: unidad }))
const opcionesDepto = DEPARTAMENTOS.map((depto) => ({ value: depto, label: depto }))
const opcionesMotivo = MOTIVOS.map((motivo) => ({ value: motivo, label: motivo }))

export default function FormEspecialidad({
  item,
  onCambio,
  onEliminar,
  onAbrirCriterios,
  onQuitarCriterios,
  error,
}) {
  const cambiar = (campo, valor) => onCambio(item.id, campo, valor)

  return (
    <div className="specialty-form__inner">
      <div className="specialty-form__grid">
        <div className="specialty-form__group">
          <label>Modalidad:</label>
          <Select
            ariaLabel="Modalidad"
            valor={item.modalidad}
            opciones={MODALIDADES}
            placeholder="Seleccionar modalidad"
            onChange={(valor) => cambiar('modalidad', valor)}
          />
          {error?.modalidad ? (
            <span className="specialty-form__error">{error.modalidad}</span>
          ) : null}
        </div>

        <div className="specialty-form__group">
          <label>Resolución en:</label>
          <Select
            ariaLabel="Resolución en"
            valor={item.resolucion}
            opciones={RESOLUCIONES}
            onChange={(valor) => cambiar('resolucion', valor)}
          />
        </div>

        <div className="specialty-form__group">
          <label>Seleccionar Depto:</label>
          <Select
            ariaLabel="Departamento"
            valor={item.depto}
            opciones={opcionesDepto}
            placeholder="Seleccionar departamento"
            onChange={(valor) => cambiar('depto', valor)}
          />
        </div>

        <div className="specialty-form__group">
          <label>Seleccionar UA:</label>
          <Select
            ariaLabel="Unidad asistencial"
            valor={item.ua}
            opciones={opcionesUnidad}
            placeholder="Seleccionar UA"
            onChange={(valor) => {
              cambiar('ua', valor)
              cambiar('unidad', valor)
            }}
          />
        </div>

        <div className="specialty-form__group span-2">
          <label>Tipo de consulta:</label>
          <div className="specialty-form__radio-group">
            <label className="specialty-form__radio-label">
              <input
                type="radio"
                name={`tipo_consulta_${item.id}`}
                value="primera"
                checked={item.tipoConsulta === 'primera'}
                onChange={() => {
                  cambiar('tipoConsulta', 'primera')
                  onAbrirCriterios(item.id)
                }}
              />
              <span className="radio-custom" aria-hidden="true" />
              Primera vez
            </label>
            <label className="specialty-form__radio-label">
              <input
                type="radio"
                name={`tipo_consulta_${item.id}`}
                value="seguimiento"
                checked={item.tipoConsulta === 'seguimiento'}
                onChange={() => {
                  cambiar('tipoConsulta', 'seguimiento')
                  onAbrirCriterios(item.id)
                }}
              />
              <span className="radio-custom" aria-hidden="true" />
              Seguimiento
            </label>
          </div>
        </div>

        <div className="specialty-form__group">
          <label>Seguimiento cada:</label>
          <Select
            ariaLabel="Seguimiento cada"
            valor={item.seguimientoDias}
            opciones={SEGUIMIENTOS}
            placeholder="Seleccionar días"
            onChange={(valor) => cambiar('seguimientoDias', valor)}
          />
        </div>

        {item.criterios.length > 0 ? (
          <div className="span-4">
            <CriterioBanner
              criterios={item.criterios}
              onEditar={() => onAbrirCriterios(item.id)}
              onEliminar={() => onQuitarCriterios(item.id)}
            />
          </div>
        ) : null}

        <div className="specialty-form__group span-2">
          <label>Motivo Interconsulta:</label>
          <Select
            ariaLabel="Motivo de la interconsulta"
            valor={item.motivo}
            opciones={opcionesMotivo}
            placeholder="Seleccionar motivo"
            onChange={(valor) => cambiar('motivo', valor)}
          />
        </div>

        <div className="specialty-form__group specialty-form__textarea-group">
          <label htmlFor={`observaciones-${item.id}`}>Observaciones</label>
          <textarea
            id={`observaciones-${item.id}`}
            value={item.observaciones}
            onChange={(evento) => cambiar('observaciones', evento.target.value)}
          />
        </div>
      </div>

      <div className="specialty-form__footer">
        <button type="button" className="specialty-form__btn-delete" onClick={() => onEliminar(item.id)}>
          <Icon nombre="Papelera" alt="Eliminar" /> Eliminar esta especialidad
        </button>
      </div>
    </div>
  )
}
