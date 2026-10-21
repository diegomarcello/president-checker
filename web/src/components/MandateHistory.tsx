import { useState } from 'react'
import { CircleCheck, CircleDashed, FileText, Info, LoaderCircle } from 'lucide-react'
import { Progress } from '@/components/ui/progress'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { CandidateAvatar, MandateBadge } from '@/components/brand'
import { THEME_BY_ID } from '@/data/themes'
import type { Candidate, CampaignPromise, Mandate, PromiseStatus } from '@/data/types'
import { STATUS_COLOR, STATUS_ORDER, plural, statusCounts, statusLabel } from '@/lib/mandate'
import { cn } from '@/lib/utils'

type Filter = 'todos' | PromiseStatus

const FILTERS: { value: Filter; label: string }[] = [
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

const STATUS_ICON = {
  concluida: CircleCheck,
  andamento: LoaderCircle,
  pendente: CircleDashed,
} as const

function PromiseItem({ promise, mandate, candidateId }: { promise: CampaignPromise; mandate: Mandate; candidateId: string }) {
  const theme = THEME_BY_ID[promise.theme]
  const Icon = STATUS_ICON[promise.status]
  return (
    <li className="rounded-md border border-hairline bg-white p-3">
      <div className="flex flex-wrap items-center gap-2">
        <span
          className={cn(
            'inline-flex items-center gap-1 rounded-sm px-2 py-0.5 text-[13px] font-semibold',
            STATUS_STYLE[promise.status],
          )}
        >
          <Icon className="size-3.5" aria-hidden /> {statusLabel(promise.status, mandate)}
        </span>
        <span className={cn('inline-flex items-center gap-1 rounded-sm px-2 py-0.5 text-xs font-medium text-charcoal', theme.tint)}>
          <theme.icon className="size-3" aria-hidden /> {theme.short}
        </span>
      </div>
      <p className="mt-2 text-sm font-medium">{promise.text}</p>
      {promise.status === 'andamento' && promise.progress !== undefined && (
        <div className="mt-2">
          <div className="mb-1 flex justify-between text-xs text-slate">
            <span>Progresso</span>
            <span className="font-semibold">{promise.progress}%</span>
          </div>
          <Progress value={promise.progress} className="h-1.5" aria-label={`Progresso de ${promise.progress}%`} />
        </div>
      )}
      {promise.note && <p className="mt-2 text-[13px] text-slate">{promise.note}</p>}
      <p className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-steel">
        <a
          href={`#/documento/${candidateId}/${promise.id}`}
          className="inline-flex items-center gap-0.5 rounded-sm bg-surface px-1.5 py-px font-medium text-link hover:underline"
          title={`Abrir o plano da campanha de ${mandate.campaignYear} na página ${promise.planPage}`}
        >
          <FileText className="size-3" aria-hidden /> Plano {mandate.campaignYear} · p. {promise.planPage}
        </a>
        <span>Fonte: {promise.source}</span>
        <span>· atualizado em {promise.updatedAt}</span>
      </p>
    </li>
  )
}

function StackedStatus({ counts, total }: { counts: Record<PromiseStatus, number>; total: number }) {
  return (
    <div>
      <div
        className="flex h-2.5 overflow-hidden rounded-full bg-surface"
        role="img"
        aria-label={`${counts.concluida} concluídos, ${counts.andamento} em andamento, ${counts.pendente} pendentes`}
      >
        {STATUS_ORDER.map(
          (s) =>
            counts[s] > 0 && (
              <span key={s} style={{ width: `${(counts[s] / total) * 100}%`, backgroundColor: STATUS_COLOR[s] }} />
            ),
        )}
      </div>
      <p className="mt-2 text-xs text-steel">
        {counts.concluida} de {total} compromissos concluídos
      </p>
    </div>
  )
}

function Column({ candidate, filter }: { candidate: Candidate; filter: Filter }) {
  const mandate = candidate.mandate
  const header = (
    <div className="flex items-start gap-3">
      <CandidateAvatar candidate={candidate} />
      <div className="min-w-0">
        <p className="truncate font-semibold">{candidate.name}</p>
        <MandateBadge mandate={mandate} className="mt-1" />
      </div>
    </div>
  )

  if (!mandate) {
    return (
      <section className="rounded-lg border border-hairline bg-white p-5" aria-label={`Histórico de ${candidate.name}`}>
        {header}
        <p className="mt-4 flex gap-2 rounded-md bg-surface p-3 text-sm text-slate">
          <Info className="mt-0.5 size-4 shrink-0" aria-hidden />
          {mandate === null
            ? 'Esta pessoa não exerceu cargo eletivo antes, então não há mandato para avaliar. Isso não é bom nem ruim: use o mapa de risco para comparar as propostas.'
            : 'Planos enviados por você não têm histórico de mandato verificado.'}
        </p>
      </section>
    )
  }

  const counts = statusCounts(mandate)
  const total = mandate.promises.length
  const list = mandate.promises.filter((p) => filter === 'todos' || p.status === filter)

  return (
    <section className="rounded-lg border border-hairline bg-white p-5" aria-label={`Histórico de ${candidate.name}`}>
      {header}
      <p className="mt-3 text-sm text-slate">
        {mandate.role} · {mandate.period}
      </p>
      <p className="text-xs text-steel">Compromissos do plano da campanha de {mandate.campaignYear}</p>
      <div className="mt-4">
        <StackedStatus counts={counts} total={total} />
        <p className="mt-1 text-xs text-steel">
          {mandate.situation === 'encerrado'
            ? `${plural(counts.andamento, 'parcial', 'parciais')} · ${plural(counts.pendente, 'não entregue', 'não entregues')}`
            : `${counts.andamento} em andamento · ${plural(counts.pendente, 'pendente', 'pendentes')}`}
        </p>
      </div>
      <ul className="mt-4 space-y-3">
        {list.map((p) => (
          <PromiseItem key={p.id} promise={p} mandate={mandate} candidateId={candidate.id} />
        ))}
        {list.length === 0 && (
          <li className="rounded-md bg-surface p-3 text-sm text-slate">Nenhum compromisso nesta situação.</li>
        )}
      </ul>
    </section>
  )
}

export function MandateHistory({ chosen }: { chosen: Candidate[] }) {
  const [filter, setFilter] = useState<Filter>('todos')
  return (
    <div className="space-y-5">
      <div className="flex items-start gap-3 rounded-lg bg-tint-sky p-4 text-sm text-charcoal sm:p-5">
        <Info className="mt-0.5 size-5 shrink-0" aria-hidden />
        <p className="leading-relaxed">
          Compara o que cada político prometeu no plano da <strong>última campanha</strong> com o que consta como
          feito. Cada status cita uma fonte pública e a data da atualização. Os dados deste protótipo são fictícios.
        </p>
      </div>

      <ToggleGroup
        type="single"
        variant="outline"
        value={filter}
        onValueChange={(v) => v && setFilter(v as Filter)}
        aria-label="Filtrar compromissos por situação"
        className="flex-wrap"
      >
        {FILTERS.map((f) => (
          <ToggleGroupItem
            key={f.value}
            value={f.value}
            className="h-10 px-4 data-[state=on]:bg-ink-deep data-[state=on]:text-white"
          >
            {f.label}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>

      <div
        className="grid items-start gap-4 md:[grid-template-columns:var(--cols)]"
        style={{ ['--cols' as string]: `repeat(${chosen.length}, minmax(0, 1fr))` }}
      >
        {chosen.map((c) => (
          <Column key={c.id} candidate={c} filter={filter} />
        ))}
      </div>

      <p className="text-sm text-steel">
        Mostramos contagens e fontes, não uma nota. Quantidade e tipo de compromisso variam entre cargos (por exemplo,
        um parlamentar propõe leis; um prefeito executa obras), então compare com cuidado.
      </p>
    </div>
  )
}
