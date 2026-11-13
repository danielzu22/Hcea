import { CRITERIOS } from '../../data/catalogos.js'

// Grilla de criterios de derivación. Se usa tanto en el modal del alta como
// en el modal de edición del histórico.
export default function CriteriosGrid({ seleccion, onToggle }) {
  return (
    <div className="modal-criterios__grid">
      {CRITERIOS.map((texto, indice) => {
        const activo = seleccion.includes(indice)
        return (
          <button
            type="button"
            key={texto}
            className={`criterio-card ${activo ? 'selected' : ''}`}
            aria-pressed={activo}
            onClick={() => onToggle(indice)}
          >
            <span className="criterio-card__checkbox" aria-hidden="true" />
            <span className="criterio-card__text">{texto}</span>
          </button>
        )
      })}
    </div>
  )
}
