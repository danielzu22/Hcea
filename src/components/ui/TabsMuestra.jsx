import { Link } from 'react-router-dom'

export default function TabsMuestra({ items }) {
  return (
    <div className="tabs" role="tablist">
      {items.map((item) => (
        <Link
          key={item.to}
          to={item.to}
          role="tab"
          aria-selected={item.activo}
          aria-current={item.activo ? 'page' : undefined}
          className={`tabs__tab ${item.activo ? 'tabs__tab--active' : ''}`}
        >
          {item.label}
        </Link>
      ))}
    </div>
  )
}
