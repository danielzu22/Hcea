import Icon from '../ui/Icon.jsx'

export default function PatientBanner({ paciente }) {
  if (!paciente) return null

  return (
    <div className="patient-banner">
      <div className="container">
        <div className="patient-banner__inner">
          <div className="patient-banner__info">
            <Icon nombre="Usuario" alt="Usuario" className="patient-banner__icon" />
            <span className="patient-banner__name">{paciente.nombre}</span>
            <span className="patient-banner__data">CI: {paciente.ci}</span>
            <span className="patient-banner__data">{paciente.edad} años</span>
            <span className="patient-banner__data">{paciente.sexo}</span>
          </div>
          <div className="patient-banner__actions">
            <a href="#/" className="patient-banner__action" aria-label="Nota">
              <Icon nombre="Nota" alt="Nota" />
            </a>
            <a href="#/" className="patient-banner__action" aria-label="Campana">
              <Icon nombre="Campana" alt="Campana" />
            </a>
            <a href="#/" className="patient-banner__action" aria-label="Carpeta del usuario">
              <Icon nombre="Carpeta-usuario" alt="Carpeta usuario" />
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
