import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import SampleShell from '../../components/layout/SampleShell.jsx'
import TabsMuestra from '../../components/ui/TabsMuestra.jsx'
import Icon from '../../components/ui/Icon.jsx'
import BuscadorEspecialidad from '../../components/interconsultas/BuscadorEspecialidad.jsx'
import LayoutDinamico from '../../components/interconsultas/LayoutDinamico.jsx'
import ModalCriterios from '../../components/interconsultas/ModalCriterios.jsx'
import { crearInterconsultas } from '../../store/interconsultas.js'
import { hoyISO } from '../../lib/fechas.js'

function especialidadVacia(id, nombre) {
  return {
    id,
    especialidad: nombre,
    modalidad: '',
    resolucion: 'otra',
    depto: '',
    ua: '',
    unidad: '',
    tipoConsulta: '',
    seguimientoDias: '30',
    motivo: '',
    observaciones: '',
    criterios: [],
  }
}

export default function InterconsultasNueva() {
  const navegar = useNavigate()
  const contador = useRef(0)

  const [busqueda, setBusqueda] = useState('')
  const [especialidades, setEspecialidades] = useState([])
  const [activaId, setActivaId] = useState(null)
  const [modalPara, setModalPara] = useState(null)
  const [errores, setErrores] = useState({})
  const [aviso, setAviso] = useState('')
  const [guardando, setGuardando] = useState(false)

  function agregar() {
    const nombre = busqueda.trim()

    if (!nombre) {
      setAviso('Seleccioná o escribí una especialidad primero.')
      return
    }

    const existente = especialidades.find(
      (item) => item.especialidad.toLowerCase() === nombre.toLowerCase(),
    )

    if (existente) {
      setActivaId(existente.id)
      setAviso(`"${existente.especialidad}" ya está agregada en otra pestaña.`)
      setBusqueda('')
      return
    }

    contador.current += 1
    const nueva = especialidadVacia(`sp-${contador.current}`, nombre)

    setEspecialidades((previas) => [...previas, nueva])
    setActivaId(nueva.id)
    setBusqueda('')
    setAviso('')
  }

  function actualizar(id, campo, valor) {
    setEspecialidades((previas) =>
      previas.map((item) => (item.id === id ? { ...item, [campo]: valor } : item)),
    )
    setErrores((previos) => {
      if (!previos[id]) return previos
      const copia = { ...previos }
      delete copia[id]
      return copia
    })
  }

  function eliminar(id) {
    const restantes = especialidades.filter((item) => item.id !== id)
    setEspecialidades(restantes)
    if (activaId === id) setActivaId(restantes[0]?.id ?? null)
    setModalPara((previo) => (previo === id ? null : previo))
  }

  function confirmarCriterios(seleccion) {
    setEspecialidades((previas) =>
      previas.map((item) =>
        item.id === modalPara ? { ...item, criterios: [...seleccion] } : item,
      ),
    )
    setModalPara(null)
  }

  function guardar() {
    if (especialidades.length === 0) {
      setAviso('Agregá al menos una especialidad antes de guardar.')
      return
    }

    const erroresNuevos = {}
    especialidades.forEach((item) => {
      if (!item.modalidad) {
        erroresNuevos[item.id] = { modalidad: 'Seleccioná la modalidad' }
      }
    })

    if (Object.keys(erroresNuevos).length > 0) {
      setErrores(erroresNuevos)
      setAviso('Completá la modalidad de cada especialidad para poder guardar.')
      const primeraConError = especialidades.find((item) => erroresNuevos[item.id])
      if (primeraConError) setActivaId(primeraConError.id)
      return
    }

    setGuardando(true)
    crearInterconsultas(
      especialidades.map((item) => ({
        especialidad: item.especialidad,
        modalidad: item.modalidad,
        fechaSolicitud: hoyISO(),
        estado: 'pendiente',
        unidad: item.ua || item.depto || 'Sin asignar',
        depto: item.depto,
        ua: item.ua,
        tipoConsulta: item.tipoConsulta,
        seguimientoDias: item.seguimientoDias,
        motivo: item.motivo,
        criterios: item.criterios,
        observaciones: item.observaciones,
      })),
    )
    navegar('/interconsultas')
  }

  const modalItem = especialidades.find((item) => item.id === modalPara)

  return (
    <SampleShell>
      <TabsMuestra
        items={[
          { label: 'HISTÓRICO INTERCONSULTAS', to: '/interconsultas', activo: false },
          { label: 'INTERCONSULTAS', to: '/interconsultas/nueva', activo: true },
        ]}
      />

      <div className="content-card">
        <div className="add-interconsulta">
          <div className="add-interconsulta__left">
            <div className="add-interconsulta__icon-box">
              <Icon nombre="Lupa" alt="Buscar" />
            </div>
            <span className="add-interconsulta__title">AGREGAR INTERCONSULTA:</span>
          </div>

          <BuscadorEspecialidad
            valor={busqueda}
            onCambiar={(valor) => {
              setBusqueda(valor)
              setAviso('')
            }}
            onSeleccionar={setBusqueda}
            onLimpiar={() => setBusqueda('')}
            onEnter={agregar}
          />

          <button type="button" className="btn btn--primary add-interconsulta__btn" onClick={agregar}>
            <Icon nombre="Circulo-plus" alt="Agregar" className="add-interconsulta__btn-icon" /> Agregar
          </button>
        </div>

        {aviso ? (
          <p className="specialty-form__error" role="status">
            {aviso}
          </p>
        ) : null}

        {especialidades.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state__title">Todavía no agregaste especialidades</div>
            <div className="empty-state__hint">
              Buscá una disciplina arriba y tocá &quot;Agregar&quot; para abrir su formulario. Podés
              sumar varias y guardarlas juntas.
            </div>
          </div>
        ) : (
          <LayoutDinamico
            especialidades={especialidades}
            activaId={activaId}
            onActivar={setActivaId}
            onCambio={actualizar}
            onEliminar={eliminar}
            onAbrirCriterios={setModalPara}
            onQuitarCriterios={(id) =>
              setEspecialidades((previas) =>
                previas.map((item) => (item.id === id ? { ...item, criterios: [] } : item)),
              )
            }
            errores={errores}
            onGuardar={guardar}
            onCancelar={() => navegar('/interconsultas')}
            guardando={guardando}
          />
        )}
      </div>

      {modalItem ? (
        <ModalCriterios
          key={modalItem.id}
          inicial={modalItem.criterios}
          onConfirmar={confirmarCriterios}
          onCerrar={() => setModalPara(null)}
        />
      ) : null}
    </SampleShell>
  )
}
