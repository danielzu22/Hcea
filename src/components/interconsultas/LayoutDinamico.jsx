import Icon from '../ui/Icon.jsx'
import FormEspecialidad from './FormEspecialidad.jsx'

export default function LayoutDinamico({
  especialidades,
  activaId,
  onActivar,
  onCambio,
  onEliminar,
  onAbrirCriterios,
  onQuitarCriterios,
  errores,
  onGuardar,
  onCancelar,
  guardando,
}) {
  const cantidad = especialidades.length

  return (
    <>
      <div className="dynamic-layout">
        <div className="dynamic-layout__sidebar">
          {especialidades.map((item) => (
            <button
              type="button"
              key={item.id}
              className={`vertical-tab ${item.id === activaId ? 'active' : ''}`}
              aria-current={item.id === activaId ? 'true' : undefined}
              onClick={() => onActivar(item.id)}
            >
              <span className="vertical-tab__icon-box">
                <Icon nombre="Chequeado" alt="Check" />
              </span>
              <span className="vertical-tab__text">{item.especialidad}</span>
            </button>
          ))}
        </div>

        <div className="dynamic-layout__content">
          {especialidades.map((item) => (
            <div
              key={item.id}
              id={item.id}
              className={`specialty-form ${item.id === activaId ? 'active' : ''}`}
            >
              <FormEspecialidad
                item={item}
                onCambio={onCambio}
                onEliminar={onEliminar}
                onAbrirCriterios={onAbrirCriterios}
                onQuitarCriterios={onQuitarCriterios}
                error={errores[item.id]}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="dynamic-layout__actions">
        <span className="dynamic-layout__actions-info">
          {cantidad === 1
            ? '1 especialidad lista para guardar'
            : `${cantidad} especialidades listas para guardar`}
        </span>
        <button type="button" className="btn btn--outline" onClick={onCancelar} disabled={guardando}>
          Cancelar
        </button>
        <button type="button" className="btn btn--primary" onClick={onGuardar} disabled={guardando}>
          {guardando ? 'Guardando…' : 'Guardar interconsultas'}
        </button>
      </div>
    </>
  )
}
