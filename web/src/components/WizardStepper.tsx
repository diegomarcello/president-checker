import { Check } from 'lucide-react'
import { STEPS, type Step } from '@/lib/steps'
import { cn } from '@/lib/utils'

interface Props {
  step: Step
  onStep: (s: Step) => void
  canReach: (s: Step) => boolean
}

export function WizardStepper({ step, onStep, canReach }: Props) {
  const current = STEPS.findIndex((s) => s.value === step)
  return (
    <nav aria-label="Etapas da comparação">
      <ol className="flex items-center">
        {STEPS.map((s, i) => {
          const done = i < current
          const active = i === current
          const reachable = canReach(s.value)
          return (
            <li key={s.value} className={cn('flex items-center', i < STEPS.length - 1 && 'flex-1')}>
              <button
                type="button"
                disabled={!reachable}
                aria-current={active ? 'step' : undefined}
                onClick={() => onStep(s.value)}
                className="flex items-center gap-2.5 rounded-md py-1 text-left focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none disabled:cursor-not-allowed"
              >
                <span
                  className={cn(
                    'flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold',
                    active && 'bg-primary text-white',
                    done && 'bg-success text-white',
                    !active && !done && 'border border-hairline-strong text-steel',
                  )}
                >
                  {done ? <Check className="size-4" aria-hidden /> : i + 1}
                </span>
                <span
                  className={cn(
                    'text-sm font-medium',
                    active ? 'text-ink' : 'hidden text-steel sm:inline',
                  )}
                >
                  {s.label}
                </span>
              </button>
              {i < STEPS.length - 1 && (
                <span
                  className={cn('mx-3 h-0.5 flex-1 rounded-full sm:mx-4', i < current ? 'bg-success' : 'bg-hairline')}
                  aria-hidden
                />
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
