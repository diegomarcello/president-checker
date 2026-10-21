import { THEMES } from '@/data/themes'
import type { Candidate, CandidateLocation, OfficeType, ThemeEntry, ThemeId } from '@/data/types'

const UPLOAD_COLORS = ['#7b3ff2', '#2a9d99', '#a02e6d', '#793400']

function hash(str: string): number {
  let h = 2166136261
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

function rng(seed: number) {
  let s = seed || 1
  return () => {
    s ^= s << 13
    s ^= s >>> 17
    s ^= s << 5
    return ((s >>> 0) % 1000) / 1000
  }
}

/**
 * DEMO ONLY: the real pipeline (extraction, embeddings, agents) does not exist
 * yet, so an uploaded PDF yields a deterministic placeholder analysis derived
 * from the file name. It is always shown with the "não verificado" seal.
 */
export function simulateUploadedPlan(args: {
  file: File
  name: string
  office: string
  type: OfficeType
  location?: CandidateLocation
  index: number
}): Candidate {
  const { file, name, office, type, location, index } = args
  const rand = rng(hash(`${file.name}:${file.size}`))
  const themes: Partial<Record<ThemeId, ThemeEntry>> = {}

  for (const t of THEMES) {
    if (rand() < 0.15) continue
    const concreteness = Math.round(35 + rand() * 55)
    const viability = Math.round(40 + rand() * 40)
    const p1 = 5 + Math.floor(rand() * 40)
    themes[t.id] = {
      concreteness,
      viability,
      strengths: [
        {
          text: `Proposta sobre ${t.short.toLowerCase()} extraída do PDF enviado (análise simulada)`,
          page: p1,
        },
      ],
      weaknesses: [
        {
          text:
            concreteness < 60
              ? 'Trecho sem meta ou prazo definidos (análise simulada)'
              : 'Fonte de recursos não identificada (análise simulada)',
          page: p1 + 1,
        },
      ],
    }
  }

  return {
    id: `upload-${hash(file.name + file.size)}`,
    name,
    ballotName: name,
    party: '—',
    partyName: 'Plano enviado por você',
    type,
    office,
    location,
    election: 'Plano enviado pelo usuário',
    planVersion: 'v1',
    planDate: new Date().toLocaleDateString('pt-BR'),
    pages: 30 + Math.floor(rand() * 60),
    color: UPLOAD_COLORS[index % UPLOAD_COLORS.length],
    origin: 'enviado',
    themes,
  }
}
