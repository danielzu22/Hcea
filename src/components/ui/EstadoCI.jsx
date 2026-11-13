import { ESTADO_CI_POR_VALOR, ESTADO_ORDEN_POR_VALOR } from '../../data/catalogos.js'

export function EstadoCI({ estado }) {
  const meta = ESTADO_CI_POR_VALOR[estado] ?? ESTADO_CI_POR_VALOR.pendiente
  return <span className={`ci-state ci-state--${estado}`}>{meta.label}</span>
}

export function EstadoOrden({ estado }) {
  const meta = ESTADO_ORDEN_POR_VALOR[estado] ?? ESTADO_ORDEN_POR_VALOR.pendiente
  return <span className={`ci-state ci-state--${estado}`}>{meta.label}</span>
}

export function PrioridadCI({ prioridad }) {
  const texto = prioridad === 'alta' ? 'Alta' : prioridad === 'baja' ? 'Baja' : 'Media'
  return <span className={`ci-prioridad ci-prioridad--${prioridad}`}>{texto}</span>
}
