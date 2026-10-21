import type { Submission, SubmissionStatus, SubmissionType } from '@/data/types'

export const IN_QUEUE: SubmissionStatus[] = ['recebida', 'em-analise']

export const STATUS_LABEL: Record<SubmissionStatus, string> = {
  recebida: 'Recebida',
  'em-analise': 'Em análise',
  aprovada: 'Aprovada e incluída',
  rejeitada: 'Rejeitada',
}

export const TYPE_LABEL: Record<SubmissionType, string> = {
  informacao: 'Informação adicional',
  correcao: 'Correção',
  marcacao: 'Marcação no documento',
}

export const isQueued = (s: Submission) => IN_QUEUE.includes(s.status)

export function formatSize(bytes: number): string {
  if (bytes < 1_000_000) return `${Math.max(1, Math.round(bytes / 1000))} KB`
  return `${(bytes / 1_000_000).toFixed(1).replace('.', ',')} MB`
}

/** Only http(s) links are accepted; returns the parsed URL or null. */
export function parseWebUrl(value: string): URL | null {
  try {
    const url = new URL(value.trim())
    return url.protocol === 'http:' || url.protocol === 'https:' ? url : null
  } catch {
    return null
  }
}

export const hostOf = (url: string) => parseWebUrl(url)?.hostname.replace(/^www\./, '') ?? url
