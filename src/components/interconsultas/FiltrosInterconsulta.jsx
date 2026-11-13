import Icon from '../ui/Icon.jsx'
import Select from '../ui/Select.jsx'
import { OPCIONES_ESTADO } from '../../data/catalogos.js'

export const FILTROS_VACIOS = {
  especialidad: '',
  tecnico: '',
  prescritoHace: '0',
  estado: '',
  unidad: '',
}

const OPCIONES_PRESCRIPTO = [
  { value: '0', label: 'Todo' },
  { value: '30', label: 'Últimos 30 días' },
  { value: '90', label: 'Últimos 90 días' },
  { value: '365', label: 'Último año' },
]

const OPCIONES_ESTADO_TODAS = [{ value: '', label: 'Todo' }, ...OPCIONES_ESTADO]

export default function FiltrosInterconsulta({
  borrador,
  onCambiar,
  onAplicar,
  onLimpiar,
}) {
  return (
    <div className="filters-box">
      <form className="filters-box__grid" onSubmit={onAplicar}>
        <div className="filters-box__group">
          <label className="filters-box__label" htmlFor="filtro-especialidad">
            Especialidad/Disciplina:
          </label>
          <input
            id="filtro-especialidad"
            type="text"
            className="filters-box__input"
            value={borrador.especialidad}
            onChange={(evento) => onCambiar('especialidad', evento.target.value)}
          />
        </div>

        <div className="filters-box__group">
          <label className="filters-box__label" htmlFor="filtro-tecnico">
            Técnico:
          </label>
          <input
            id="filtro-tecnico"
            type="text"
            className="filters-box__input"
            value={borrador.tecnico}
            onChange={(evento) => onCambiar('tecnico', evento.target.value)}
          />
        </div>

        <div className="filters-box__group">
          <label className="filters-box__label">Prescripto hace:</label>
          <Select
            ariaLabel="Prescripto hace"
            valor={borrador.prescritoHace}
            opciones={OPCIONES_PRESCRIPTO}
            onChange={(valor) => onCambiar('prescritoHace', valor)}
          />
        </div>

        <div className="filters-box__group">
          <label className="filters-box__label">Estado:</label>
          <Select
            ariaLabel="Estado"
            valor={borrador.estado}
            opciones={OPCIONES_ESTADO_TODAS}
            onChange={(valor) => onCambiar('estado', valor)}
          />
        </div>

        <div className="filters-box__group">
          <label className="filters-box__label" htmlFor="filtro-unidad">
            Unidad que resuelve:
          </label>
          <input
            id="filtro-unidad"
            type="text"
            className="filters-box__input"
            value={borrador.unidad}
            onChange={(evento) => onCambiar('unidad', evento.target.value)}
          />
        </div>

        <div className="filters-box__action">
          <button type="submit" className="btn btn--primary">
            <Icon nombre="Filtros" alt="Filtros" style={{ width: 20, marginRight: 8 }} />
            Aplicar filtros
          </button>
        </div>

        <div className="filters-box__action">
          <button type="button" className="btn btn--outline" onClick={onLimpiar}>
            Limpiar
          </button>
        </div>
      </form>
    </div>
  )
}
