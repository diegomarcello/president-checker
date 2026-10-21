import { RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { THEMES } from '@/data/themes'
import type { ThemeId, Weight } from '@/data/types'
import { WEIGHT_LABEL } from '@/lib/profile'
import { cn } from '@/lib/utils'

interface Props {
  weights: Record<ThemeId, Weight>
  reasons: Record<ThemeId, string[]>
  overridden: ThemeId[]
  onChange: (id: ThemeId, w: Weight) => void
  onReset: () => void
}

export function PriorityEditor({ weights, reasons, overridden, onChange, onReset }: Props) {
  return (
    <div>
      <ul className="divide-y divide-hairline-soft">
        {THEMES.map((t) => {
          const why = reasons[t.id]
          return (
            <li key={t.id} className="flex flex-col gap-3 py-4 first:pt-0 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex min-w-0 items-start gap-3">
                <span className={cn('flex size-9 shrink-0 items-center justify-center rounded-md text-charcoal', t.tint)}>
                  <t.icon className="size-[18px]" aria-hidden />
                </span>
                <div className="min-w-0">
                  <p className="font-medium">{t.label}</p>
                  <p className="text-[13px] text-steel">
                    {overridden.includes(t.id)
                      ? 'Ajustado por você'
                      : why.length > 0
                        ? `Sugerido: ${why.join(' e ')}`
                        : t.description}
                  </p>
                </div>
              </div>
              <ToggleGroup
                type="single"
                variant="outline"
                size="sm"
                value={String(weights[t.id])}
                onValueChange={(v) => v && onChange(t.id, Number(v) as Weight)}
                aria-label={`Relevância de ${t.label}`}
                className="shrink-0"
              >
                {([0, 1, 2, 3] as Weight[]).map((w) => (
                  <ToggleGroupItem
                    key={w}
                    value={String(w)}
                    className="px-3 text-[13px] data-[state=on]:bg-ink-deep data-[state=on]:text-white"
                  >
                    {WEIGHT_LABEL[w]}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            </li>
          )
        })}
      </ul>
      {overridden.length > 0 && (
        <Button variant="ghost" size="sm" onClick={onReset} className="mt-2">
          <RotateCcw /> Restaurar sugestões
        </Button>
      )}
    </div>
  )
}
