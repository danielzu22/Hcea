// Íconos SVG del proyecto. Se importan con Vite para que el bundler los
// resuelva, los hashee y respete el `base` de la build.
const modulos = import.meta.glob('../../assets/icons/*.svg', {
  eager: true,
  query: '?url',
  import: 'default',
})

const porNombre = Object.fromEntries(
  Object.entries(modulos).map(([ruta, url]) => [
    ruta.split('/').pop().replace(/\.svg$/i, ''),
    url,
  ]),
)

export function iconoUrl(nombre) {
  return porNombre[nombre] ?? ''
}

export default function Icon({ nombre, alt = '', className, style, width, height }) {
  const src = porNombre[nombre]
  if (!src) return null
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      style={style}
      width={width}
      height={height}
      aria-hidden={alt ? undefined : 'true'}
    />
  )
}
