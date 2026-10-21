import { useState } from 'react'
import { GitCompareArrows, MessageSquarePlus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CandidateAvatar, MandateBadge, OriginSeal } from '@/components/brand'
import { MandateHistory } from '@/components/MandateHistory'
import { ThemeDetail } from '@/components/Results'
import { SectionFeedback } from '@/components/SectionFeedback'
import { SubPageHeader } from '@/components/SubPageHeader'
import { SubmitContributionDialog } from '@/components/SubmitContributionDialog'
import { THEMES } from '@/data/themes'
import type { Candidate, Submission } from '@/data/types'
import { analyzeTheme } from '@/lib/analysis'
import { isQueued } from '@/lib/submissions'

interface Props {
  candidate: Candidate | undefined
  onCompare: (id: string) => void
  submissions: Submission[]
  onSubmit: (s: Submission) => void
}

const NO_TAGS = new Set<never>()

export function CandidatePage({ candidate, onCompare, submissions, onSubmit }: Props) {
  const [contribOpen, setContribOpen] = useState(false)
  const mine = submissions.filter((s) => s.candidateId === candidate?.id)
  const queued = mine.filter(isQueued).length
  const approved = mine.filter((s) => s.status === 'aprovada').length

  return (
    <div className="min-h-screen bg-white">
      <SubPageHeader />

      <main className="mx-auto max-w-[1280px] px-4 py-8 sm:px-8 sm:py-12">
        {!candidate ? (
          <div className="rounded-lg bg-surface p-10 text-center">
            <h1 className="text-h2">Candidato não encontrado</h1>
            <p className="mt-3 text-slate">Este candidato não está no catálogo ou o link expirou.</p>
            <Button asChild size="lg" className="mt-6">
              <a href="#/">Voltar ao início</a>
            </Button>
          </div>
        ) : (
          <>
            <section className="flex flex-col gap-6 rounded-lg bg-tint-cream p-6 sm:p-8 md:flex-row md:items-center md:justify-between">
              <div className="flex items-start gap-4">
                <CandidateAvatar candidate={candidate} className="size-16 text-xl" />
                <div className="min-w-0">
                  <p className="text-micro-caps text-steel">Dados do candidato</p>
                  <h1 className="text-h2 mt-1">{candidate.name}</h1>
                  <p className="mt-1 text-slate">
                    {candidate.partyName} ({candidate.party}) · {candidate.office}
                  </p>
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <MandateBadge mandate={candidate.mandate} />
                    <OriginSeal origin={candidate.origin} />
                    <span className="text-sm text-steel">
                      Plano {candidate.planVersion} · {candidate.planDate} · {candidate.pages} páginas
                    </span>
                  </div>
                </div>
              </div>
              <Button size="lg" className="h-11 shrink-0 px-5" onClick={() => onCompare(candidate.id)}>
                <GitCompareArrows /> Comparar este candidato
              </Button>
            </section>

            <section
              className="mt-6 flex flex-col gap-4 rounded-lg border border-hairline bg-white p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6"
              aria-labelledby="contrib-title"
            >
              <div className="max-w-2xl">
                <h2 id="contrib-title" className="text-[20px]">
                  Viu algo errado ou faltando?
                </h2>
                <p className="mt-1 text-sm leading-relaxed text-slate">
                  Envie um site ou arquivo com informação adicional ou correção para a curadoria. A aprovação e a
                  inclusão aparecem na tela de Curadoria, onde todos acompanham e votam no que deve ser analisado antes.
                </p>
                <p className="mt-2 text-sm text-steel">
                  <a href={`#/curadoria/${candidate.id}`} className="font-medium text-link hover:underline">
                    {queued} {queued === 1 ? 'contribuição na fila' : 'contribuições na fila'}
                  </a>
                  {approved > 0 && ` · ${approved} ${approved === 1 ? 'já incluída' : 'já incluídas'}`}
                </p>
              </div>
              <Button size="lg" variant="outline" className="h-11 shrink-0 px-5" onClick={() => setContribOpen(true)}>
                <MessageSquarePlus /> Enviar informação ou correção
              </Button>
            </section>
            <SubmitContributionDialog
              candidate={candidate}
              open={contribOpen}
              onOpenChange={setContribOpen}
              onSubmit={onSubmit}
            />

            <section className="mt-12" aria-labelledby="hist-title">
              <h2 id="hist-title" className="text-h2">
                Histórico de mandato
              </h2>
              <p className="mt-2 mb-6 max-w-2xl text-slate">
                O que foi prometido no plano da última campanha e o que consta como feito.
              </p>
              <MandateHistory chosen={[candidate]} />
              <SectionFeedback className="mt-6" section="candidato:historico" label="Página do candidato · histórico de mandato" prompt="O histórico de mandato faz sentido para você?" candidates={[candidate.id]} />
            </section>

            <section className="mt-14" aria-labelledby="plano-title">
              <h2 id="plano-title" className="text-h2">
                O que o plano atual propõe
              </h2>
              <p className="mt-2 mb-6 max-w-2xl text-slate">
                Visão geral por tema, sem considerar o seu perfil. Para ver o efeito no seu contexto, compare com outros
                candidatos.
              </p>
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {THEMES.map((t) => (
                  <div key={t.id}>
                    <h3 className="mb-2 flex items-center gap-2 text-[17px]">
                      <span className={`${t.tint} flex size-8 items-center justify-center rounded-md text-charcoal`}>
                        <t.icon className="size-4" aria-hidden />
                      </span>
                      {t.label}
                    </h3>
                    <ThemeDetail candidate={candidate} a={analyzeTheme(candidate, t.id, NO_TAGS)} showName={false} />
                  </div>
                ))}
              </div>
              <SectionFeedback className="mt-6" section="candidato:plano" label="Página do candidato · propostas do plano" prompt="As propostas do plano fazem sentido para você?" candidates={[candidate.id]} />
            </section>
          </>
        )}
      </main>
    </div>
  )
}
