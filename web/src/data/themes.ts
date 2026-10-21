import {
  GraduationCap,
  HeartPulse,
  Landmark,
  Leaf,
  ShieldCheck,
  TrendingUp,
  type LucideIcon,
} from 'lucide-react'
import type { ThemeId } from './types'

export interface ThemeMeta {
  id: ThemeId
  label: string
  short: string
  description: string
  icon: LucideIcon
  tint: string
}

export const THEMES: ThemeMeta[] = [
  {
    id: 'economia',
    label: 'Economia e emprego',
    short: 'Economia',
    description: 'Crescimento, crédito, emprego e investimento público.',
    icon: TrendingUp,
    tint: 'bg-tint-yellow',
  },
  {
    id: 'tributacao',
    label: 'Tributação',
    short: 'Tributação',
    description: 'Impostos, faixas de renda e regimes para autônomos e empresas.',
    icon: Landmark,
    tint: 'bg-tint-lavender',
  },
  {
    id: 'seguranca',
    label: 'Segurança pública',
    short: 'Segurança',
    description: 'Policiamento, prevenção e metas de redução de crimes.',
    icon: ShieldCheck,
    tint: 'bg-tint-sky',
  },
  {
    id: 'saude',
    label: 'Saúde',
    short: 'Saúde',
    description: 'Atenção básica, filas, hospitais e prevenção.',
    icon: HeartPulse,
    tint: 'bg-tint-rose',
  },
  {
    id: 'educacao',
    label: 'Educação',
    short: 'Educação',
    description: 'Escola, qualificação profissional e ensino superior.',
    icon: GraduationCap,
    tint: 'bg-tint-peach',
  },
  {
    id: 'ambiente',
    label: 'Meio ambiente e clima',
    short: 'Ambiente',
    description: 'Desmatamento, energia limpa e metas de emissões.',
    icon: Leaf,
    tint: 'bg-tint-mint',
  },
]

export const THEME_BY_ID = Object.fromEntries(
  THEMES.map((t) => [t.id, t]),
) as Record<ThemeId, ThemeMeta>
