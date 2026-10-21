import { useMemo, useState } from 'react'
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  FileSearch,
  MousePointer2,
  Plus,
  ThumbsUp,
  Minus,
  X,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { LabelDialog } from '@/components/LabelDialog'
import { PlanPageView, type Annotation } from '@/components/PlanPageView'
import { SectionFeedback } from '@/components/SectionFeedback'
import { SubPageHeader } from '@/components/SubPageHeader'
import { THEME_BY_ID } from '@/data/themes'
import type { Candidate, CampaignPromise, Mandate, PageBox, PromiseStatus, Submission } from '@/data/types'
import { statusLabel } from '@/lib/mandate'
import { PAGE_H, PAGE_W, boxesOverlap, buildPage, pageCount, promiseLocation } from '@/lib/planDocument'
import { isQueued } from '@/lib/submissions'
import { cn } from '@/lib/utils'

interface Props {
  candidate: Candidate | undefined
  initialPromiseId?: string
  focusLabelId?: string
  submissions: Submission[]
  voted: Set<string>
  onVote: (id: string) => void
  onSubmit: (s: Submission) => void
}

const STATUS_STYLE: Record<PromiseStatus, string> = {
  concluida: 'bg-tint-mint text-[#0f6b22]',
  andamento: 'bg-tint-sky text-[#005bab]',
  pendente: 'bg-tint-peach text-brand-orange-deep',
}

const goBack = () => {
  if (window.history.length > 1) window.history.back()
  else window.location.hash = '#/em-exercicio'
}

export function DocumentViewerPage(props: Props) {
  const { candidate } = props
  return (
    <div className="min-h-screen bg-surface-soft">
      <SubPageHeader
        extra={
          <Button variant="ghost" onClick={goBack}>
            <ArrowLeft /> Voltar
          </Button>
        }
      />
      {!candidate?.mandate ? (
        <main className="mx-auto max-w-3xl px-4 py-14 sm:px-8">
          <div className="rounded-lg bg-white p-10 text-center">
            <h1 className="text-h2">Documento não encontrado</h1>
            <p className="mt-3 text-slate">
              Este candidato não tem um plano de campanha anterior no catálogo, ou o link expirou.
            </p>
            <Button asChild size="lg" className="mt-6">
              <a href="#/em-exercicio">Ir para o painel</a>
            </Button>
          </div>
        </main>
      ) : (
        <Viewer {...props} candidate={candidate} mandate={candidate.mandate} />
      )}
    </div>
  )
}

function Viewer({
  candidate,
  mandate,
  initialPromiseId,
  focusLabelId,
  submissions,
  voted,
  onVote,
  onSubmit,
}: Props & { candidate: Candidate; mandate: Mandate }) {
  const total = pageCount(mandate)
  const labels = useMemo(
    () => submissions.filter((s) => s.kind === 'marcacao' && s.candidateId === candidate.id && s.label),
    [submissions, candidate.id],
  )
  const focused = labels.find((s) => s.id === focusLabelId)

  const firstPromise =
    mandate.promises.find((p) => p.id === (initialPromiseId ?? focused?.promiseId)) ??
    mandate.promises.find((p) => p.unlocated) ??
    mandate.promises[0]

  const [promiseId, setPromiseId] = useState(firstPromise.id)
  const [page, setPage] = useState(focused?.label?.page ?? firstPromise.planPage)
  const [zoom, setZoom] = useState(1)
  const [labeling, setLabeling] = useState(false)
  const [draft, setDraft] = useState<{ box: PageBox; excerpt: string } | null>(null)
  const [mine, setMine] = useState<Set<string>>(new Set())

  const selected: CampaignPromise = mandate.promises.find((p) => p.id === promiseId) ?? firstPromise

  /** Official location: an approved community label wins; otherwise the curated one, if any. */
  const officialOf = (p: CampaignPromise) => {
    const approved = labels.find((l) => l.promiseId === p.id && l.status === 'aprovada')
    if (approved?.label) return { page: approved.label.page, box: approved.label.box }
    if (!p.unlocated) {
      const loc = promiseLocation(candidate, mandate, p)
      return loc.box ? { page: loc.page, box: loc.box } : undefined
    }
    return undefined
  }

  const content = useMemo(() => buildPage(candidate, mandate, page), [candidate, mandate, page])

  const annotations: Annotation[] = [
    ...mandate.promises.flatMap((p) => {
      const o = officialOf(p)
      return o && o.page === page
        ? [{ id: `o-${p.id}`, box: o.box, tone: p.id === selected.id ? ('selected' as const) : ('official' as const), caption: p.id === selected.id ? 'Compromisso selecionado' : undefined }]
        : []
    }),
    ...labels
      .filter((l) => isQueued(l) && l.label?.page === page)
      .map((l) => ({
        id: `c-${l.id}`,
        box: l.label!.box,
        tone: l.id === focusLabelId ? ('focus' as const) : mine.has(l.id) ? ('mine' as const) : ('community' as const),
        caption: mine.has(l.id) ? 'Sua marcação' : 'Marcação da comunidade',
      })),
  ]

  const pending = labels.filter((l) => isQueued(l) && l.label?.page === page)
  const selectedOfficial = officialOf(selected)
  const selectedSuggestions = labels.filter((l) => l.promiseId === selected.id && isQueued(l)).length

  const choose = (p: CampaignPromise) => {
    setPromiseId(p.id)
    setPage(officialOf(p)?.page ?? p.planPage)
  }

  const pick = (box: PageBox, blockIndex?: number) => {
    // Show which text was selected, to make sure the visitor marked the right place.
    const parts = content.blocks
      .filter((b) => (blockIndex !== undefined ? b === content.blocks[blockIndex] : boxesOverlap(box, b.box) > 0.12 || insideMost(box, b.box)))
      .map((b) => b.lines.join(' '))
    setDraft({ box, excerpt: parts.join(' ').slice(0, 260) })
  }

  const zoomTo = (z: number) => setZoom(Math.min(2, Math.max(0.6, Math.round(z * 10) / 10)))

  return (
    <main className="mx-auto max-w-[1280px] px-4 py-6 sm:px-8 sm:py-10">
      <p className="text-micro-caps text-link">Plano da campanha de {mandate.campaignYear}</p>
      <h1 className="text-h2 mt-2">
        {candidate.name} <span className="font-normal text-steel">· {mandate.role}</span>
      </h1>
      <p className="mt-2 max-w-3xl text-slate">
        Veja onde cada compromisso está escrito e ajude a plataforma a crescer: marque no documento o trecho de um
        compromisso ou sugira um que ainda não está na lista.
      </p>
      <p className="mt-2 text-sm text-steel">
        Documento de demonstração, gerado para este protótipo. No produto real, aparece o PDF ou a imagem do plano.
      </p>

      <div className="mt-6 grid gap-6 lg:grid-cols-[360px_1fr]">
        {/* Sidebar */}
        <aside className="space-y-4 lg:sticky lg:top-24 lg:max-h-[calc(100vh-12rem)] lg:self-start lg:overflow-y-auto lg:pr-1">
          <section className="rounded-lg border border-hairline bg-white p-4" aria-labelledby="comp-title">
            <h2 id="comp-title" className="text-[17px]">
              Compromissos deste plano
            </h2>
            <ul className="mt-3 space-y-2">
              {mandate.promises.map((p) => {
                const o = officialOf(p)
                const sug = labels.filter((l) => l.promiseId === p.id && isQueued(l)).length
                return (
                  <li key={p.id}>
                    <button
                      type="button"
                      onClick={() => choose(p)}
                      aria-pressed={p.id === selected.id}
                      className={cn(
                        'w-full rounded-md border p-3 text-left transition-colors focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none',
                        p.id === selected.id ? 'border-primary bg-tint-lavender/50' : 'border-hairline hover:bg-surface',
                      )}
                    >
                      <span className="flex flex-wrap items-center gap-1.5">
                        <span className={cn('rounded-sm px-1.5 py-0.5 text-xs font-semibold', STATUS_STYLE[p.status])}>
                          {statusLabel(p.status, mandate)}
                        </span>
                        <span className="text-xs text-steel">{THEME_BY_ID[p.theme].short}</span>
                      </span>
                      <span className="mt-1.5 block text-sm font-medium">{p.text}</span>
                      <span className="mt-1.5 flex flex-wrap items-center gap-x-2 text-xs">
                        <span className="text-steel">p. {o?.page ?? p.planPage}</span>
                        {o ? (
                          <span className="font-medium text-success">Localização confirmada</span>
                        ) : (
                          <span className="font-medium text-brand-orange">
                            Sem marcação{sug > 0 ? ` · ${sug} ${sug === 1 ? 'sugestão' : 'sugestões'}` : ' · ajude a marcar'}
                          </span>
                        )}
                      </span>
                    </button>
                  </li>
                )
              })}
            </ul>
          </section>

          <section className="rounded-lg border border-hairline bg-white p-4" aria-labelledby="com-title">
            <h2 id="com-title" className="text-[17px]">
              Marcações da comunidade nesta página
            </h2>
            {pending.length === 0 ? (
              <p className="mt-2 text-sm text-slate">Ainda não há marcações aguardando curadoria nesta página.</p>
            ) : (
              <ul className="mt-3 space-y-3">
                {pending.map((l) => (
                  <li key={l.id} className="rounded-md bg-surface p-3">
                    <p className="text-sm font-medium">{l.title}</p>
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <Button
                        size="sm"
                        variant={voted.has(l.id) ? 'default' : 'outline'}
                        aria-pressed={voted.has(l.id)}
                        onClick={() => onVote(l.id)}
                      >
                        <ThumbsUp /> {voted.has(l.id) ? 'Você concordou' : 'Concordo'} · {l.votes}
                      </Button>
                      <a href="#/curadoria" className="text-sm font-medium text-link hover:underline">
                        Ver na Curadoria
                      </a>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </aside>

        {/* Document */}
        <section aria-label="Documento do plano" className="min-w-0">
          <div className="rounded-lg border border-hairline bg-white p-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className={cn('rounded-sm px-2 py-0.5 text-[13px] font-semibold', STATUS_STYLE[selected.status])}>
                {statusLabel(selected.status, mandate)}
              </span>
              <span className="text-sm text-steel">{THEME_BY_ID[selected.theme].label}</span>
            </div>
            <p className="mt-2 font-semibold">{selected.text}</p>
            <p className="mt-1 text-sm text-slate">
              Fonte do andamento: {selected.source} · atualizado em {selected.updatedAt}
            </p>
            {selectedOfficial ? (
              <p className="mt-2 text-sm font-medium text-success">
                Localização confirmada na página {selectedOfficial.page}.
              </p>
            ) : (
              <div className="mt-3 rounded-md bg-tint-yellow p-3 text-sm text-charcoal" role="note">
                <p>
                  Ninguém marcou ainda onde este compromisso está escrito
                  {selectedSuggestions > 0 ? `, mas há ${selectedSuggestions} sugestão aguardando curadoria` : ''}. Ele deve estar
                  perto da página {selected.planPage}.
                </p>
                <Button
                  size="sm"
                  className="mt-2"
                  onClick={() => {
                    setPage(selected.planPage)
                    setLabeling(true)
                  }}
                >
                  <MousePointer2 /> Marcar onde está escrito
                </Button>
              </div>
            )}
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-1" role="group" aria-label="Navegação de páginas">
              <Button variant="outline" size="icon" aria-label="Página anterior" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
                <ChevronLeft />
              </Button>
              <span className="px-2 text-sm font-medium" aria-live="polite">
                Página {page} de {total}
              </span>
              <Button variant="outline" size="icon" aria-label="Próxima página" disabled={page >= total} onClick={() => setPage((p) => p + 1)}>
                <ChevronRight />
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1" role="group" aria-label="Zoom">
                <Button variant="outline" size="icon" aria-label="Diminuir" disabled={zoom <= 0.6} onClick={() => zoomTo(zoom - 0.2)}>
                  <Minus />
                </Button>
                <span className="w-12 text-center text-sm">{Math.round(zoom * 100)}%</span>
                <Button variant="outline" size="icon" aria-label="Aumentar" disabled={zoom >= 2} onClick={() => zoomTo(zoom + 0.2)}>
                  <Plus />
                </Button>
              </div>
              <Button variant={labeling ? 'default' : 'outline'} aria-pressed={labeling} onClick={() => setLabeling((v) => !v)}>
                <FileSearch /> Marcar no documento
              </Button>
            </div>
          </div>

          {labeling && (
            <div className="mt-3 flex items-start justify-between gap-3 rounded-md bg-tint-sky p-3 text-sm text-charcoal" role="status">
              <p>
                <strong>Modo de marcação:</strong> arraste sobre o texto para marcar uma área, ou toque/clique em um parágrafo.
                Depois escolha de qual compromisso é.
              </p>
              <Button variant="ghost" size="icon-sm" aria-label="Sair do modo de marcação" onClick={() => setLabeling(false)}>
                <X />
              </Button>
            </div>
          )}

          <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 text-xs text-slate" aria-label="Legenda">
            <li className="flex items-center gap-1.5"><span className="size-3 rounded-sm border-2 border-success bg-success/15" aria-hidden /> Localização confirmada</li>
            <li className="flex items-center gap-1.5"><span className="size-3 rounded-sm border-2 border-primary bg-primary/15" aria-hidden /> Compromisso selecionado</li>
            <li className="flex items-center gap-1.5"><span className="size-3 rounded-sm border-2 border-dashed border-link bg-link/10" aria-hidden /> Marcação da comunidade (aguarda curadoria)</li>
            <li className="flex items-center gap-1.5"><span className="size-3 rounded-sm border-2 border-dashed border-brand-orange bg-brand-orange/10" aria-hidden /> Sua marcação</li>
          </ul>

          <div className="mt-4 overflow-auto rounded-lg bg-stone/20 p-3 sm:p-5">
            <div className="mx-auto" style={{ width: zoom === 1 ? 'min(100%, 680px)' : `${zoom * 680}px`, minWidth: zoom === 1 ? undefined : undefined }}>
              <PlanPageView
                content={content}
                title={`Plano de Governo ${mandate.campaignYear} · ${candidate.name}`}
                annotations={annotations}
                labeling={labeling}
                draft={draft?.box ?? null}
                onPick={pick}
              />
            </div>
          </div>
          <p className="mt-2 text-xs text-steel">Página de {PAGE_W} × {PAGE_H} pontos. Marcações ficam só nesta sessão do protótipo.</p>

          <SectionFeedback className="mt-6" section="documento:marcacao" label="Documento do plano · marcação" prompt="Marcar o trecho no documento faz sentido para você?" candidates={[candidate.id]} />
        </section>
      </div>

      <LabelDialog
        open={draft !== null}
        onOpenChange={(o) => !o && setDraft(null)}
        candidate={candidate}
        mandate={mandate}
        page={page}
        box={draft?.box ?? null}
        excerpt={draft?.excerpt ?? ''}
        defaultPromiseId={selected.unlocated || !selectedOfficial ? selected.id : undefined}
        onSubmit={(s) => {
          onSubmit(s)
          setMine((m) => new Set(m).add(s.id))
          setLabeling(false)
          setDraft(null)
        }}
      />
    </main>
  )
}

/** True when most of the block lies inside the dragged box (so partial drags still match a paragraph). */
function insideMost(drag: PageBox, block: PageBox): boolean {
  const x = Math.max(0, Math.min(drag.x + drag.w, block.x + block.w) - Math.max(drag.x, block.x))
  const y = Math.max(0, Math.min(drag.y + drag.h, block.y + block.h) - Math.max(drag.y, block.y))
  return (x * y) / (block.w * block.h) > 0.4
}
