import { THEMES } from './themes'
import { UF_BY_SIGLA } from './ufs'
import type { Candidate, OfficeType, Tag, ThemeEntry, ThemeId } from './types'

/**
 * Fictional candidates for governor, senator, mayor, deputy and city council, used only to
 * demonstrate the filters. Their plans are generated from templates, deterministically per id.
 */

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

const TEMPLATES: Record<ThemeId, { strengths: string[]; weaknesses: string[] }> = {
  economia: {
    strengths: [
      'Programa de crédito e capacitação para pequenos negócios em {place}',
      'Meta de gerar empregos formais com cronograma por região de {place}',
    ],
    weaknesses: ['Não detalha a fonte de recursos do programa', 'Metas sem indicador de acompanhamento'],
  },
  tributacao: {
    strengths: [
      'Simplificação de taxas e alvarás para quem empreende em {place}',
      'Redução de tributos locais para pequenos comércios, com prazo definido',
    ],
    weaknesses: ['Não informa a perda de arrecadação', 'Benefícios dependem de aprovação em outra instância'],
  },
  seguranca: {
    strengths: [
      'Reforço de policiamento e iluminação nas áreas de maior risco de {place}',
      'Integração de câmeras e dados de ocorrências, com metas anuais',
    ],
    weaknesses: ['Metas de redução de crimes sem prazo', 'Pouco sobre prevenção e juventude'],
  },
  saude: {
    strengths: [
      'Redução da fila de consultas especializadas em {place} em 24 meses',
      'Ampliação do horário de atendimento nas unidades básicas',
    ],
    weaknesses: ['Contratação de profissionais sem fonte de recursos indicada', 'Sem plano para urgência e emergência'],
  },
  educacao: {
    strengths: [
      'Ampliação de vagas em creches e escola em tempo integral em {place}',
      'Qualificação profissional para jovens e adultos',
    ],
    weaknesses: ['Cronograma de obras sem datas', 'Pouca atenção ao ensino técnico'],
  },
  ambiente: {
    strengths: [
      'Coleta seletiva e reciclagem ampliadas em {place}',
      'Plano de arborização e prevenção de enchentes',
    ],
    weaknesses: ['Sem metas de redução de resíduos', 'Custo da transição não detalhado'],
  },
}

interface Spec {
  id: string
  name: string
  party: string
  partyName: string
  type: OfficeType
  office: string
  uf: string
  city?: string
  neighborhood?: string
  color: string
  election: string
}

function build(spec: Spec): Candidate {
  const rand = rng(hash(spec.id))
  const place = spec.neighborhood ?? spec.city ?? UF_BY_SIGLA[spec.uf].nome
  const skip = Math.floor(rand() * THEMES.length)
  const themes: Partial<Record<ThemeId, ThemeEntry>> = {}

  THEMES.forEach((t, i) => {
    if (i === skip && rand() < 0.5) return // some plans leave a gap
    const tpl = TEMPLATES[t.id]
    const pick = (list: string[]) => list[Math.floor(rand() * list.length)].replace('{place}', place)
    const page = 6 + Math.floor(rand() * 40)
    const effects: Partial<Record<Tag, { delta: number; note: string }>> = {}
    if (t.id === 'educacao') effects.filhos = { delta: -8, note: 'Creches e escola em tempo integral ajudam quem tem filhos' }
    if (t.id === 'saude') effects.idoso = { delta: -8, note: 'Ampliação do atendimento básico beneficia idosos' }
    if (t.id === 'economia') effects.mei = { delta: -8, note: 'Crédito e capacitação para pequenos negócios' }
    themes[t.id] = {
      concreteness: Math.round(40 + rand() * 50),
      viability: Math.round(42 + rand() * 38),
      strengths: [{ text: pick(tpl.strengths), page }],
      weaknesses: [{ text: pick(tpl.weaknesses), page: page + 1 }],
      effects,
      effectsPage: page,
    }
  })

  return {
    id: spec.id,
    name: spec.name,
    ballotName: spec.name,
    party: spec.party,
    partyName: spec.partyName,
    type: spec.type,
    office: spec.office,
    location: { uf: spec.uf, city: spec.city, neighborhood: spec.neighborhood },
    election: spec.election,
    planVersion: 'v1',
    planDate: `${String(1 + Math.floor(rand() * 27)).padStart(2, '0')}/08/2026`,
    pages: 28 + Math.floor(rand() * 50),
    color: spec.color,
    origin: 'catalogo',
    themes,
  }
}

const GERAL = 'Eleição Geral (demonstração)'
const MUNICIPAL = 'Eleição Municipal (demonstração)'

export const LOCAL_CANDIDATES: Candidate[] = [
  build({ id: 'luciana-prado', name: 'Luciana Prado', party: 'AR', partyName: 'Aliança Renovação', type: 'governador', office: 'Governadora de São Paulo', uf: 'SP', color: '#7b3ff2', election: GERAL }),
  build({ id: 'rafael-duarte', name: 'Rafael Duarte', party: 'UC', partyName: 'União Cidadã', type: 'governador', office: 'Governador de São Paulo', uf: 'SP', color: '#2a9d99', election: GERAL }),
  build({ id: 'henrique-salles', name: 'Henrique Salles', party: 'PH', partyName: 'Partido Horizonte', type: 'governador', office: 'Governador de Minas Gerais', uf: 'MG', color: '#a02e6d', election: GERAL }),
  build({ id: 'vera-montenegro', name: 'Vera Montenegro', party: 'AVN', partyName: 'Aliança Verde Nacional', type: 'senador', office: 'Senadora pelo Rio de Janeiro', uf: 'RJ', color: '#793400', election: GERAL }),
  build({ id: 'otavio-brandao', name: 'Otávio Brandão', party: 'PH', partyName: 'Partido Horizonte', type: 'deputado-federal', office: 'Deputado federal por Minas Gerais', uf: 'MG', city: 'Belo Horizonte', color: '#0075de', election: GERAL }),
  build({ id: 'marina-cavalcanti', name: 'Marina Cavalcanti', party: 'AR', partyName: 'Aliança Renovação', type: 'deputado-estadual', office: 'Deputada estadual por São Paulo', uf: 'SP', city: 'Campinas', color: '#dd5b00', election: GERAL }),
  build({ id: 'edson-barreto', name: 'Edson Barreto', party: 'MBN', partyName: 'Movimento Brasil Novo', type: 'prefeito', office: 'Prefeito de São Paulo', uf: 'SP', city: 'São Paulo', color: '#1aae39', election: MUNICIPAL }),
  build({ id: 'tatiana-moraes', name: 'Tatiana Moraes', party: 'FCD', partyName: 'Frente Cidadã Democrática', type: 'prefeito', office: 'Prefeita de São Paulo', uf: 'SP', city: 'São Paulo', color: '#e03131', election: MUNICIPAL }),
  build({ id: 'gustavo-lemos', name: 'Gustavo Lemos', party: 'UC', partyName: 'União Cidadã', type: 'prefeito', office: 'Prefeito de Campinas', uf: 'SP', city: 'Campinas', color: '#5645d4', election: MUNICIPAL }),
  build({ id: 'joana-ribeiro', name: 'Joana Ribeiro', party: 'AVN', partyName: 'Aliança Verde Nacional', type: 'vereador', office: 'Vereadora de São Paulo', uf: 'SP', city: 'São Paulo', neighborhood: 'Pinheiros', color: '#ff64c8', election: MUNICIPAL }),
  build({ id: 'caio-mendonca', name: 'Caio Mendonça', party: 'FCD', partyName: 'Frente Cidadã Democrática', type: 'vereador', office: 'Vereador de São Paulo', uf: 'SP', city: 'São Paulo', neighborhood: 'Moema', color: '#523410', election: MUNICIPAL }),
  build({ id: 'priscila-andrade', name: 'Priscila Andrade', party: 'MBN', partyName: 'Movimento Brasil Novo', type: 'vereador', office: 'Vereadora de Campinas', uf: 'SP', city: 'Campinas', neighborhood: 'Cambuí', color: '#005bab', election: MUNICIPAL }),
]
