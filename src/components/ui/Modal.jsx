import { useEffect } from 'react'

// Modal genérico. Reutiliza las clases de .modal-backdrop / .modal-criterios
// para mantener la misma estética que el modal original de criterios.
export default function Modal({
  abierto,
  onCerrar,
  children,
  className = 'modal-criterios',
  ariaLabel,
}) {
  useEffect(() => {
    if (!abierto) return undefined

    const alPresionar = (evento) => {
      if (evento.key === 'Escape') onCerrar()
    }

    const overflowPrevio = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', alPresionar)

    return () => {
      document.body.style.overflow = overflowPrevio
      document.removeEventListener('keydown', alPresionar)
    }
  }, [abierto, onCerrar])

  if (!abierto) return null

  return (
    <div
      className="modal-backdrop"
      onMouseDown={(evento) => {
        if (evento.target === evento.currentTarget) onCerrar()
      }}
    >
      <div className={className} role="dialog" aria-modal="true" aria-label={ariaLabel}>
        {children}
      </div>
    </div>
  )
}
