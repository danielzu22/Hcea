import Icon from '../ui/Icon.jsx'
import { severidadCriterios } from '../../data/catalogos.js'

export default function CriterioBanner({ criterios, onEditar, onEliminar }) {
  const severidad = severidadCriterios(criterios.length)

  return (
    <div className="criterio-banner">
      <div className="criterio-banner__info">
        <div className="criterio-banner__icon">
          <Icon nombre="Chequeado" alt="Check" />
        </div>
        <div className="criterio-banner__text">
          Criterio de derivación: <span className={severidad.color}>{severidad.texto}</span>
        </div>
      </div>
      <div className="criterio-banner__actions">
        <button type="button" className="criterio-banner__btn criterio-banner__btn--edit" onClick={onEditar}>
          <Icon nombre="Lapiz" alt="Editar" /> Editar
        </button>
        <button
          type="button"
          className="criterio-banner__btn criterio-banner__btn--delete"
          onClick={onEliminar}
        >
          <Icon nombre="Papelera" alt="Eliminar" /> Eliminar
        </button>
      </div>
    </div>
  )
}
