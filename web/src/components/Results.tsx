import { useEffect, useMemo, useState } from 'react'
import {
  ArrowDown,
  ArrowUp,
  CircleCheck,
  CircleX,
  FileText,
  Info,
  SlidersHorizontal,
  TriangleAlert,
  UserRound,
} from 'lucide-react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AdequacyRadar, ConcretenessBars, RiskDistribution } from '@/components/Charts'
import { CandidateAvatar, OriginSeal, RiskBadge } from '@/components/brand'
import { MandateHistory } from '@/components/MandateHistory'
import { SectionFeedback } from '@/components/SectionFeedback'
import { THEMES } from '@/data/themes'
import { UF_BY_SIGLA } from '@/data/ufs'
import type { Candidate, Profile, RiskLevel, Tag, ThemeId, Weight } from '@/data/types'
import {
  LEVEL_COLOR,
  LEVEL_LABEL,
  analyzeCandidate,
  levelCounts,
  type CandidateAnalysis,
  type ThemeAnalysis,
} from '@/lib/analysis'
import { FAIXAS_RENDA, WEIGHT_LABEL } from '@/lib/profile'
import { logEvent } from '@/lib/usageLog'
import { cn } from '@/lib/utils'

interface Props {
  chosen: Candidate[]
  tags: Set<Tag>
  profile: Profile
  profileFilled: boolean
  weights: Record<ThemeId, Weight>
  onRemove: (id: string) => void
  onEditProfile: () => void
}

function profileSummary(p: Profile): string[] {
  const out: string[] = []
  if (p.uf) out.push(p.municipio ? `${p.municipio}, ${p.uf}` : UF_BY_SIGLA[p.uf].nome)
  if (p.faixaEtaria) out.push(`${p.faixaEtaria} anos`)
  if (p.vinculo) out.push(p.vinculo === 'clt' ? 'CLT' : p.vinculo[0].toUpperCase() + p.vinculo.slice(1))
  if (p.rendaAtual !== null) out.push(`Hoje: ${FAIXAS_RENDA[p.rendaAtual]}`)
  if (p.rendaFutura !== null) out.push(`Em 5 anos: ${FAIXAS_RENDA[p.rendaFutura]}`)
  return out
}

function StackedLevels({ counts }: { counts: Record<RiskLevel, number> }) {
  const total = Object.values(counts).reduce((a, b) => a + b, 0) || 1
  return (
    <div>
      <div
        className="flex h-2.5 overflow-hidden rounded-full bg-surface"
        role="img"
        aria-label={(Object.keys(counts) as RiskLevel[])
          .filter((l) => counts[l] > 0)
          .map((l) => `${counts[l]} ${LEVEL_LABEL[l].toLowerCase()}`)
          .join(', ')}
      >
        {(Object.keys(counts) as RiskLevel[]).map(
          (l) =>
            counts[l] > 0 && (
              <span key={l} style={{ width: `${(counts[l] / total) * 100}%`, backgroundColor: LEVEL_COLOR[l] }} />
            ),
        )}
      </div>
      <p className="mt-2 text-xs text-steel">
        {counts.baixo} baixo · {counts.medio} médio · {counts.alto} alto
        {counts.lacuna > 0 && ` · ${counts.lacuna} lacuna`}
      </p>
    </div>
  )
}

function Cite({ page }: { page: number }) {
  return (
    <span
      className="ml-1 inline-flex items-center gap-0.5 rounded-sm bg-surface px-1.5 py-px align-baseline text-xs font-medium whitespace-nowrap text-link"
      title={`Trecho na página ${page} do plano (abrir o PDF: em breve)`}
    >
      <FileText className="size-3" aria-hidden /> p. {page}
    </span>
  )
}

export function ThemeDetail({
  candidate,
  a,
  showName = true,
}: {
  candidate: Candidate
  a: ThemeAnalysis
  showName?: boolean
}) {
  return (
    <div className="rounded-lg border border-hairline bg-white p-4">
      <div className={cn('items-center gap-2 md:hidden', showName ? 'flex' : 'hidden')}>
        <CandidateAvatar candidate={candidate} className="size-7 text-[11px]" />
        <span className="text-sm font-semibold">{candidate.name}</span>
      </div>
      <div className={cn('flex items-center gap-2', showName ? 'mt-3 md:mt-0' : '')}>
        <RiskBadge level={a.level} />
        {a.risk !== null && <span className="text-xs text-steel">índice {a.risk}/100</span>}
      </div>

      {a.level === 'lacuna' ? (
        <p className="mt-3 flex gap-2 text-sm text-slate">
          <TriangleAlert className="mt-0.5 size-4 shrink-0 text-warning" aria-hidden />
          O plano não aborda este tema. Se ele é relevante para você, isso é uma lacuna.
        </p>
      ) : (
        <>
          <div className="mt-4 space-y-2 text-xs text-slate">
            <div>
              <div className="mb-1 flex justify-between">
                <span>Concretude</span>
                <span className="font-semibold">{a.concreteness}</span>
              </div>
              <Progress value={a.concreteness} className="h-1.5" aria-label={`Concretude ${a.concreteness} de 100`} />
            </div>
            <div>
              <div className="mb-1 flex justify-between">
                <span>Viabilidade</span>
                <span className="font-semibold">{a.viability}</span>
              </div>
              <Progress value={a.viability} className="h-1.5" aria-label={`Viabilidade ${a.viability} de 100`} />
            </div>
          </div>

          <h4 className="text-micro-caps mt-4 text-success">Pontos fortes</h4>
          <ul className="mt-1.5 space-y-1.5 text-sm">
            {a.strengths.map((s) => (
              <li key={s.text} className="flex gap-2">
                <CircleCheck className="mt-0.5 size-4 shrink-0 text-success" aria-hidden />
                <span>
                  {s.text}
                  <Cite page={s.page} />
                </span>
              </li>
            ))}
          </ul>

          <h4 className="text-micro-caps mt-4 text-danger">Pontos fracos</h4>
          <ul className="mt-1.5 space-y-1.5 text-sm">
            {a.weaknesses.map((s) => (
              <li key={s.text} className="flex gap-2">
                <CircleX className="mt-0.5 size-4 shrink-0 text-danger" aria-hidden />
                <span>
                  {s.text}
                  <Cite page={s.page} />
                </span>
              </li>
            ))}
          </ul>

          {a.applied.length > 0 && (
            <div className="mt-4 rounded-md bg-tint-lavender p-3">
              <h4 className="text-micro-caps flex items-center gap-1.5 text-brand-purple-800">
                <UserRound className="size-3.5" aria-hidden /> Para o seu perfil
              </h4>
              <ul className="mt-1.5 space-y-1.5 text-sm text-charcoal">
                {a.applied.map((e) => (
                  <li key={e.tag} className="flex gap-2">
                    {e.delta < 0 ? (
                      <ArrowDown className="mt-0.5 size-4 shrink-0 text-success" aria-label="reduz o risco" />
                    ) : (
                      <ArrowUp className="mt-0.5 size-4 shrink-0 text-danger" aria-label="aumenta o risco" />
                    )}
                    <span>
                      {e.note}
                      {e.page > 0 && <Cite page={e.page} />}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export function Results({ chosen, tags, profile, profileFilled, weights, onRemove, onEditProfile }: Props) {
  const [highlight, setHighlight] = useState(true)
  const [hideSimilar, setHideSimilar] = useState(false)
  const [open, setOpen] = useState<string[]>([])
  const [tab, setTab] = useState('mapa')
  const chosenKey = chosen.map((c) => c.id).join(',')

  // What is being compared (recorded only with the visitor's navigation consent).
  useEffect(() => {
    logEvent({ type: 'compare', candidates: chosenKey.split(',').filter(Boolean) })
    logEvent({ type: 'tab', tab: 'mapa' })
  }, [chosenKey])

  const changeTab = (v: string) => {
    setTab(v)
    logEvent({ type: 'tab', tab: v })
  }

  const changeOpen = (next: string[]) => {
    for (const id of next) if (!open.includes(id)) logEvent({ type: 'theme_open', theme: id as ThemeId })
    setOpen(next)
  }

  const analyses = useMemo(
    () => chosen.map((c) => ({ c, a: analyzeCandidate(c, tags) })) as { c: Candidate; a: CandidateAnalysis }[],
    [chosen, tags],
  )

  const relevant = useMemo(
    () =>
      THEMES.filter((t) => weights[t.id] > 0).sort((x, y) => weights[y.id] - weights[x.id]),
    [weights],
  )
  const chartThemes = relevant.length >= 3 ? relevant : THEMES

  const rows = relevant.map((t) => {
    const levels = analyses.map(({ a }) => a[t.id].level)
    return { theme: t, diverges: new Set(levels).size > 1 }
  })
  const visibleRows = hideSimilar ? rows.filter((r) => r.diverges) : rows

  const radarData = chartThemes.map((t) => ({
    tema: t.short,
    ...Object.fromEntries(analyses.map(({ c, a }) => [c.id, a[t.id].adequacy])),
  }))
  const barData = chartThemes.map((t) => ({
    tema: t.short,
    ...Object.fromEntries(analyses.map(({ c, a }) => [c.id, a[t.id].concreteness])),
  }))
  const distData = analyses.map(({ c, a }) => ({
    name: c.name.split(' ')[0],
    ...levelCounts(a, weights),
  }))

  const cols = `minmax(0,1fr) repeat(${analyses.length}, minmax(0,1fr))`
  const summary = profileSummary(profile)

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-3 rounded-lg bg-surface p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
        <div className="flex items-start gap-3">
          <UserRound className="mt-0.5 size-5 shrink-0 text-steel" aria-hidden />
          <div>
            <p className="font-semibold">
              {profileFilled ? 'Comparação personalizada' : 'Comparação geral (sem perfil)'}
            </p>
            <p className="text-sm text-slate">
              {profileFilled
                ? summary.length > 0
                  ? summary.join(' · ')
                  : 'Com base nas suas respostas'
                : 'Informe o seu contexto para ver como cada candidato afeta você.'}
            </p>
          </div>
        </div>
        <Button variant="outline" onClick={onEditProfile} className="self-start sm:self-auto">
          <SlidersHorizontal /> {profileFilled ? 'Editar perfil e prioridades' : 'Personalizar'}
        </Button>
      </div>

      <div
        className="grid gap-4"
        style={{ gridTemplateColumns: `repeat(auto-fit, minmax(${analyses.length > 3 ? 220 : 260}px, 1fr))` }}
      >
        {analyses.map(({ c, a }) => (
          <Card key={c.id} className="gap-4 rounded-lg p-5 shadow-none">
            <div className="flex items-start justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <CandidateAvatar candidate={c} />
                <div className="min-w-0">
                  <p className="truncate font-semibold">{c.name}</p>
                  <p className="truncate text-sm text-steel">{c.partyName}</p>
                </div>
              </div>
              <Button variant="ghost" size="xs" onClick={() => onRemove(c.id)} aria-label={`Remover ${c.name}`}>
                Remover
              </Button>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <OriginSeal origin={c.origin} />
              <span className="text-xs text-steel">
                Plano {c.planVersion} · {c.planDate}
              </span>
            </div>
            <StackedLevels counts={levelCounts(a, weights)} />
          </Card>
        ))}
      </div>

      {new Set(chosen.map((c) => c.type)).size > 1 && (
        <p className="flex items-start gap-2 rounded-md bg-tint-yellow p-3 text-sm text-charcoal" role="note">
          <TriangleAlert className="mt-0.5 size-4 shrink-0" aria-hidden />
          Você está comparando candidatos a cargos diferentes. As competências e as promessas de cada cargo são distintas,
          então compare com cuidado.
        </p>
      )}

      {chosen.some((c) => c.origin === 'enviado') && (
        <p className="flex items-start gap-2 rounded-md bg-tint-peach p-3 text-sm text-brand-orange-deep" role="note">
          <TriangleAlert className="mt-0.5 size-4 shrink-0" aria-hidden />
          Planos enviados por você não foram verificados pela curadoria. Neste protótipo, a análise deles é simulada.
        </p>
      )}

      <Tabs value={tab} onValueChange={changeTab} className="gap-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <TabsList variant="line" className="h-auto w-full justify-start gap-5 overflow-x-auto border-b border-hairline p-0 sm:gap-6 lg:w-auto lg:border-b-0">
            {[
              { v: 'mapa', l: 'Mapa de risco' },
              { v: 'graficos', l: 'Gráficos' },
              { v: 'historico', l: 'Histórico' },
            ].map((t) => (
              <TabsTrigger
                key={t.v}
                value={t.v}
                className="h-auto flex-none rounded-none px-1 py-3 text-[15px] font-medium text-steel after:bg-ink group-data-[orientation=horizontal]/tabs:after:bottom-[-1px] data-[state=active]:font-semibold data-[state=active]:text-ink"
              >
                {t.l}
              </TabsTrigger>
            ))}
          </TabsList>
          <div className={cn('flex flex-wrap gap-x-6 gap-y-3', tab !== 'mapa' && 'hidden')}>
            <div className="flex items-center gap-2">
              <Switch id="destacar" checked={highlight} onCheckedChange={setHighlight} />
              <Label htmlFor="destacar" className="text-sm">
                Destacar diferenças
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <Switch id="ocultar" checked={hideSimilar} onCheckedChange={setHideSimilar} />
              <Label htmlFor="ocultar" className="text-sm">
                Ocultar semelhanças
              </Label>
            </div>
          </div>
        </div>

        <TabsContent value="mapa" className="space-y-3">
          <div className="hidden items-end gap-4 px-4 pb-1 text-sm md:grid" style={{ gridTemplateColumns: cols }}>
            <span className="text-micro-caps text-steel">Tema (relevância)</span>
            {analyses.map(({ c }) => (
              <span key={c.id} className="flex items-center gap-2 font-semibold">
                <CandidateAvatar candidate={c} className="size-6 text-[10px]" />
                <span className="truncate">{c.name}</span>
              </span>
            ))}
          </div>

          {visibleRows.length === 0 ? (
            <p className="rounded-lg bg-surface p-6 text-center text-slate">
              Nenhuma divergência nos temas selecionados: os candidatos ficaram no mesmo nível de risco em todos.
            </p>
          ) : (
            <Accordion
              type="multiple"
              value={open}
              onValueChange={changeOpen}
              className="overflow-hidden rounded-lg border border-hairline bg-white"
            >
              {visibleRows.map(({ theme, diverges }) => (
                <AccordionItem key={theme.id} value={theme.id} className="border-hairline-soft">
                  <AccordionTrigger
                    className={cn(
                      'items-center px-4 py-4 hover:no-underline',
                      highlight && diverges && 'border-l-4 border-l-primary pl-3',
                    )}
                  >
                    <div className="grid flex-1 items-center gap-x-4 gap-y-3 md:[grid-template-columns:var(--cols)]" style={{ ['--cols' as string]: cols }}>
                      <div className="flex items-center gap-3">
                        <span className={cn('flex size-9 shrink-0 items-center justify-center rounded-md text-charcoal', theme.tint)}>
                          <theme.icon className="size-[18px]" aria-hidden />
                        </span>
                        <div>
                          <p className="text-[15px] font-semibold">{theme.label}</p>
                          <p className="text-xs font-normal text-steel">
                            Relevância {WEIGHT_LABEL[weights[theme.id]].toLowerCase()}
                            {highlight && diverges && (
                              <span className="ml-2 rounded-sm bg-tint-lavender px-1.5 py-0.5 font-semibold text-brand-purple-800">
                                Diverge
                              </span>
                            )}
                          </p>
                        </div>
                      </div>
                      {analyses.map(({ c, a }) => (
                        <div key={c.id} className="flex items-center gap-2">
                          <CandidateAvatar candidate={c} className="size-6 text-[10px] md:hidden" />
                          <RiskBadge level={a[theme.id].level} short />
                        </div>
                      ))}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="bg-surface-soft px-4 pb-5">
                    <div className="grid gap-4 md:[grid-template-columns:var(--cols)]" style={{ ['--cols' as string]: cols }}>
                      <div className="hidden md:block">
                        <p className="text-sm text-slate">{theme.description}</p>
                        <p className="mt-3 flex gap-1.5 text-xs text-steel">
                          <Info className="mt-0.5 size-3.5 shrink-0" aria-hidden />
                          O risco combina concretude, viabilidade e efeito sobre o seu perfil.
                        </p>
                      </div>
                      {analyses.map(({ c, a }) => (
                        <ThemeDetail key={c.id} candidate={c} a={a[theme.id]} />
                      ))}
                    </div>
                    <SectionFeedback
                      className="mt-4"
                      section={`mapa:${theme.id}`}
                      label={`Mapa de risco · ${theme.label}`}
                      prompt={`A análise de ${theme.short} faz sentido para você?`}
                      candidates={chosen.map((c) => c.id)}
                      theme={theme.id}
                    />
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
          <SectionFeedback
            section="mapa:geral"
            label="Mapa de risco · visão geral"
            prompt="O mapa de risco, no geral, faz sentido para você?"
            candidates={chosen.map((c) => c.id)}
          />
          <p className="text-sm text-steel">
            Não existe nota final nem ranking: a leitura e a decisão são suas. Candidatos em ordem de escolha.
          </p>
        </TabsContent>

        <TabsContent value="historico">
          <MandateHistory chosen={chosen} />
          <SectionFeedback
            className="mt-6"
            section="historico:comparacao"
            label="Histórico de mandato · comparação"
            prompt="O histórico de mandato faz sentido para você?"
            candidates={chosen.map((c) => c.id)}
          />
        </TabsContent>

        <TabsContent value="graficos" className="grid gap-6 lg:grid-cols-2">
          <Card className="gap-4 rounded-lg p-5 shadow-none sm:p-6">
            <CardHeader className="p-0">
              <CardTitle className="text-lg">Adequação ao seu perfil por tema</CardTitle>
              <CardDescription>Quanto maior, menor o risco. Lacunas valem zero. Não é uma nota geral.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <AdequacyRadar candidates={chosen} data={radarData} />
              <SectionFeedback className="mt-4" section="grafico:radar" label="Gráfico · adequação ao perfil" prompt="Este gráfico faz sentido?" candidates={chosen.map((c) => c.id)} />
            </CardContent>
          </Card>
          <Card className="gap-4 rounded-lg p-5 shadow-none sm:p-6">
            <CardHeader className="p-0">
              <CardTitle className="text-lg">Concretude das propostas</CardTitle>
              <CardDescription>Presença de meta, prazo, público e fonte de recursos (0 a 100).</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <ConcretenessBars candidates={chosen} data={barData} />
              <SectionFeedback className="mt-4" section="grafico:concretude" label="Gráfico · concretude das propostas" prompt="Este gráfico faz sentido?" candidates={chosen.map((c) => c.id)} />
            </CardContent>
          </Card>
          <Card className="gap-4 rounded-lg bg-tint-cream p-5 shadow-none sm:p-6 lg:col-span-2">
            <CardHeader className="p-0">
              <CardTitle className="text-lg">Distribuição do risco nos temas que importam para você</CardTitle>
              <CardDescription>Quantos temas de cada candidato ficaram em cada nível.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <RiskDistribution data={distData} />
              <SectionFeedback className="mt-4" section="grafico:distribuicao" label="Gráfico · distribuição do risco" prompt="Este gráfico faz sentido?" candidates={chosen.map((c) => c.id)} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
