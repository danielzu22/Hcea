// Paginación numérica simple, con elipsis cuando hay muchas páginas.
function calcularPaginas(total, actual) {
  if (total <= 7) return Array.from({ length: total }, (_, indice) => indice + 1)

  const numeros = [...new Set([1, total, actual - 1, actual, actual + 1])]
    .filter((numero) => numero >= 1 && numero <= total)
    .sort((a, b) => a - b)

  const resultado = []
  let anterior = 0
  numeros.forEach((numero) => {
    if (numero - anterior > 1) resultado.push('...')
    resultado.push(numero)
    anterior = numero
  })
  return resultado
}

export default function Pagination({ total, pagina, porPagina, onChange }) {
  const totalPaginas = Math.max(1, Math.ceil(total / porPagina))
  if (totalPaginas <= 1) return null

  return (
    <div className="pagination">
      <button
        type="button"
        className="pagination__btn"
        aria-label="Página anterior"
        disabled={pagina === 1}
        onClick={() => onChange(pagina - 1)}
      >
        &laquo;
      </button>

      {calcularPaginas(totalPaginas, pagina).map((numero, indice) =>
        numero === '...' ? (
          <span key={`puntos-${indice}`} className="pagination__btn" aria-hidden="true">
            …
          </span>
        ) : (
          <button
            key={numero}
            type="button"
            className={`pagination__btn ${numero === pagina ? 'pagination__btn--active' : ''}`}
            aria-label={`Página ${numero}`}
            aria-current={numero === pagina ? 'page' : undefined}
            onClick={() => onChange(numero)}
          >
            {numero}
          </button>
        ),
      )}

      <button
        type="button"
        className="pagination__btn"
        aria-label="Página siguiente"
        disabled={pagina === totalPaginas}
        onClick={() => onChange(pagina + 1)}
      >
        &raquo;
      </button>
    </div>
  )
}
