import { usarDb } from '../../store/db.js'
import BotonInicio from '../ui/BotonInicio.jsx'
import Header from './Header.jsx'
import PatientBanner from './PatientBanner.jsx'
import VerticalMenu from './VerticalMenu.jsx'

// Armazón de la aplicación maquetada: header + banner de paciente + menú
// vertical + contenido. Es el equivalente del AppLayout de cortex.
export default function SampleShell({ children }) {
  const db = usarDb()
  const paciente = db.pacientes[0]

  return (
    <>
      <Header />
      <PatientBanner paciente={paciente} />
      <section className="main-section">
        <div className="container">
          <div className="main-layout">
            <VerticalMenu />
            <div className="main-content">{children}</div>
          </div>
        </div>
      </section>
      <BotonInicio />
    </>
  )
}
