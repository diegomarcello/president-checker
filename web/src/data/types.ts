export type ThemeId =
  | 'economia'
  | 'tributacao'
  | 'seguranca'
  | 'saude'
  | 'educacao'
  | 'ambiente'

export type Tag =
  | 'clt'
  | 'autonomo'
  | 'mei'
  | 'empresario'
  | 'servidor'
  | 'estudante'
  | 'aposentado'
  | 'rendaAlta'
  | 'baixaRenda'
  | 'crescimentoRenda'
  | 'jovem'
  | 'idoso'
  | 'filhos'
  | 'aluguel'
  | 'agro'
  | 'tecnologia'
  | 'regiao-norte'
  | 'regiao-nordeste'
  | 'regiao-centro-oeste'
  | 'regiao-sudeste'
  | 'regiao-sul'

export type Region = 'norte' | 'nordeste' | 'centro-oeste' | 'sudeste' | 'sul'

export interface Evidence {
  text: string
  page: number
}

export interface ProfileEffect {
  /** Negative lowers the risk for the profile, positive raises it. */
  delta: number
  note: string
}

export interface ThemeEntry {
  concreteness: number
  viability: number
  strengths: Evidence[]
  weaknesses: Evidence[]
  effects?: Partial<Record<Tag, ProfileEffect>>
  /** Page the profile effects come from. */
  effectsPage?: number
}

export type PromiseStatus = 'concluida' | 'andamento' | 'pendente'

/** A commitment made in the last campaign plan, tracked against what was delivered. */
export interface CampaignPromise {
  id: string
  theme: ThemeId
  text: string
  /** Page of the campaign plan where the commitment appears. */
  planPage: number
  status: PromiseStatus
  /** 0-100, only meaningful while "andamento". */
  progress?: number
  /** Public source backing the status (official gazette, portal, etc.). */
  source: string
  updatedAt: string
  note?: string
  /** True while nobody has marked where the commitment is written in the plan document. */
  unlocated?: boolean
}

export interface Mandate {
  role: string
  /** Office held (not the one being run for), used by the dashboard filters. */
  officeType: OfficeType
  period: string
  situation: 'em-exercicio' | 'encerrado'
  campaignYear: number
  promises: CampaignPromise[]
}

export type OfficeType =
  | 'presidente'
  | 'governador'
  | 'senador'
  | 'prefeito'
  | 'deputado-federal'
  | 'deputado-estadual'
  | 'vereador'

/** Presidents have national scope and no location. */
export interface CandidateLocation {
  uf: string
  city?: string
  neighborhood?: string
}

export interface Candidate {
  id: string
  name: string
  ballotName: string
  party: string
  partyName: string
  type: OfficeType
  office: string
  location?: CandidateLocation
  election: string
  planVersion: string
  planDate: string
  pages: number
  color: string
  origin: 'catalogo' | 'enviado'
  /** Missing key = the plan does not address the theme (lacuna). */
  themes: Partial<Record<ThemeId, ThemeEntry>>
  /** null = no previous mandate; undefined = history not available (uploaded plans). */
  mandate?: Mandate | null
}

export interface Profile {
  uf: string | null
  municipio: string
  faixaEtaria: string | null
  vinculo: string | null
  ramo: string | null
  rendaAtual: number | null
  rendaFutura: number | null
  filhos: boolean
  moradia: string | null
}

export type RiskLevel = 'baixo' | 'medio' | 'alto' | 'lacuna'
export type Weight = 0 | 1 | 2 | 3

export type SubmissionKind = 'site' | 'arquivo' | 'marcacao'
export type SubmissionType = 'informacao' | 'correcao' | 'marcacao'

/** Rectangle on a plan page, normalized to 0..1 of the page width and height. */
export interface PageBox {
  x: number
  y: number
  w: number
  h: number
}

/** A community label: where a commitment is written in the campaign plan document. */
export interface DocumentLabel {
  page: number
  box: PageBox
  /** Set when the label proposes a commitment that is not yet in the list. */
  newPromise?: { text: string; theme: ThemeId }
}
/** recebida/em-analise = still in the curation queue; the rest are decided. */
export type SubmissionStatus = 'recebida' | 'em-analise' | 'aprovada' | 'rejeitada'

export interface Submission {
  id: string
  candidateId: string
  kind: SubmissionKind
  type: SubmissionType
  title: string
  description: string
  /** Only for kind = "site". */
  url?: string
  /** Only for kind = "arquivo". */
  fileName?: string
  fileSize?: number
  /** Optional: the campaign commitment this refers to. */
  promiseId?: string
  /** Only for kind = "marcacao". */
  label?: DocumentLabel
  status: SubmissionStatus
  votes: number
  createdAt: string
  decidedAt?: string
  curatorNote?: string
}
