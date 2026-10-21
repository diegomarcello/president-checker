import type { Candidate, CampaignPromise, Mandate, PromiseStatus } from '@/data/types'

export const STATUS_ORDER: PromiseStatus[] = ['concluida', 'andamento', 'pendente']

export const plural = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`

export function statusLabel(status: PromiseStatus, mandate: Mandate): string {
  if (status === 'concluida') return 'Concluído'
  if (status === 'andamento') return mandate.situation === 'encerrado' ? 'Parcial' : 'Em andamento'
  return mandate.situation === 'encerrado' ? 'Não entregue' : 'Pendente'
}

export const STATUS_COLOR: Record<PromiseStatus, string> = {
  concluida: '#1aae39',
  andamento: '#0075de',
  pendente: '#dd5b00',
}

export function statusCounts(mandate: Mandate): Record<PromiseStatus, number> {
  const counts: Record<PromiseStatus, number> = { concluida: 0, andamento: 0, pendente: 0 }
  for (const p of mandate.promises) counts[p.status] += 1
  return counts
}

export function mandateTag(mandate: Mandate | null | undefined): { label: string; tone: 'ativo' | 'ex' | 'novo' } {
  if (mandate === undefined) return { label: 'Histórico indisponível', tone: 'novo' }
  if (mandate === null) return { label: 'Sem mandato anterior', tone: 'novo' }
  return mandate.situation === 'em-exercicio'
    ? { label: 'Em exercício', tone: 'ativo' }
    : { label: 'Mandato encerrado', tone: 'ex' }
}

export type SituationFilter = 'em-exercicio' | 'encerrado' | 'todos'

export interface PromiseRow {
  candidate: Candidate
  mandate: Mandate
  promise: CampaignPromise
}

/** Candidates that have a mandate, filtered by situation. */
export function withMandate(candidates: Candidate[], situation: SituationFilter): (Candidate & { mandate: Mandate })[] {
  return candidates.filter(
    (c): c is Candidate & { mandate: Mandate } =>
      !!c.mandate && (situation === 'todos' || c.mandate.situation === situation),
  )
}

export function flattenPromises(candidates: (Candidate & { mandate: Mandate })[]): PromiseRow[] {
  return candidates.flatMap((candidate) =>
    candidate.mandate.promises.map((promise) => ({ candidate, mandate: candidate.mandate, promise })),
  )
}

export const percent = (part: number, total: number) => (total === 0 ? '0%' : `${Math.round((part / total) * 100)}%`)
