import { useMemo, useState } from 'react'
import { ArrowRight, FileSearch, GitCompareArrows, LoaderCircle, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { CandidateAvatar, MandateBadge } from '@/components/brand'
import {
  StatusByPolitician,
  StatusByTheme,
  StatusDonut,
  type NamedCounts,
} from '@/components/DashboardCharts'
import { SectionFeedback } from '@/components/SectionFeedback'
import { SubPageHeader } from '@/components/SubPageHeader'
import { OFFICES } from '@/data/offices'
import { THEMES, THEME_BY_ID } from '@/data/themes'
import type { Candidate, OfficeType, PromiseStatus } from '@/data/types'
import {
  STATUS_COLOR,
  STATUS_ORDER,
  flattenPromises,
  percent,
  plural,
  statusCounts,
  statusLabel,
  withMandate,
  type PromiseRow,
  type SituationFilter,
} from '@/lib/mandate'
import { cn } from '@/lib/utils'

interface Props {
  candidates: Candidate[]
  onOpen: (id: string) => void
  onCompare: (id: string) => void
}

const ALL = 'all'
const collator = new Intl.Collator('pt-BR')

const SITUATIONS: { value: SituationFilter; label: string }[] = [
  { value: 'em-exercicio', label: 'Em exercício' },
  { value: 'encerrado', label: 'Mandato encerrado' },
  { value: 'todos', label: 'Todos' },
]

const STATUS_FILTERS: { value: 'todos' | PromiseStatus; label: string }[] = [
  { value: 'todos', label: 'Todos' },
  { value: 'concluida', label: 'Concluídos' },
  { value: 'andamento', label: 'Em andamento' },
  { value: 'pendente', label: 'Pendentes' },
]

const STATUS_STYLE: Record<PromiseStatus, string> = {
  concluida: 'bg-tint-mint text-[#0f6b22]',
  andamento: 'bg-tint-sky text-[#005bab]',
  pendente: 'bg-tint-peach text-brand-orange-deep',
}

/** "09/2026" -> "202609", so months sort chronologically. */
const monthKey = (d: string) => d.split('/').reverse().join('')

function Kpi({ label, value, hint, color }: { label: string; value: number | string; hint?: string; color?: string }) {
  return (
    <Card className="gap-1 rounded-lg p-5 shadow-none">
      <p className="text-sm text-slate">{label}</p>
      <p className="text-[34px] leading-none font-semibold tracking-tight" style={{ color }}>
        {value}
      </p>
      {hint && <p className="mt-1 text-xs text-steel">{hint}</p>}
    </Card>
  )
}

function StatusPill({ row }: { row: PromiseRow }) {
  return (
    <span className={cn('inline-flex rounded-sm px-2 py-0.5 text-[13px] font-semibold whitespace-nowrap', STATUS_STYLE[row.promise.status])}>
      {statusLabel(row.promise.status, row.mandate)}
    </span>
  )
}

export function IncumbentsDashboard({ candidates, onOpen, onCompare }: Props) {
  const [situation, setSituation] = useState<SituationFilter>('em-exercicio')
  const [office, setOffice] = useState<'all' | OfficeType>(ALL)
  const [theme, setTheme] = useState(ALL)
  const [status, setStatus] = useState<'todos' | PromiseStatus>('todos')
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState<'nome' | 'progresso' | 'atualizacao'>('nome')

  const officesAvailable = useMemo(
    () => OFFICES.filter((o) => withMandate(candidates, situation).some((c) => c.mandate.officeType === o.value)),
    [candidates, situation],
  )

  // Politicians in scope for the situation + office filters.
  const politicians = useMemo(
    () =>
      withMandate(candidates, situation)
        .filter((c) => office === ALL || c.mandate.officeType === office)
        .sort((a, b) => collator.compare(a.name, b.name)),
    [candidates, situation, office],
  )

  // Commitments in scope (theme filter narrows the commitments, not the politicians).
  const rows = useMemo(
    () => flattenPromises(politicians).filter((r) => theme === ALL || r.promise.theme === theme),
    [politicians, theme],
  )

  const totals = useMemo(() => {
    const t = { concluida: 0, andamento: 0, pendente: 0 }
    for (const r of rows) t[r.promise.status] += 1
    return t
  }, [rows])
  const total = rows.length

  const byPolitician: NamedCounts[] = politicians
    .map((c) => {
      const mine = rows.filter((r) => r.candidate.id === c.id)
      const counts = { concluida: 0, andamento: 0, pendente: 0 }
      for (const r of mine) counts[r.promise.status] += 1
      return { name: c.name.split(' ')[0], ...counts }
    })
    .filter((d) => d.concluida + d.andamento + d.pendente > 0)

  const byTheme: NamedCounts[] = THEMES.map((t) => {
    const counts = { concluida: 0, andamento: 0, pendente: 0 }
    for (const r of rows) if (r.promise.theme === t.id) counts[r.promise.status] += 1
    return { name: t.short, ...counts }
  }).filter((d) => d.concluida + d.andamento + d.pendente > 0)

  const tableRows = useMemo(() => {
    const q = query.trim().toLowerCase()
    return rows
      .filter((r) => status === 'todos' || r.promise.status === status)
      .filter((r) => !q || r.promise.text.toLowerCase().includes(q) || r.candidate.name.toLowerCase().includes(q))
      .sort((a, b) => {
        if (sort === 'progresso') return (b.promise.progress ?? -1) - (a.promise.progress ?? -1)
        if (sort === 'atualizacao') return monthKey(b.promise.updatedAt).localeCompare(monthKey(a.promise.updatedAt))
        return collator.compare(a.candidate.name, b.candidate.name) || collator.compare(a.promise.text, b.promise.text)
      })
  }, [rows, status, query, sort])

  const changeSituation = (v: SituationFilter) => {
    setSituation(v)
    setOffice(ALL)
  }

  return (
    <div className="min-h-screen bg-surface-soft">
      <SubPageHeader />
      <main className="mx-auto max-w-[1280px] px-4 py-8 sm:px-8 sm:py-12">
        <p className="text-micro-caps text-link">Painel de análise</p>
        <h1 className="text-display mt-3">Em exercício: o que foi prometido e o que foi entregue</h1>
        <p className="mt-4 max-w-3xl text-lg text-slate">
          Acompanhe, em números, os compromissos do plano da última campanha de quem exerce ou exerceu mandato. Cada
          situação cita fonte pública e data. Contagens, não nota: cargos diferentes não são equivalentes.
        </p>

        <div className="mt-8 rounded-lg border border-hairline bg-white p-4 sm:p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:gap-6">
            <div>
              <p className="mb-2 text-sm font-medium text-charcoal" id="sit-label">
                Situação do mandato
              </p>
              <ToggleGroup
                type="single"
                variant="outline"
                value={situation}
                onValueChange={(v) => v && changeSituation(v as SituationFilter)}
                aria-labelledby="sit-label"
                className="flex-wrap"
              >
                {SITUATIONS.map((s) => (
                  <ToggleGroupItem key={s.value} value={s.value} className="h-10 px-4 data-[state=on]:bg-ink-deep data-[state=on]:text-white">
                    {s.label}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            </div>
            <div className="grid flex-1 gap-3 sm:grid-cols-2">
              <div>
                <p className="mb-2 text-sm font-medium text-charcoal">Cargo exercido</p>
                <Select value={office} onValueChange={(v) => setOffice(v as 'all' | OfficeType)}>
                  <SelectTrigger className="h-10 w-full" aria-label="Cargo exercido">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={ALL}>Todos os cargos</SelectItem>
                    {officesAvailable.map((o) => (
                      <SelectItem key={o.value} value={o.value}>
                        {o.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <p className="mb-2 text-sm font-medium text-charcoal">Tema</p>
                <Select value={theme} onValueChange={setTheme}>
                  <SelectTrigger className="h-10 w-full" aria-label="Tema">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={ALL}>Todos os temas</SelectItem>
                    {THEMES.map((t) => (
                      <SelectItem key={t.id} value={t.id}>
                        {t.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        {total === 0 ? (
          <p className="mt-8 rounded-lg bg-white p-10 text-center text-slate">
            Nenhum compromisso com esses filtros. Tente outra situação, cargo ou tema.
          </p>
        ) : (
          <>
            <section className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-5" aria-label="Indicadores">
              <Kpi label="Políticos" value={politicians.length} hint={plural(politicians.length, 'pessoa', 'pessoas')} />
              <Kpi label="Compromissos" value={total} hint="acompanhados com fonte" />
              <Kpi label="Concluídos" value={totals.concluida} hint={`${percent(totals.concluida, total)} do total`} color={STATUS_COLOR.concluida} />
              <Kpi label="Em andamento" value={totals.andamento} hint={`${percent(totals.andamento, total)} do total`} color={STATUS_COLOR.andamento} />
              <Kpi label="Pendentes" value={totals.pendente} hint={`${percent(totals.pendente, total)} do total`} color={STATUS_COLOR.pendente} />
            </section>

            <section className="mt-6 grid gap-4 xl:grid-cols-3" aria-label="Gráficos">
              <Card className="gap-4 rounded-lg p-5 shadow-none sm:p-6 xl:col-span-2">
                <CardHeader className="p-0">
                  <CardTitle className="text-lg">Compromissos por político</CardTitle>
                  <CardDescription>Quantos estão concluídos, em andamento e pendentes. Ordem alfabética.</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <StatusByPolitician data={byPolitician} />
                </CardContent>
              </Card>
              <Card className="gap-4 rounded-lg p-5 shadow-none sm:p-6">
                <CardHeader className="p-0">
                  <CardTitle className="text-lg">Visão geral</CardTitle>
                  <CardDescription>Participação de cada situação no total.</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <StatusDonut counts={totals} total={total} />
                </CardContent>
              </Card>
              <Card className="gap-4 rounded-lg p-5 shadow-none sm:p-6 xl:col-span-3">
                <CardHeader className="p-0">
                  <CardTitle className="text-lg">Compromissos por tema</CardTitle>
                  <CardDescription>Em quais áreas se concentram as promessas e o que já foi entregue.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 p-0">
                  <StatusByTheme data={byTheme} />
                  <SectionFeedback section="painel:graficos" label="Painel em exercício · gráficos" prompt="Os gráficos fazem sentido para você?" />
                </CardContent>
              </Card>
            </section>

            <section className="mt-10" aria-labelledby="pol-title">
              <h2 id="pol-title" className="text-h2">
                Políticos
              </h2>
              <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {politicians.map((c) => {
                  const m = c.mandate
                  const counts = statusCounts(m)
                  const n = m.promises.length
                  const doing = m.promises
                    .filter((p) => p.status === 'andamento')
                    .sort((a, b) => (b.progress ?? 0) - (a.progress ?? 0))
                    .slice(0, 2)
                  return (
                    <article key={c.id} className="flex flex-col rounded-lg border border-hairline bg-white p-5">
                      <div className="flex items-start gap-3">
                        <CandidateAvatar candidate={c} />
                        <div className="min-w-0">
                          <h3 className="truncate text-[17px] leading-snug">{c.name}</h3>
                          <p className="truncate text-sm text-steel">{c.partyName} ({c.party})</p>
                        </div>
                      </div>
                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        <MandateBadge mandate={m} />
                        <span className="text-sm text-slate">{m.role} · {m.period}</span>
                      </div>
                      <div className="mt-4">
                        <div
                          className="flex h-2.5 overflow-hidden rounded-full bg-surface"
                          role="img"
                          aria-label={`${counts.concluida} concluídos, ${counts.andamento} em andamento, ${counts.pendente} pendentes`}
                        >
                          {STATUS_ORDER.map((s) => counts[s] > 0 && <span key={s} style={{ width: `${(counts[s] / n) * 100}%`, backgroundColor: STATUS_COLOR[s] }} />)}
                        </div>
                        <p className="mt-2 text-sm text-slate">
                          <strong className="text-ink">{counts.concluida} de {n}</strong> concluídos · {counts.andamento}{' '}
                          {m.situation === 'encerrado' ? 'parciais' : 'em andamento'} · {plural(counts.pendente, 'pendente', 'pendentes')}
                        </p>
                      </div>
                      {doing.length > 0 && (
                        <div className="mt-4">
                          <h4 className="text-micro-caps flex items-center gap-1.5 text-link">
                            <LoaderCircle className="size-3.5" aria-hidden /> {m.situation === 'encerrado' ? 'Entrega parcial' : 'Fazendo agora'}
                          </h4>
                          <ul className="mt-2 space-y-2.5">
                            {doing.map((p) => (
                              <li key={p.id}>
                                <div className="flex items-baseline justify-between gap-3 text-sm">
                                  <span className="font-medium">{p.text}</span>
                                  <span className="shrink-0 font-semibold text-slate">{p.progress}%</span>
                                </div>
                                <Progress value={p.progress ?? 0} className="mt-1 h-1.5" aria-label={`Progresso de ${p.progress}%`} />
                                <p className="mt-0.5 flex flex-wrap items-center gap-x-3 text-xs text-steel">
                                  {THEME_BY_ID[p.theme].label}
                                  <a href={`#/documento/${c.id}/${p.id}`} className="inline-flex items-center gap-1 font-medium text-link hover:underline">
                                    <FileSearch className="size-3" aria-hidden /> Ver no plano · p. {p.planPage}
                                  </a>
                                </p>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      <div className="mt-5 flex flex-col gap-2 sm:flex-row">
                        <Button className="sm:flex-1" onClick={() => onOpen(c.id)}>
                          Ver dados de {c.name.split(' ')[0]} <ArrowRight />
                        </Button>
                        <Button variant="outline" onClick={() => onCompare(c.id)}>
                          <GitCompareArrows /> Comparar
                        </Button>
                      </div>
                    </article>
                  )
                })}
              </div>
            </section>

            <section className="mt-10" aria-labelledby="tab-title">
              <h2 id="tab-title" className="text-h2">
                Todos os compromissos
              </h2>
              <div className="mt-4 flex flex-col gap-3 lg:flex-row lg:items-center">
                <div className="relative lg:w-80">
                  <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-steel" aria-hidden />
                  <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Buscar compromisso ou político" aria-label="Buscar compromisso ou político" className="h-10 bg-white pl-9" />
                </div>
                <ToggleGroup type="single" variant="outline" value={status} onValueChange={(v) => v && setStatus(v as 'todos' | PromiseStatus)} aria-label="Filtrar por situação" className="flex-wrap">
                  {STATUS_FILTERS.map((s) => (
                    <ToggleGroupItem key={s.value} value={s.value} className="h-10 px-4 data-[state=on]:bg-ink-deep data-[state=on]:text-white">
                      {s.label}
                    </ToggleGroupItem>
                  ))}
                </ToggleGroup>
                <Select value={sort} onValueChange={(v) => setSort(v as typeof sort)}>
                  <SelectTrigger className="h-10 w-full bg-white lg:ml-auto lg:w-56" aria-label="Ordenar">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="nome">Ordem alfabética</SelectItem>
                    <SelectItem value="progresso">Maior progresso</SelectItem>
                    <SelectItem value="atualizacao">Atualização mais recente</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Desktop: table */}
              <div className="mt-4 hidden overflow-hidden rounded-lg border border-hairline bg-white md:block">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Político</TableHead>
                      <TableHead>Compromisso</TableHead>
                      <TableHead>Tema</TableHead>
                      <TableHead>Situação</TableHead>
                      <TableHead className="w-36">Progresso</TableHead>
                      <TableHead>Fonte</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tableRows.map((r) => (
                      <TableRow key={r.promise.id}>
                        <TableCell className="align-top">
                          <a href={`#/candidato/${r.candidate.id}`} className="flex items-center gap-2 font-medium text-link hover:underline">
                            <CandidateAvatar candidate={r.candidate} className="size-7 text-[11px]" /> {r.candidate.name}
                          </a>
                          <p className="mt-0.5 pl-9 text-xs text-steel">{r.mandate.role}</p>
                        </TableCell>
                        <TableCell className="max-w-xs align-top whitespace-normal">
                          <p className="font-medium">{r.promise.text}</p>
                          {r.promise.note && <p className="mt-0.5 text-xs text-slate">{r.promise.note}</p>}
                          <a href={`#/documento/${r.candidate.id}/${r.promise.id}`} className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-link hover:underline">
                            <FileSearch className="size-3" aria-hidden /> Ver no plano · p. {r.promise.planPage}
                          </a>
                        </TableCell>
                        <TableCell className="align-top">{THEME_BY_ID[r.promise.theme].short}</TableCell>
                        <TableCell className="align-top"><StatusPill row={r} /></TableCell>
                        <TableCell className="align-top">
                          {r.promise.status === 'andamento' && r.promise.progress !== undefined ? (
                            <div>
                              <span className="text-xs font-semibold text-slate">{r.promise.progress}%</span>
                              <Progress value={r.promise.progress} className="mt-1 h-1.5" aria-label={`Progresso de ${r.promise.progress}%`} />
                            </div>
                          ) : (
                            <span className="text-steel">{r.promise.status === 'concluida' ? '100%' : '—'}</span>
                          )}
                        </TableCell>
                        <TableCell className="max-w-[220px] align-top whitespace-normal text-xs text-steel">
                          {r.promise.source}
                          <span className="block">atualizado em {r.promise.updatedAt}</span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile: cards */}
              <ul className="mt-4 space-y-3 md:hidden">
                {tableRows.map((r) => (
                  <li key={r.promise.id} className="rounded-lg border border-hairline bg-white p-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <StatusPill row={r} />
                      <span className="text-xs text-steel">{THEME_BY_ID[r.promise.theme].short}</span>
                    </div>
                    <p className="mt-2 font-medium">{r.promise.text}</p>
                    {r.promise.status === 'andamento' && r.promise.progress !== undefined && (
                      <Progress value={r.promise.progress} className="mt-2 h-1.5" aria-label={`Progresso de ${r.promise.progress}%`} />
                    )}
                    <a href={`#/candidato/${r.candidate.id}`} className="mt-2 inline-flex items-center gap-2 text-sm font-medium text-link">
                      <CandidateAvatar candidate={r.candidate} className="size-6 text-[10px]" /> {r.candidate.name}
                    </a>
                    <a href={`#/documento/${r.candidate.id}/${r.promise.id}`} className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-link">
                      <FileSearch className="size-4" aria-hidden /> Ver no plano · p. {r.promise.planPage}
                    </a>
                    <p className="mt-1 text-xs text-steel">{r.promise.source} · atualizado em {r.promise.updatedAt}</p>
                  </li>
                ))}
              </ul>

              {tableRows.length === 0 && (
                <p className="mt-4 rounded-lg bg-white p-8 text-center text-slate">Nenhum compromisso com esses filtros.</p>
              )}
              <p className="mt-3 text-sm text-steel" role="status">
                {tableRows.length} de {total} compromissos.
              </p>
              <SectionFeedback className="mt-4" section="painel:tabela" label="Painel em exercício · compromissos" prompt="A tabela de compromissos faz sentido para você?" />
            </section>
          </>
        )}

        <p className="mt-10 text-sm text-steel">
          Dados fictícios de demonstração. No produto real, cada situação seria confirmada em fonte pública e revisada
          pela curadoria. Para corrigir algo, envie uma fonte na página do político.
        </p>
      </main>
    </div>
  )
}
