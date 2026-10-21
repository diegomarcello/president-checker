import { THEMES } from '@/data/themes'
import type {
  Candidate,
  Evidence,
  RiskLevel,
  Tag,
  ThemeId,
  Weight,
} from '@/data/types'

export interface AppliedEffect {
  tag: Tag
  delta: number
  note: string
  page: number
}

export interface ThemeAnalysis {
  level: RiskLevel
  /** 0 (lowest risk) to 100. Null when the plan has a gap on the theme. */
  risk: number | null
  /** 100 - risk, used by the radar. 0 for gaps. */
  adequacy: number
  concreteness: number
  viability: number
  strengths: Evidence[]
  weaknesses: Evidence[]
  applied: AppliedEffect[]
}

export const LEVEL_LABEL: Record<RiskLevel, string> = {
  baixo: 'Risco baixo',
  medio: 'Risco médio',
  alto: 'Risco alto',
  lacuna: 'Lacuna',
}

export const LEVEL_COLOR: Record<RiskLevel, string> = {
  baixo: '#1aae39',
  medio: '#f5d75e',
  alto: '#e03131',
  lacuna: '#a4a097',
}

export function levelFromRisk(risk: number): RiskLevel {
  if (risk < 38) return 'baixo'
  if (risk < 62) return 'medio'
  return 'alto'
}

/**
 * Risk blends how vague/unfunded the proposal is with the effects that
 * apply to the voter's profile. Same formula for every candidate.
 */
export function analyzeTheme(
  candidate: Candidate,
  theme: ThemeId,
  tags: Set<Tag>,
): ThemeAnalysis {
  const entry = candidate.themes[theme]
  if (!entry) {
    return {
      level: 'lacuna',
      risk: null,
      adequacy: 0,
      concreteness: 0,
      viability: 0,
      strengths: [],
      weaknesses: [],
      applied: [],
    }
  }

  const applied: AppliedEffect[] = []
  for (const [tag, effect] of Object.entries(entry.effects ?? {}) as [
    Tag,
    { delta: number; note: string },
  ][]) {
    if (tags.has(tag)) {
      applied.push({ tag, ...effect, page: entry.effectsPage ?? 0 })
    }
  }

  const baseRisk = 100 - (entry.concreteness * 0.5 + entry.viability * 0.5)
  const delta = Math.max(-25, Math.min(30, applied.reduce((s, e) => s + e.delta, 0)))
  const risk = Math.round(Math.max(4, Math.min(96, baseRisk + delta)))

  return {
    level: levelFromRisk(risk),
    risk,
    adequacy: 100 - risk,
    concreteness: entry.concreteness,
    viability: entry.viability,
    strengths: entry.strengths,
    weaknesses: entry.weaknesses,
    applied,
  }
}

export type CandidateAnalysis = Record<ThemeId, ThemeAnalysis>

export function analyzeCandidate(c: Candidate, tags: Set<Tag>): CandidateAnalysis {
  return Object.fromEntries(
    THEMES.map((t) => [t.id, analyzeTheme(c, t.id, tags)]),
  ) as CandidateAnalysis
}

export function levelCounts(
  analysis: CandidateAnalysis,
  weights: Record<ThemeId, Weight>,
): Record<RiskLevel, number> {
  const counts: Record<RiskLevel, number> = { baixo: 0, medio: 0, alto: 0, lacuna: 0 }
  for (const t of THEMES) {
    if (weights[t.id] > 0) counts[analysis[t.id].level] += 1
  }
  return counts
}
