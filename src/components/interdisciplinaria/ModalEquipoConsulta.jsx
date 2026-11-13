import { useState } from 'react'
import { Trash2, Users } from 'lucide-react'
import Modal from '../ui/Modal.jsx'
import Icon from '../ui/Icon.jsx'
import Select from '../ui/Select.jsx'
import ConfirmModal from '../ui/ConfirmModal.jsx'
import { usarDb } from '../../store/db.js'
import { actualizarConsulta } from '../../store/interdisciplinaria.js'
import { tieneEquipo } from '../../lib/consulta.js'

// Popup de "Equipo de la consulta". Sólo dos opciones:
//  - con equipo: muestra el equipo actual y el botón "Quitar equipo".
//  - sin equipo: muestra el botón "Asignar equipo" (elige de los guardados).
// Acá NO se edita el equipo ni se borran integrantes: eso se hace en EQUIPOS.
export default function ModalEquipoConsulta({ consultaId, onCerrar }) {
  const db = usarDb()
  const [mostrandoSelector, setMostrandoSelector] = useState(false)
  const [confirmarQuitar, setConfirmarQuitar] = useState(false)

  const consulta = db.consultas.find((item) => item.id === consultaId)
  const equiposGuardados = (db.equipos ?? []).filter(
    (equipo) => equipo.propietario === db.usuario,
  )
  const opcionesEquipo = [
    { value: '', label: 'Elegir un equipo...' },
    ...equiposGuardados.map((equipo) => ({ value: equipo.id, label: equipo.nombre })),
  ]

  if (!consulta) return null

  const sinEquipo = !tieneEquipo(consulta)

  function asignar(equipoId) {
    const equipo = equiposGuardados.find((item) => item.id === equipoId)
    if (!equipo) return
    actualizarConsulta(consulta.id, {
      participantes: equipo.integrantes.map((integrante, indice) => ({
        id: `cp-${Date.now()}-${indice}`,
        nombre: integrante.nombre,
        disciplina: integrante.disciplina,
        estado: 'pendiente',
        inicioEn: null,
        firmadoEn: null,
      })),
      disciplinas: [...new Set(equipo.integrantes.map((integrante) => integrante.disciplina))],
      equipoAsignadoId: equipo.id,
      equipoAsignadoNombre: equipo.nombre,
    })
    setMostrandoSelector(false)
  }

  function pedirQuitar() {
    const hayFirmas = consulta.participantes.some((p) => p.estado !== 'pendiente')
    if (hayFirmas) {
      setConfirmarQuitar(true)
    } else {
      aplicarQuitar()
    }
  }

  function aplicarQuitar() {
    actualizarConsulta(consulta.id, {
      participantes: [],
      disciplinas: [],
      equipoAsignadoId: null,
      equipoAsignadoNombre: null,
    })
    setConfirmarQuitar(false)
  }

  return (
    <>
      <Modal
        abierto
        onCerrar={onCerrar}
        ariaLabel="Equipo de la consulta"
        className="modal-criterios modal-criterios--equipo-consulta"
      >
        <div className="modal-criterios__header">
          <div className="modal-criterios__title">Equipo de la consulta</div>
          <button type="button" className="modal-criterios__close" aria-label="Cerrar" onClick={onCerrar}>
            <Icon nombre="Cerrar_bold" alt="Cerrar" />
          </button>
        </div>

        <div className="modal-criterios__body">
          {!sinEquipo && !mostrandoSelector ? (
            <div className="equipo-consulta-actual">
              <span className="equipo-nombre-chip">
                <Users size={14} strokeWidth={2} aria-hidden="true" />
                {consulta.equipoAsignadoNombre}
              </span>
              <button type="button" className="btn btn--outline" onClick={pedirQuitar}>
                <Trash2 size={15} strokeWidth={2} aria-hidden="true" />
                Quitar equipo
              </button>
            </div>
          ) : null}

          {sinEquipo && !mostrandoSelector ? (
            <button
              type="button"
              className="btn btn--primary"
              onClick={() => setMostrandoSelector(true)}
            >
              <Users size={15} strokeWidth={2} aria-hidden="true" />
              Asignar equipo
            </button>
          ) : null}

          {mostrandoSelector ? (
            <div className="equipo-consulta-selector">
              <Select
                ariaLabel="Asignar equipo"
                valor=""
                opciones={opcionesEquipo}
                placeholder="Elegir un equipo..."
                onChange={asignar}
              />
            </div>
          ) : null}
        </div>

        <div className="modal-criterios__footer">
          <span />
          <div className="modal-criterios__actions">
            <button
              type="button"
              className="modal-criterios__btn modal-criterios__btn--confirm"
              onClick={onCerrar}
            >
              Listo
            </button>
          </div>
        </div>
      </Modal>

      <ConfirmModal
        abierto={confirmarQuitar}
        titulo="Quitar el equipo"
        mensaje="Al quitar el equipo se pierden las firmas de quienes ya registraron su intervención. El equipo guardado en EQUIPOS no se modifica."
        textoConfirmar="Quitar equipo"
        peligro
        onCerrar={() => setConfirmarQuitar(false)}
        onConfirmar={aplicarQuitar}
      />
    </>
  )
}
