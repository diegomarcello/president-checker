import { useMemo, useState } from 'react'
import { CheckCircle2, Clock, FileSearch, FileText, Globe, Hourglass, ThumbsUp, XCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { CandidateAvatar } from '@/components/brand'
import { SectionFeedback } from '@/components/SectionFeedback'
import { SubPageHeader } from '@/components/SubPageHeader'
import type { Candidate, Submission, SubmissionStatus, SubmissionType } from '@/data/types'
import { STATUS_LABEL, TYPE_LABEL, formatSize, hostOf, isQueued } from '@/lib/submissions'
import { cn } from '@/lib/utils'

interface Props {
  candidates: Candidate[]
  submissions: Submission[]
  voted: Set<string>
  onVote: (id: string) => void
  initialCandidate?: string
}

const STATUS_STYLE: Record<SubmissionStatus, string> = {
  recebida: 'bg-tint-gray text-slate',
  'em-analise': 'bg-tint-sky text-[#005bab]',
  aprovada: 'bg-tint-mint text-[#0f6b22]',
  rejeitada: 'bg-tint-rose text-[#a31616]',
}

const STATUS_ICON = {
  recebida: Clock,
  'em-analise': Hourglass,
  aprovada: CheckCircle2,
  rejeitada: XCircle,
} as const

const ALL = 'all'

function Step({ n, title, text, tint }: { n: number; title: string; text: string; tint: string }) {
  return (
    <li className={cn('rounded-lg p-5 text-charcoal', tint)}>
      <span className="flex size-7 items-center justify-center rounded-full bg-white text-sm font-semibold">{n}</span>
      <h3 className="mt-3 text-[17px]">{title}</h3>
      <p className="mt-1.5 text-sm leading-relaxed">{text}</p>
    </li>
  )
}

function SubmissionCard({
  s,
  candidate,
  voted,
  position,
  onVote,
}: {
  s: Submission
  candidate: Candidate | undefined
  voted: boolean
  position?: number
  onVote: (id: string) => void
}) {
  const Icon = STATUS_ICON[s.status]
  const queued = isQueued(s)
  const promise = candidate?.mandate?.promises.find((p) => p.id === s.promiseId)

  return (
    <article className="flex flex-col gap-4 rounded-lg border border-hairline bg-white p-5 sm:flex-row sm:items-start sm:justify-between">
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          {position !== undefined && (
            <span className="rounded-sm bg-ink-deep px-2 py-0.5 text-[13px] font-semibold text-white">#{position} na fila</span>
          )}
          <span className={cn('inline-flex items-center gap-1 rounded-sm px-2 py-0.5 text-[13px] font-semibold', STATUS_STYLE[s.status])}>
            <Icon className="size-3.5" aria-hidden /> {STATUS_LABEL[s.status]}
          </span>
          <span
            className={cn(
              'rounded-sm px-2 py-0.5 text-[13px] font-semibold',
              s.type === 'correcao'
                ? 'bg-tint-peach text-brand-orange-deep'
                : s.type === 'marcacao'
                  ? 'bg-tint-sky text-[#005bab]'
                  : 'bg-tint-lavender text-brand-purple-800',
            )}
          >
            {TYPE_LABEL[s.type]}
          </span>
        </div>

        <h3 className="mt-3 text-[18px] leading-snug">{s.title}</h3>

        {candidate && (
          <a
            href={`#/candidato/${candidate.id}`}
            className="mt-2 inline-flex items-center gap-2 text-sm font-medium text-link hover:underline"
          >
            <CandidateAvatar candidate={candidate} className="size-6 text-[10px]" /> {candidate.name}
          </a>
        )}

        <p className="mt-2 text-[15px] leading-relaxed text-slate">{s.description}</p>
        {promise && <p className="mt-2 text-sm text-steel">Compromisso: {promise.text}</p>}

        <p className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-steel">
          {s.kind === 'marcacao' && s.label ? (
            <a
              href={`#/documento/${s.candidateId}/${s.promiseId ?? '_'}/${s.id}`}
              className="inline-flex items-center gap-1.5 font-medium text-link hover:underline"
            >
              <FileSearch className="size-4" aria-hidden /> Ver no documento · página {s.label.page}
            </a>
          ) : s.kind === 'site' && s.url ? (
            <a
              href={s.url}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="inline-flex items-center gap-1.5 font-medium text-link hover:underline"
            >
              <Globe className="size-4" aria-hidden /> {hostOf(s.url)}
            </a>
          ) : (
            <span className="inline-flex items-center gap-1.5 font-medium text-charcoal">
              <FileText className="size-4" aria-hidden /> {s.fileName}
              {s.fileSize ? ` · ${formatSize(s.fileSize)}` : ''}
            </span>
          )}
          <span>Enviado em {s.createdAt}</span>
          {s.decidedAt && <span>Decidido em {s.decidedAt}</span>}
        </p>

        {s.curatorNote && (
          <p
            className={cn(
              'mt-3 rounded-md p-3 text-sm',
              s.status === 'aprovada' ? 'bg-tint-mint text-[#0f6b22]' : 'bg-tint-rose text-[#7a1212]',
            )}
          >
            <strong>Nota da curadoria:</strong> {s.curatorNote}
          </p>
        )}
      </div>

      <div className="flex shrink-0 items-center gap-3 sm:flex-col sm:items-stretch">
        {queued ? (
          <Button
            variant={voted ? 'default' : 'outline'}
            size="lg"
            aria-pressed={voted}
            aria-label={`${voted ? 'Remover voto de prioridade' : 'Votar para priorizar'}: ${s.title}. ${s.votes} votos`}
            onClick={() => onVote(s.id)}
            className="min-w-[132px]"
          >
            <ThumbsUp /> {voted ? 'Priorizado' : 'Priorizar'} · {s.votes}
          </Button>
        ) : (
          <p className="text-sm text-steel sm:text-center">
            <span className="block text-xl font-semibold text-ink">{s.votes}</span> votos
          </p>
        )}
      </div>
    </article>
  )
}

export function CuratoriaPage({ candidates, submissions, voted, onVote, initialCandidate }: Props) {
  const [candidate, setCandidate] = useState(initialCandidate ?? ALL)
  const [type, setType] = useState<'all' | SubmissionType>('all')
  const [sort, setSort] = useState<'votos' | 'recentes'>('votos')
  const byId = useMemo(() => new Map(candidates.map((c) => [c.id, c])), [candidates])

  const toDate = (d: string) => d.split('/').reverse().join('')
  const compare = (a: Submission, b: Submission) =>
    sort === 'votos'
      ? b.votes - a.votes || toDate(a.createdAt).localeCompare(toDate(b.createdAt))
      : toDate(b.createdAt).localeCompare(toDate(a.createdAt)) || b.votes - a.votes

  // Queue positions always follow votes across the whole queue, whatever the filters.
  const positions = useMemo(() => {
    const ranked = submissions
      .filter(isQueued)
      .slice()
      .sort((a, b) => b.votes - a.votes || toDate(a.createdAt).localeCompare(toDate(b.createdAt)))
    return new Map(ranked.map((s, i) => [s.id, i + 1]))
  }, [submissions])

  const filtered = submissions
    .filter((s) => candidate === ALL || s.candidateId === candidate)
    .filter((s) => type === 'all' || s.type === type)
  const queue = filtered.filter(isQueued).sort(compare)
  const decided = filtered.filter((s) => !isQueued(s)).sort(compare)

  const count = (status: SubmissionStatus) => submissions.filter((s) => s.status === status).length

  return (
    <div className="min-h-screen bg-white">
      <SubPageHeader />
      <main className="mx-auto max-w-[1280px] px-4 py-10 sm:px-8 sm:py-14">
        <p className="text-micro-caps text-link">Curadoria</p>
        <h1 className="text-display mt-3 max-w-3xl">Acompanhe o que entra nos perfis e ajude a priorizar</h1>
        <p className="mt-4 max-w-2xl text-lg text-slate">
          Qualquer pessoa pode enviar um site ou arquivo com informações adicionais ou correções. Aqui você vê tudo o que
          foi enviado, vota no que deve ser analisado antes e acompanha a decisão da curadoria.
        </p>

        <ol className="mt-8 grid gap-3 md:grid-cols-3">
          <Step n={1} tint="bg-tint-peach" title="Envio" text="Na página de um candidato, o botão &quot;Enviar informação ou correção&quot; coloca a contribuição na fila." />
          <Step n={2} tint="bg-tint-sky" title="Votação" text="Todos podem priorizar. Os votos definem apenas a ordem da fila, nunca o conteúdo nem a decisão." />
          <Step n={3} tint="bg-tint-mint" title="Decisão" text="A curadoria aprova ou rejeita com os mesmos critérios para todos e registra o motivo. O aprovado é incluído no perfil." />
        </ol>

        <div
          className="mt-8 grid grid-cols-2 gap-y-6 rounded-lg border border-hairline bg-surface py-6 sm:grid-cols-4"
          role="group"
          aria-label="Resumo da curadoria"
        >
          {(
            [
              ['recebida', 'recebidas', 'text-slate'],
              ['em-analise', 'em análise', 'text-link'],
              ['aprovada', 'aprovadas e incluídas', 'text-success'],
              ['rejeitada', 'rejeitadas', 'text-danger'],
            ] as const
          ).map(([st, label, color]) => (
            <div key={st} className="px-4 text-center">
              <p className={cn('text-3xl font-semibold', color)}>{count(st)}</p>
              <p className="mt-1 text-sm text-slate">{label}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-col gap-3 lg:flex-row lg:items-center">
          <Select value={candidate} onValueChange={setCandidate}>
            <SelectTrigger className="h-11 w-full lg:w-72" aria-label="Filtrar por candidato">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>Todos os candidatos</SelectItem>
              {candidates
                .filter((c) => c.origin === 'catalogo')
                .map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
          <ToggleGroup
            type="single"
            variant="outline"
            value={type}
            onValueChange={(v) => v && setType(v as 'all' | SubmissionType)}
            aria-label="Filtrar por tipo"
            className="flex-wrap"
          >
            {[
              ['all', 'Todos'],
              ['informacao', 'Informações'],
              ['correcao', 'Correções'],
              ['marcacao', 'Marcações'],
            ].map(([v, l]) => (
              <ToggleGroupItem key={v} value={v} className="h-11 px-4 data-[state=on]:bg-ink-deep data-[state=on]:text-white">
                {l}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
          <Select value={sort} onValueChange={(v) => setSort(v as 'votos' | 'recentes')}>
            <SelectTrigger className="h-11 w-full lg:ml-auto lg:w-56" aria-label="Ordenar">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="votos">Mais votadas</SelectItem>
              <SelectItem value="recentes">Mais recentes</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Tabs defaultValue="fila" className="mt-8 gap-6">
          <TabsList variant="line" className="h-auto w-full justify-start gap-6 overflow-x-auto border-b border-hairline p-0">
            {[
              ['fila', `Fila de curadoria (${queue.length})`],
              ['decididas', `Decididas (${decided.length})`],
            ].map(([v, l]) => (
              <TabsTrigger
                key={v}
                value={v}
                className="h-auto flex-none rounded-none px-1 py-3 text-[15px] font-medium whitespace-nowrap text-steel after:bg-ink group-data-[orientation=horizontal]/tabs:after:bottom-[-1px] data-[state=active]:font-semibold data-[state=active]:text-ink"
              >
                {l}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="fila" className="space-y-4">
            <p className="text-sm text-steel">
              A ordem segue os votos da comunidade. Em caso de empate, vale a ordem de envio. Um voto por pessoa em cada
              contribuição.
            </p>
            {queue.map((s) => (
              <SubmissionCard
                key={s.id}
                s={s}
                candidate={byId.get(s.candidateId)}
                voted={voted.has(s.id)}
                position={positions.get(s.id)}
                onVote={onVote}
              />
            ))}
            {queue.length === 0 && (
              <p className="rounded-lg bg-surface p-8 text-center text-slate">
                Nada na fila com esses filtros. Que tal enviar uma contribuição na página de um candidato?
              </p>
            )}
          </TabsContent>

          <TabsContent value="decididas" className="space-y-4">
            {decided.map((s) => (
              <SubmissionCard key={s.id} s={s} candidate={byId.get(s.candidateId)} voted={false} onVote={onVote} />
            ))}
            {decided.length === 0 && (
              <p className="rounded-lg bg-surface p-8 text-center text-slate">Nenhuma contribuição decidida com esses filtros.</p>
            )}
          </TabsContent>
        </Tabs>

        <SectionFeedback className="mt-10" section="curadoria:fila" label="Curadoria · fila e votação" prompt="A fila de curadoria faz sentido para você?" />

        <p className="mt-6 text-sm text-steel">
          Protótipo: contribuições e votos ficam só nesta sessão do navegador e os dados são fictícios. No produto real, as
          decisões seguem os critérios públicos de neutralidade e transparência.
        </p>
      </main>
    </div>
  )
}
