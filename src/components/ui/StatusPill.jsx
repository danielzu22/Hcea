import Icon from './Icon.jsx'
import { ESTADO_POR_VALOR } from '../../data/catalogos.js'

export default function StatusPill({ estado }) {
  const meta = ESTADO_POR_VALOR[estado] ?? ESTADO_POR_VALOR.pendiente

  return (
    <span className={`status-pill status-pill--${meta.modificador}`}>
      <Icon nombre={meta.icono} alt="" />
      {meta.label}
    </span>
  )
}
