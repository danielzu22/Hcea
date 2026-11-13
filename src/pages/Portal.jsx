import { Link } from 'react-router-dom'
import logo from '../assets/images/asse-blanco.svg'
import Icon from '../components/ui/Icon.jsx'

const MUESTRAS = [
  {
    to: '/interconsultas',
    titulo: 'Interconsultas',
    descripcion:
      'Histórico del paciente con filtros, estados y acciones; alta de interconsultas por especialidad y criterios de derivación.',
    icono: 'Consulta',
  },
  {
    to: '/interdisciplinaria',
    titulo: 'Consulta interdisciplinaria',
    descripcion:
      'Casos abordados por varias disciplinas: equipo tratante, acuerdos de la reunión y seguimiento del estado.',
    icono: 'Procedimientos',
  },
]

export default function Portal() {
  return (
    <div className="portal">
      <div className="portal__hero">
        <div className="container">
          <div className="portal__brand">
            <img src={logo} alt="asse" />
            <span className="portal__brand-text">HCEA · Prototipo de interfaz</span>
          </div>

          <h1 className="portal__title">Muestras de interfaz</h1>
          <p className="portal__lead">
            Maquetación navegable de las pantallas de la historia clínica electrónica.
          </p>
        </div>
      </div>

      <div className="container">
        <h2 className="portal__section-title">Muestras disponibles</h2>

        <div className="sample-grid">
          {MUESTRAS.map((muestra) => (
            <Link key={muestra.to} to={muestra.to} className="sample-card">
              <span className="sample-card__icon">
                <Icon nombre={muestra.icono} alt="" />
              </span>

              <h3 className="sample-card__title">{muestra.titulo}</h3>
              <p className="sample-card__desc">{muestra.descripcion}</p>

              <span className="sample-card__cta">Abrir muestra</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
