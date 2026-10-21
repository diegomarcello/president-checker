import { THEMES } from '@/data/themes'
import type { Candidate, CampaignPromise, Mandate, PageBox } from '@/data/types'

/**
 * Demo plan documents. There are no real PDFs yet, so each page of the campaign plan is generated
 * from the candidate's commitments: filler text plus the commitment sentences at fixed positions.
 * In production, pages would be images rendered from the PDF (or the uploaded image itself) and the
 * boxes would come from curated labels. The viewer, the boxes and the labeling flow are the same.
 */

export const PAGE_W = 595
export const PAGE_H = 842
const MARGIN = 56
const LINE = 16
const WRAP = 78

export interface TextBlock {
  y: number
  lines: string[]
  /** Set when the block is the sentence of a commitment. */
  promiseId?: string
  /** Box around the block, normalized to the page. */
  box: PageBox
}

export interface PageContent {
  number: number
  heading: string
  blocks: TextBlock[]
}

const FILLER = [
  'O diagnóstico parte de dados públicos e de ouvir moradores, servidores e especialistas.',
  'As metas serão acompanhadas por indicadores divulgados a cada trimestre em painel aberto.',
  'A execução será feita em parceria com os demais entes da federação e com a sociedade civil.',
  'Os recursos virão do orçamento regular, de convênios e de ganhos de eficiência na gestão.',
  'Cada ação terá responsável definido, cronograma e prestação de contas ao final de cada ano.',
  'A prioridade são as regiões e os grupos que hoje têm menos acesso aos serviços públicos.',
  'O plano será revisado anualmente, com consulta pública sobre o que foi feito e o que falta.',
  'A transparência é condição para que as metas possam ser cobradas por qualquer pessoa.',
  'As propostas respeitam a lei de responsabilidade fiscal e o equilíbrio das contas públicas.',
  'A inovação e o uso de dados orientarão a escolha dos locais e dos públicos atendidos.',
  'O diálogo com conselhos e entidades garante que as políticas respondam a necessidades reais.',
  'A continuidade dos programas bem avaliados será garantida, com ajustes onde houver evidência.',
]

function hash(str: string): number {
  let h = 2166136261
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

function wrap(text: string, width = WRAP): string[] {
  const words = text.split(/\s+/)
  const lines: string[] = []
  let cur = ''
  for (const w of words) {
    if ((cur + ' ' + w).trim().length > width) {
      lines.push(cur)
      cur = w
    } else {
      cur = (cur + ' ' + w).trim()
    }
  }
  if (cur) lines.push(cur)
  return lines
}

const toBox = (y: number, lineCount: number): PageBox => {
  const top = y - 13
  const height = lineCount * LINE + 6
  return {
    x: (MARGIN - 8) / PAGE_W,
    y: top / PAGE_H,
    w: (PAGE_W - 2 * MARGIN + 16) / PAGE_W,
    h: height / PAGE_H,
  }
}

/** Fixed vertical layout: filler, then up to 3 commitment slots, so a commitment's box never moves. */
const FILLER_SLOTS = [{ y: 150, lines: 5 }, { y: 366, lines: 4 }, { y: 560, lines: 5 }, { y: 735, lines: 3 }]
const PROMISE_SLOTS = [262, 470, 660]

export function pageCount(mandate: Mandate): number {
  return Math.max(...mandate.promises.map((p) => p.planPage)) + 4
}

export function buildPage(candidate: Candidate, mandate: Mandate, number: number): PageContent {
  const rand = hash(`${candidate.id}:${number}`)
  const here = mandate.promises.filter((p) => p.planPage === number)
  const theme = here[0]
    ? THEMES.find((t) => t.id === here[0].theme)!
    : THEMES[(rand + number) % THEMES.length]

  const blocks: TextBlock[] = []
  FILLER_SLOTS.forEach((slot, si) => {
    const sentences: string[] = []
    for (let i = 0; i < slot.lines; i++) sentences.push(FILLER[(rand + si * 5 + i * 3) % FILLER.length])
    const lines = wrap(sentences.join(' ')).slice(0, slot.lines)
    blocks.push({ y: slot.y, lines, box: toBox(slot.y, lines.length) })
  })
  here.slice(0, PROMISE_SLOTS.length).forEach((p, i) => {
    const y = PROMISE_SLOTS[i]
    const lines = wrap(`Compromisso: ${p.text}, com metas, prazos e prestação de contas públicos.`).slice(0, 4)
    blocks.push({ y, lines, promiseId: p.id, box: toBox(y, lines.length) })
  })
  return { number, heading: `${theme.label}`, blocks }
}

/** Where a commitment really is written in the demo document. */
export function promiseLocation(candidate: Candidate, mandate: Mandate, promise: CampaignPromise) {
  const block = buildPage(candidate, mandate, promise.planPage).blocks.find((b) => b.promiseId === promise.id)
  return { page: promise.planPage, box: block?.box }
}

export const boxesOverlap = (a: PageBox, b: PageBox): number => {
  const x = Math.max(0, Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x))
  const y = Math.max(0, Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y))
  const inter = x * y
  const union = a.w * a.h + b.w * b.h - inter
  return union === 0 ? 0 : inter / union
}

export { LINE, MARGIN }
