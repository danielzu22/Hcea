import { useEffect } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import Portal from './pages/Portal.jsx'
import InterconsultasHistorico from './pages/interconsultas/Historico.jsx'
import InterconsultasNueva from './pages/interconsultas/Nueva.jsx'
import InterdisciplinariaListado from './pages/interdisciplinaria/Listado.jsx'
import InterdisciplinariaNueva from './pages/interdisciplinaria/Nueva.jsx'
import InterdisciplinariaDetalle from './pages/interdisciplinaria/Detalle.jsx'
import InterdisciplinariaEquipos from './pages/interdisciplinaria/Equipos.jsx'

function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Portal />} />

        <Route path="/interconsultas" element={<InterconsultasHistorico />} />
        <Route path="/interconsultas/nueva" element={<InterconsultasNueva />} />

        <Route path="/interdisciplinaria" element={<InterdisciplinariaListado />} />
        <Route path="/interdisciplinaria/nueva" element={<InterdisciplinariaNueva />} />
        <Route path="/interdisciplinaria/equipos" element={<InterdisciplinariaEquipos />} />
        <Route path="/interdisciplinaria/detalle/:id" element={<InterdisciplinariaDetalle />} />
        <Route path="/interdisciplinaria/:id" element={<InterdisciplinariaDetalle />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}
