import { ArrowLeft, ArrowRight, RotateCcw, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CandidateAvatar } from '@/components/brand'
import type { Candidate } from '@/data/types'
import type { Step } from '@/lib/steps'

interface Props {
  step: Step
  chosen: Candidate[]
  max: number
  profileFilled: boolean
  onBack: () => void
  onNext: () => void
  onRemove: (id: string) => void
  onRestart: () => void
}

/** Fixed bottom bar: back / continue, plus the candidate tray on step 2. */
export function WizardFooter({ step, chosen, max, profileFilled, onBack, onNext, onRemove, onRestart }: Props) {
  const ready = chosen.length >= 2
  const backLabel = step === 'perfil' ? 'Início' : step === 'candidatos' ? 'Perfil' : 'Candidatos'

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-40 border-t border-hairline bg-white/95 shadow-modal backdrop-blur"
      role="region"
      aria-label="Navegação do assistente"
    >
      <div className="mx-auto flex max-w-[1280px] items-center gap-3 px-4 py-3 sm:gap-4 sm:px-8">
        <Button variant="outline" size="lg" onClick={onBack}>
          <ArrowLeft /> <span className="hidden sm:inline">{backLabel}</span>
          <span className="sr-only sm:hidden">Voltar para {backLabel}</span>
        </Button>

        <div className="min-w-0 flex-1">
          {step === 'candidatos' && (
            <div className="flex items-center gap-3">
              <ul className="flex min-w-0 items-center gap-2 overflow-x-auto" aria-label="Candidatos escolhidos">
                {chosen.map((c) => (
                  <li
                    key={c.id}
                    title={c.name}
                    className="flex shrink-0 items-center gap-2 rounded-full border border-hairline bg-surface p-0.5 sm:py-1 sm:pr-1 sm:pl-1"
                  >
                    <CandidateAvatar candidate={c} className="size-7 text-[11px]" />
                    <span className="hidden max-w-[130px] truncate text-sm font-medium md:inline">{c.name}</span>
                    <button
                      type="button"
                      onClick={() => onRemove(c.id)}
                      aria-label={`Remover ${c.name} da comparação`}
                      className="hidden rounded-full p-1.5 text-steel sm:block hover:bg-hairline hover:text-ink focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                    >
                      <X className="size-3.5" />
                    </button>
                  </li>
                ))}
              </ul>
              <p className="shrink-0 text-sm text-steel">
                {chosen.length}/{max}
                <span className="hidden sm:inline"> · {ready ? 'pronto para comparar' : 'escolha ao menos 2'}</span>
              </p>
            </div>
          )}
          {step === 'perfil' && (
            <p className="hidden text-sm text-steel sm:block">
              Tudo opcional. Seus dados ficam só nesta página.
            </p>
          )}
        </div>

        {step === 'perfil' && (
          <Button size="lg" onClick={onNext}>
            {profileFilled ? 'Continuar' : 'Pular perfil'} <ArrowRight />
          </Button>
        )}
        {step === 'candidatos' && (
          <Button size="lg" disabled={!ready} onClick={onNext}>
            Ver comparação <ArrowRight />
          </Button>
        )}
        {step === 'resultado' && (
          <Button variant="ghost" size="lg" onClick={onRestart}>
            <RotateCcw /> <span className="hidden sm:inline">Recomeçar</span>
            <span className="sr-only sm:hidden">Recomeçar</span>
          </Button>
        )}
      </div>
    </div>
  )
}
