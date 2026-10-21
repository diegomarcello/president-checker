import type { OfficeType } from './types'

export interface OfficeMeta {
  value: OfficeType
  label: string
  /** Presidents run nationally: no state, city or neighborhood filters. */
  hasLocation: boolean
}

export const OFFICES: OfficeMeta[] = [
  { value: 'presidente', label: 'Presidente', hasLocation: false },
  { value: 'governador', label: 'Governador', hasLocation: true },
  { value: 'senador', label: 'Senador', hasLocation: true },
  { value: 'deputado-federal', label: 'Deputado federal', hasLocation: true },
  { value: 'deputado-estadual', label: 'Deputado estadual', hasLocation: true },
  { value: 'prefeito', label: 'Prefeito', hasLocation: true },
  { value: 'vereador', label: 'Vereador', hasLocation: true },
]

export const OFFICE_BY_VALUE = Object.fromEntries(OFFICES.map((o) => [o.value, o])) as Record<OfficeType, OfficeMeta>
