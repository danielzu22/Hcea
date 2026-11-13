import { Link } from 'react-router-dom'
import { Home } from 'lucide-react'

// Botón flotante para volver al portal de muestras desde cualquier maquetación.
export default function BotonInicio() {
  return (
    <Link to="/" className="boton-inicio" aria-label="Volver al inicio" title="Volver al inicio">
      <Home size={22} strokeWidth={2} aria-hidden="true" />
    </Link>
  )
}
