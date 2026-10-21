import { useEffect, useMemo } from 'react'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CandidateCatalog } from '@/components/CandidateCatalog'
import { FlagStripe, Logo } from '@/components/brand'
import { ProfileStep } from '@/components/ProfileStep'
import { Results } from '@/components/Results'
import { WizardFooter } from '@/components/WizardFooter'
import { WizardStepper } from '@/components/WizardStepper'
import type { Candidate, Profile, ThemeId, Weight } from '@/data/types'
import { profileIsFilled, profileTags } from '@/lib/profile'
import { STEPS, type Step } from '@/lib/steps'

interface Props {
  step: Step
  onStep: (s: Step) => void
  onExit: () => void
  all: Candidate[]
  chosen: Candidate[]
  max: number
  onToggle: (id: string) => void
  onUpload: () => void
  profile: Profile
  onProfile: (p: Profile) => void
  weights: Record<ThemeId, Weight>
  reasons: Record<ThemeId, string[]>
  overridden: ThemeId[]
  onWeight: (id: ThemeId, w: Weight) => void
  onResetWeights: () => void
  onRestart: () => void
}

const TITLES: Record<Step, { title: string; subtitle: string }> = {
  perfil: {
    title: 'Conte um pouco sobre você',
    subtitle:
      'Tudo opcional e em faixas. Com isso destacamos o que mais importa para o seu contexto. Se preferir, pule esta etapa.',
  },
  candidatos: {
    title: 'Escolha até 3 candidatos',
    subtitle: 'Navegue pelo catálogo de candidatos já processados ou envie o PDF do plano de um político. Ordem alfabética, sem destaques.',
  },
  resultado: {
    title: 'Comparação entre candidatos',
    subtitle: 'Pontos fortes, pontos fracos e riscos de cada político, com base nos planos de governo e sempre com a página de origem.',
  },
}

export function ComparePage(p: Props) {
  const canCompare = p.chosen.length >= 2
  const tags = useMemo(() => profileTags(p.profile), [p.profile])
  const filled = profileIsFilled(p.profile)
  const idx = STEPS.findIndex((s) => s.value === p.step)

  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [p.step])

  const canReach = (s: Step) => s !== 'resultado' || canCompare

  const next = () => p.onStep(STEPS[Math.min(idx + 1, STEPS.length - 1)].value)
  const back = () => (idx === 0 ? p.onExit() : p.onStep(STEPS[idx - 1].value))

  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 z-30 border-b border-hairline bg-white/90 backdrop-blur">
        <FlagStripe />
        <div className="mx-auto flex h-16 max-w-[1280px] items-center justify-between px-4 sm:px-8">
          <a href="#/" aria-label="Confere, voltar ao início">
            <Logo />
          </a>
          <Button asChild variant="ghost">
            <a href="#/">
              <ArrowLeft /> Voltar ao início
            </a>
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-[1280px] px-4 pt-8 pb-32 sm:px-8 sm:pt-10">
        <WizardStepper step={p.step} onStep={p.onStep} canReach={canReach} />

        <div className="mt-8 mb-8 max-w-2xl">
          <p className="text-micro-caps text-link">
            Passo {idx + 1} de {STEPS.length}
          </p>
          <h1 className="text-h2 mt-2">{TITLES[p.step].title}</h1>
          <p className="mt-3 text-lg text-slate">{TITLES[p.step].subtitle}</p>
        </div>

        {p.step === 'perfil' && (
          <ProfileStep
            profile={p.profile}
            onProfile={p.onProfile}
            weights={p.weights}
            reasons={p.reasons}
            overridden={p.overridden}
            onWeight={p.onWeight}
            onResetWeights={p.onResetWeights}
          />
        )}

        {p.step === 'candidatos' && (
          <CandidateCatalog
            candidates={p.all}
            selected={p.chosen.map((c) => c.id)}
            max={p.max}
            onToggle={p.onToggle}
            onUpload={p.onUpload}
            suggestedUf={p.profile.uf}
          />
        )}

        {p.step === 'resultado' &&
          (canCompare ? (
            <Results
              chosen={p.chosen}
              tags={tags}
              profile={p.profile}
              profileFilled={filled}
              weights={p.weights}
              onRemove={p.onToggle}
              onEditProfile={() => p.onStep('perfil')}
            />
          ) : (
            <p className="rounded-lg bg-surface p-8 text-center text-slate">
              Escolha ao menos 2 candidatos para ver a comparação.
            </p>
          ))}
      </main>

      <WizardFooter
        step={p.step}
        chosen={p.chosen}
        max={p.max}
        profileFilled={filled}
        onBack={back}
        onNext={next}
        onRemove={p.onToggle}
        onRestart={p.onRestart}
      />
    </div>
  )
}
