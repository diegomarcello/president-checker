import { REGIONS, UFS } from '@/data/ufs'
import { cn } from '@/lib/utils'

interface Props {
  value: string | null
  onChange: (sigla: string | null) => void
}

/** Tile-grid cartogram: one tile per UF, placed roughly where it sits in Brazil. */
export function BrazilTileMap({ value, onChange }: Props) {
  return (
    <div>
      <div
        role="radiogroup"
        aria-label="Escolha o seu estado"
        className="mx-auto grid max-w-[460px] grid-cols-8 gap-1 sm:gap-1.5"
        style={{ gridTemplateRows: 'repeat(7, minmax(0, 1fr))' }}
      >
        {UFS.map((uf) => {
          const selected = value === uf.sigla
          return (
            <button
              key={uf.sigla}
              type="button"
              role="radio"
              aria-checked={selected}
              aria-label={`${uf.nome}, região ${REGIONS[uf.regiao].label}`}
              title={uf.nome}
              onClick={() => onChange(selected ? null : uf.sigla)}
              style={{ gridColumn: uf.col + 1, gridRow: uf.row + 1 }}
              className={cn(
                'aspect-square rounded-md text-[11px] font-semibold text-charcoal transition-transform focus-visible:ring-[3px] focus-visible:ring-ring/60 focus-visible:outline-none sm:text-sm',
                selected
                  ? 'scale-105 bg-primary text-white shadow-card'
                  : `${REGIONS[uf.regiao].tile} hover:scale-105`,
              )}
            >
              {uf.sigla}
            </button>
          )
        })}
      </div>
      <ul className="mt-4 flex flex-wrap justify-center gap-x-4 gap-y-1.5 text-xs text-slate" aria-label="Legenda das regiões">
        {Object.values(REGIONS).map((r) => (
          <li key={r.label} className="flex items-center gap-1.5">
            <span className={cn('size-3 rounded-sm', r.tile)} aria-hidden />
            {r.label}
          </li>
        ))}
      </ul>
    </div>
  )
}
