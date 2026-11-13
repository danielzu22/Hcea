import { Link, useLocation } from 'react-router-dom'
import {
  CalendarDays,
  Users,
  ClipboardList,
  MapPinHouse,
  Signature,
  CalendarPlus,
  ChartColumn,
} from 'lucide-react'

// Secciones del menú según la navegación de la HCEA. Solo "Acceso a HC" e
// "Interdisciplinaria" tienen pantalla en esta maqueta; el resto son
// marcadores visuales (no navegan).
const SECCIONES = [
  { texto: 'Agenda del día', Icono: CalendarDays },
  { texto: 'Interdisciplinaria', Icono: Users, ruta: '/interdisciplinaria' },
  { texto: 'Acceso a HC', Icono: ClipboardList, ruta: '/interconsultas' },
  { texto: 'Actividad domiciliaria', Icono: MapPinHouse },
  { texto: 'Actividad docente', Icono: Signature },
  { texto: 'Agenda espontánea', Icono: CalendarPlus },
  { texto: 'Indicadores', Icono: ChartColumn },
]

export default function VerticalMenu() {
  const { pathname } = useLocation()

  return (
    <aside className="vertical-menu">
      <nav className="vertical-menu__nav" aria-label="Secciones">
        {SECCIONES.map(({ texto, Icono, ruta }) => {
          const activo = Boolean(ruta) && pathname.startsWith(ruta)
          const clase = `vertical-menu__link ${activo ? 'vertical-menu__link--active' : ''}`

          const contenido = (
            <>
              <Icono
                className="vertical-menu__icon"
                size={30}
                strokeWidth={1.5}
                aria-hidden="true"
              />
              <span>{texto}</span>
            </>
          )

          if (ruta) {
            return (
              <Link
                key={texto}
                to={ruta}
                className={clase}
                aria-current={activo ? 'page' : undefined}
              >
                {contenido}
              </Link>
            )
          }

          return (
            <a
              key={texto}
              href="#/"
              className={clase}
              onClick={(evento) => evento.preventDefault()}
            >
              {contenido}
            </a>
          )
        })}
      </nav>
    </aside>
  )
}
