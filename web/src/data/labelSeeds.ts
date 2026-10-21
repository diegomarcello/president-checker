import { promiseLocation } from '@/lib/planDocument'
import type { Candidate, Submission } from './types'

const jitter = (n: number) => Math.round((n + (n % 0.013) - 0.006) * 1000) / 1000

function seed(
  candidates: Candidate[],
  candidateId: string,
  promiseId: string,
  extra: Pick<Submission, 'id' | 'status' | 'votes' | 'createdAt'> & Partial<Submission>,
): Submission[] {
  const candidate = candidates.find((c) => c.id === candidateId)
  const promise = candidate?.mandate?.promises.find((p) => p.id === promiseId)
  if (!candidate?.mandate || !promise) return []
  const loc = promiseLocation(candidate, candidate.mandate, promise)
  if (!loc.box) return []
  const box = { x: jitter(loc.box.x), y: jitter(loc.box.y), w: loc.box.w, h: loc.box.h }
  return [
    {
      candidateId,
      promiseId,
      kind: 'marcacao',
      type: 'marcacao',
      title: `Marcação na p. ${loc.page}: ${promise.text}`,
      description: 'Trecho do plano da campanha onde este compromisso aparece.',
      label: { page: loc.page, box },
      ...extra,
    },
  ]
}

/** Fictional community labels, consistent with the demo documents. */
export function buildSeedLabels(candidates: Candidate[]): Submission[] {
  return [
    ...seed(candidates, 'marcos-tavares', 'mt6', { id: 's-201', status: 'recebida', votes: 12, createdAt: '16/10/2026' }),
    ...seed(candidates, 'edson-barreto', 'eb3', { id: 's-202', status: 'em-analise', votes: 6, createdAt: '14/10/2026' }),
    ...seed(candidates, 'helena-albuquerque', 'ha6', {
      id: 's-203',
      status: 'aprovada',
      votes: 19,
      createdAt: '30/09/2026',
      decidedAt: '08/10/2026',
      curatorNote: 'Trecho confirmado no plano da campanha de 2020. A localização do compromisso passou a ser oficial.',
    }),
  ]
}
