import type { Region } from './types'

export interface UF {
  sigla: string
  nome: string
  regiao: Region
  /** Position on the tile-grid cartogram of Brazil (0-based). */
  col: number
  row: number
}

export const REGIONS: Record<Region, { label: string; tile: string }> = {
  norte: { label: 'Norte', tile: 'bg-tint-mint' },
  nordeste: { label: 'Nordeste', tile: 'bg-tint-peach' },
  'centro-oeste': { label: 'Centro-Oeste', tile: 'bg-tint-yellow' },
  sudeste: { label: 'Sudeste', tile: 'bg-tint-sky' },
  sul: { label: 'Sul', tile: 'bg-tint-lavender' },
}

export const UFS: UF[] = [
  { sigla: 'RR', nome: 'Roraima', regiao: 'norte', col: 1, row: 0 },
  { sigla: 'AP', nome: 'Amapá', regiao: 'norte', col: 3, row: 0 },
  { sigla: 'AM', nome: 'Amazonas', regiao: 'norte', col: 1, row: 1 },
  { sigla: 'PA', nome: 'Pará', regiao: 'norte', col: 3, row: 1 },
  { sigla: 'MA', nome: 'Maranhão', regiao: 'nordeste', col: 4, row: 1 },
  { sigla: 'CE', nome: 'Ceará', regiao: 'nordeste', col: 5, row: 1 },
  { sigla: 'RN', nome: 'Rio Grande do Norte', regiao: 'nordeste', col: 6, row: 1 },
  { sigla: 'AC', nome: 'Acre', regiao: 'norte', col: 0, row: 2 },
  { sigla: 'RO', nome: 'Rondônia', regiao: 'norte', col: 1, row: 2 },
  { sigla: 'MT', nome: 'Mato Grosso', regiao: 'centro-oeste', col: 2, row: 2 },
  { sigla: 'TO', nome: 'Tocantins', regiao: 'norte', col: 3, row: 2 },
  { sigla: 'PI', nome: 'Piauí', regiao: 'nordeste', col: 4, row: 2 },
  { sigla: 'PE', nome: 'Pernambuco', regiao: 'nordeste', col: 5, row: 2 },
  { sigla: 'PB', nome: 'Paraíba', regiao: 'nordeste', col: 6, row: 2 },
  { sigla: 'AL', nome: 'Alagoas', regiao: 'nordeste', col: 7, row: 2 },
  { sigla: 'MS', nome: 'Mato Grosso do Sul', regiao: 'centro-oeste', col: 2, row: 3 },
  { sigla: 'GO', nome: 'Goiás', regiao: 'centro-oeste', col: 3, row: 3 },
  { sigla: 'DF', nome: 'Distrito Federal', regiao: 'centro-oeste', col: 4, row: 3 },
  { sigla: 'BA', nome: 'Bahia', regiao: 'nordeste', col: 5, row: 3 },
  { sigla: 'SE', nome: 'Sergipe', regiao: 'nordeste', col: 6, row: 3 },
  { sigla: 'PR', nome: 'Paraná', regiao: 'sul', col: 2, row: 4 },
  { sigla: 'SP', nome: 'São Paulo', regiao: 'sudeste', col: 3, row: 4 },
  { sigla: 'MG', nome: 'Minas Gerais', regiao: 'sudeste', col: 4, row: 4 },
  { sigla: 'ES', nome: 'Espírito Santo', regiao: 'sudeste', col: 5, row: 4 },
  { sigla: 'SC', nome: 'Santa Catarina', regiao: 'sul', col: 2, row: 5 },
  { sigla: 'RJ', nome: 'Rio de Janeiro', regiao: 'sudeste', col: 4, row: 5 },
  { sigla: 'RS', nome: 'Rio Grande do Sul', regiao: 'sul', col: 2, row: 6 },
]

export const UF_BY_SIGLA = Object.fromEntries(
  UFS.map((u) => [u.sigla, u]),
) as Record<string, UF>
