export type Step = 'perfil' | 'candidatos' | 'resultado'

export const STEPS: { value: Step; label: string }[] = [
  { value: 'perfil', label: 'Seu perfil' },
  { value: 'candidatos', label: 'Candidatos' },
  { value: 'resultado', label: 'Comparação' },
]
