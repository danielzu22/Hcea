import { useState } from 'react'
import { Link } from 'react-router-dom'
import logo from '../../assets/images/asse-blanco.svg'

export default function Header() {
  const [menuAbierto, setMenuAbierto] = useState(false)

  return (
    <header className="header">
      <div className="container header__container">
        <div className="header__brand">
          <Link to="/" className="header__logo" aria-label="Volver al portal de muestras">
            <img src={logo} alt="Logo" />
          </Link>
          <div className="header__divider" />
          <span className="header__brand-text">Consulta</span>
        </div>

        <button
          type="button"
          className={`header__toggle ${menuAbierto ? 'header__nav--open' : ''}`}
          aria-label="Abrir menú"
          aria-expanded={menuAbierto}
          onClick={() => setMenuAbierto((previo) => !previo)}
        >
          <span />
          <span />
          <span />
          <span />
        </button>

        <nav className={`header__nav ${menuAbierto ? 'header__nav--open' : ''}`} id="menu">
          <Link to="/" className="header__link header__link--active" aria-current="page">
            Inicio
          </Link>
          <span className="header__link">Burgueño Fernando</span>
          <Link to="/" className="header__link" aria-label="Salir">
            <i className="icon-exit" aria-hidden="true" />
          </Link>
        </nav>
      </div>
    </header>
  )
}
