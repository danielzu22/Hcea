import { Link, useParams } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'

// Breadcrumb de las vistas internas de Consultas interdisciplinarias.
// Reemplaza a la bajada de la lista e indica dónde estamos.
export default function BreadcrumbConsulta({ seccion, paciente, consulta }) {
  return (
    <nav className="ci-breadcrumb" aria-label="Ubicación">
      <Link to="/interdisciplinaria" className="ci-breadcrumb__link">
        Consultas interdisciplinarias
      </Link>
      <span className="ci-breadcrumb__sep" aria-hidden="true">
        <ChevronRight size={14} strokeWidth={2} />
      </span>
      <span className="ci-breadcrumb__actual">
        {seccion}
        {paciente ? ` · ${paciente}` : ''}
      </span>
      {consulta ? <span className="ci-breadcrumb__meta">{consulta}</span> : null}
    </nav>
  )
}

export function useConsultaActual() {
  const { id } = useParams()
  return id
}
