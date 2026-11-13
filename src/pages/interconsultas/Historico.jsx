import { useMemo, useState } from 'react'
import SampleShell from '../../components/layout/SampleShell.jsx'
import TabsMuestra from '../../components/ui/TabsMuestra.jsx'
import Pagination from '../../components/ui/Pagination.jsx'
import ConfirmModal from '../../components/ui/ConfirmModal.jsx'
import FiltrosInterconsulta, {
  FILTROS_VACIOS,
} from '../../components/interconsultas/FiltrosInterconsulta.jsx'
import TablaHistorico from '../../components/interconsultas/TablaHistorico.jsx'
import ModalEdicion from '../../components/interconsultas/ModalEdicion.jsx'
import { usarDb } from '../../store/db.js'
import { actualizarInterconsulta, cambiarEstadoInterconsulta } from '../../store/interconsultas.js'
import { diasDesde } from '../../lib/fechas.js'

const POR_PAGINA = 5

export default function InterconsultasHistorico() {
  const db = usarDb()
  const [borrador, setBorrador] = useState(FILTROS_VACIOS)
  const [filtros, setFiltros] = useState(FILTROS_VACIOS)
  const [pagina, setPagina] = useState(1)
  const [editando, setEditando] = useState(null)
  const [aCerrar, setACerrar] = useState(null)

  const filas = useMemo(() => {
    const especialidad = filtros.especialidad.trim().toLowerCase()
    const tecnico = filtros.tecnico.trim().toLowerCase()
    const unidad = filtros.unidad.trim().toLowerCase()
    const limiteDias = Number(filtros.prescritoHace)

    return db.interconsultas.filter((registro) => {
      if (especialidad && !registro.especialidad.toLowerCase().includes(especialidad)) return false
      if (tecnico && !registro.tecnico.toLowerCase().includes(tecnico)) return false
      if (unidad && !registro.unidad.toLowerCase().includes(unidad)) return false
      if (filtros.estado && registro.estado !== filtros.estado) return false
      if (limiteDias > 0 && diasDesde(registro.fechaSolicitud) > limiteDias) return false
      return true
    })
  }, [db.interconsultas, filtros])

  const totalPaginas = Math.max(1, Math.ceil(filas.length / POR_PAGINA))
  const paginaActual = Math.min(pagina, totalPaginas)
  const visibles = filas.slice((paginaActual - 1) * POR_PAGINA, paginaActual * POR_PAGINA)

  const cambiarFiltro = (campo, valor) =>
    setBorrador((previo) => ({ ...previo, [campo]: valor }))

  function aplicar(evento) {
    evento.preventDefault()
    setFiltros(borrador)
    setPagina(1)
  }

  function limpiar() {
    setBorrador(FILTROS_VACIOS)
    setFiltros(FILTROS_VACIOS)
    setPagina(1)
  }

  return (
    <SampleShell>
      <TabsMuestra
        items={[
          { label: 'HISTÓRICO INTERCONSULTAS', to: '/interconsultas', activo: true },
          { label: 'INTERCONSULTAS', to: '/interconsultas/nueva', activo: false },
        ]}
      />

      <div className="content-card">
        <FiltrosInterconsulta
          borrador={borrador}
          onCambiar={cambiarFiltro}
          onAplicar={aplicar}
          onLimpiar={limpiar}
        />

        <p className="text-muted" style={{ fontSize: '1.2rem' }}>
          {filas.length === 0
            ? 'Sin interconsultas para los filtros aplicados.'
            : `${filas.length} interconsulta${filas.length === 1 ? '' : 's'} · página ${paginaActual} de ${totalPaginas}`}
        </p>

        <TablaHistorico filas={visibles} onEditar={setEditando} onCerrar={setACerrar} />

        <Pagination
          total={filas.length}
          pagina={paginaActual}
          porPagina={POR_PAGINA}
          onChange={setPagina}
        />
      </div>

      {editando ? (
        <ModalEdicion
          key={editando.id}
          registro={editando}
          onCerrar={() => setEditando(null)}
          onGuardar={(cambios) => {
            actualizarInterconsulta(editando.id, cambios, 'Editada desde el histórico')
            setEditando(null)
          }}
        />
      ) : null}

      <ConfirmModal
        abierto={Boolean(aCerrar)}
        titulo="Cerrar interconsulta"
        mensaje={
          aCerrar
            ? `La interconsulta de ${aCerrar.especialidad} pasará al estado "Cancelado". Podés volver a abrirla desde el lápiz de edición.`
            : ''
        }
        textoConfirmar="Cerrar interconsulta"
        peligro
        onCerrar={() => setACerrar(null)}
        onConfirmar={() => {
          if (aCerrar) {
            cambiarEstadoInterconsulta(aCerrar.id, 'cancelado', 'Cerrada desde el histórico')
          }
          setACerrar(null)
        }}
      />
    </SampleShell>
  )
}
