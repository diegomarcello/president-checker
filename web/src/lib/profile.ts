import { UF_BY_SIGLA } from '@/data/ufs'
import { THEMES } from '@/data/themes'
import type { Profile, Tag, ThemeId, Weight } from '@/data/types'

export const EMPTY_PROFILE: Profile = {
  uf: null,
  municipio: '',
  faixaEtaria: null,
  vinculo: null,
  ramo: null,
  rendaAtual: null,
  rendaFutura: null,
  filhos: false,
  moradia: null,
}

export const FAIXAS_ETARIAS = ['18–24', '25–34', '35–49', '50–64', '65 ou mais']

export const VINCULOS = [
  { value: 'clt', label: 'CLT' },
  { value: 'autonomo', label: 'Autônomo' },
  { value: 'mei', label: 'MEI' },
  { value: 'empresario', label: 'Empresário(a)' },
  { value: 'servidor', label: 'Servidor(a) público(a)' },
  { value: 'estudante', label: 'Estudante' },
  { value: 'aposentado', label: 'Aposentado(a)' },
]

export const RAMOS = [
  { value: 'tecnologia', label: 'Tecnologia' },
  { value: 'agro', label: 'Agropecuária' },
  { value: 'comercio', label: 'Comércio' },
  { value: 'servicos', label: 'Serviços' },
  { value: 'industria', label: 'Indústria' },
  { value: 'saude', label: 'Saúde' },
  { value: 'educacao', label: 'Educação' },
  { value: 'outro', label: 'Outro' },
]

export const FAIXAS_RENDA = [
  'Até R$ 2 mil/mês',
  'R$ 2 a 5 mil/mês',
  'R$ 5 a 10 mil/mês',
  'R$ 10 a 20 mil/mês',
  'Acima de R$ 20 mil/mês',
]

export const MORADIAS = [
  { value: 'aluguel', label: 'Aluguel' },
  { value: 'financiado', label: 'Financiado' },
  { value: 'proprio', label: 'Quitado' },
]

export function profileIsFilled(p: Profile): boolean {
  return (
    p.uf !== null ||
    p.faixaEtaria !== null ||
    p.vinculo !== null ||
    p.ramo !== null ||
    p.rendaAtual !== null ||
    p.rendaFutura !== null ||
    p.filhos ||
    p.moradia !== null
  )
}

export function profileTags(p: Profile): Set<Tag> {
  const tags = new Set<Tag>()
  if (p.vinculo) tags.add(p.vinculo as Tag)
  if (p.ramo === 'agro' || p.ramo === 'tecnologia') tags.add(p.ramo)
  if (p.faixaEtaria === '18–24' || p.faixaEtaria === '25–34') tags.add('jovem')
  if (p.faixaEtaria === '50–64' || p.faixaEtaria === '65 ou mais') tags.add('idoso')
  if (p.filhos) tags.add('filhos')
  if (p.moradia === 'aluguel') tags.add('aluguel')
  if (p.rendaAtual !== null && p.rendaAtual <= 1) tags.add('baixaRenda')
  if (p.rendaFutura !== null && p.rendaFutura >= 3) tags.add('rendaAlta')
  if (
    p.rendaAtual !== null &&
    p.rendaFutura !== null &&
    p.rendaFutura > p.rendaAtual
  ) {
    tags.add('crescimentoRenda')
  }
  if (p.uf) tags.add(`regiao-${UF_BY_SIGLA[p.uf].regiao}` as Tag)
  return tags
}

export interface WeightSuggestion {
  weights: Record<ThemeId, Weight>
  reasons: Record<ThemeId, string[]>
}

/** Suggests how relevant each theme is for the profile. The voter can override. */
export function suggestWeights(p: Profile): WeightSuggestion {
  const tags = profileTags(p)
  const weights = Object.fromEntries(
    THEMES.map((t) => [t.id, (t.id === 'ambiente' ? 1 : 2) as Weight]),
  ) as Record<ThemeId, Weight>
  const reasons = Object.fromEntries(THEMES.map((t) => [t.id, [] as string[]])) as Record<
    ThemeId,
    string[]
  >

  const bump = (id: ThemeId, why: string) => {
    weights[id] = Math.min(3, weights[id] + 1) as Weight
    reasons[id].push(why)
  }

  if (tags.has('autonomo') || tags.has('mei') || tags.has('empresario')) {
    bump('tributacao', 'você trabalha por conta própria ou tem negócio')
  }
  if (tags.has('rendaAlta') || tags.has('crescimentoRenda')) {
    bump('tributacao', 'você espera aumento de renda')
  }
  if (tags.has('baixaRenda') || tags.has('crescimentoRenda')) {
    bump('economia', 'sua renda é sensível a emprego e crédito')
  }
  if (tags.has('idoso') || tags.has('aposentado') || tags.has('filhos')) {
    bump('saude', 'idade ou composição do domicílio')
  }
  if (tags.has('filhos') || tags.has('estudante') || tags.has('jovem')) {
    bump('educacao', 'você tem filhos, estuda ou está no início da carreira')
  }
  if (tags.has('agro')) bump('ambiente', 'o seu setor é afetado por regras ambientais')
  if (tags.has('aluguel')) bump('economia', 'custo de moradia e juros')

  return { weights, reasons }
}

export const WEIGHT_LABEL: Record<Weight, string> = {
  0: 'Ignorar',
  1: 'Baixa',
  2: 'Média',
  3: 'Alta',
}
