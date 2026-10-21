import { BadgeCheck, CircleHelp, TriangleAlert } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { LEVEL_LABEL } from '@/lib/analysis'
import type { Candidate, Mandate, RiskLevel } from '@/data/types'
import { mandateTag } from '@/lib/mandate'
import { cn } from '@/lib/utils'

/** Verde, amarelo e azul: faixa fina usada no topo do site. */
export function FlagStripe({ className }: { className?: string }) {
  return (
    <div className={cn('flex h-1 w-full', className)} aria-hidden>
      <span className="flex-1 bg-br-green" />
      <span className="flex-1 bg-br-yellow" />
      <span className="flex-1 bg-br-blue" />
    </div>
  )
}

/** Losango amarelo sobre fundo verde, com círculo azul: homenagem às cores da bandeira. */
export function Logo({ className, dark }: { className?: string; dark?: boolean }) {
  return (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      <svg viewBox="0 0 32 32" className="size-8 shrink-0" aria-hidden>
        <rect width="32" height="32" rx="8" fill="#009c3b" />
        <path d="M16 5 28 16 16 27 4 16Z" fill="#ffdf00" />
        <circle cx="16" cy="16" r="5.2" fill="#002776" />
        <path d="M11.2 15.2c3.2-.9 6.3-.3 9.4 1.4" stroke="#fff" strokeWidth="1.1" fill="none" />
      </svg>
      <span
        className={cn(
          'text-[17px] font-semibold tracking-tight',
          dark ? 'text-white' : 'text-ink-deep',
        )}
      >
        Confere
      </span>
    </span>
  )
}

function initials(name: string) {
  const parts = name.split(' ').filter(Boolean)
  return (parts[0]?.[0] ?? '') + (parts.length > 1 ? parts[parts.length - 1][0] : '')
}

export function CandidateAvatar({
  candidate,
  className,
}: {
  candidate: Pick<Candidate, 'name' | 'color'>
  className?: string
}) {
  return (
    <span
      aria-hidden
      className={cn(
        'inline-flex size-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white',
        className,
      )}
      style={{ backgroundColor: candidate.color }}
    >
      {initials(candidate.name)}
    </span>
  )
}

const LEVEL_STYLE: Record<RiskLevel, string> = {
  baixo: 'bg-tint-mint text-[#0f6b22] border-transparent',
  medio: 'bg-tint-yellow-bold text-brand-brown border-transparent',
  alto: 'bg-tint-rose text-[#a31616] border-transparent',
  lacuna: 'bg-tint-gray text-slate border-transparent',
}

const LEVEL_DOT: Record<RiskLevel, string> = {
  baixo: 'bg-success',
  medio: 'bg-brand-yellow',
  alto: 'bg-danger',
  lacuna: 'bg-stone',
}

export function RiskBadge({
  level,
  className,
  short,
}: {
  level: RiskLevel
  className?: string
  short?: boolean
}) {
  const label = short ? LEVEL_LABEL[level].replace('Risco ', '') : LEVEL_LABEL[level]
  return (
    <Badge
      variant="outline"
      className={cn('gap-1.5 rounded-sm px-2 py-0.5 text-[13px] font-semibold', LEVEL_STYLE[level], className)}
    >
      <span className={cn('size-2 rounded-full', LEVEL_DOT[level])} aria-hidden />
      {label}
    </Badge>
  )
}

export function OriginSeal({ origin, className }: { origin: Candidate['origin']; className?: string }) {
  if (origin === 'catalogo') {
    return (
      <span
        className={cn(
          'inline-flex items-center gap-1 rounded-sm bg-tint-mint px-2 py-0.5 text-[13px] font-semibold text-[#0f6b22]',
          className,
        )}
      >
        <BadgeCheck className="size-3.5" aria-hidden /> Verificado
      </span>
    )
  }
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-sm bg-tint-peach px-2 py-0.5 text-[13px] font-semibold text-brand-orange-deep',
        className,
      )}
    >
      <TriangleAlert className="size-3.5" aria-hidden /> Não verificado
    </span>
  )
}

export function HelpHint() {
  return <CircleHelp className="size-4 text-steel" aria-hidden />
}

const MANDATE_STYLE = {
  ativo: 'bg-tint-mint text-[#0f6b22]',
  ex: 'bg-tint-lavender text-brand-purple-800',
  novo: 'bg-tint-gray text-slate',
} as const

export function MandateBadge({
  mandate,
  className,
}: {
  mandate: Mandate | null | undefined
  className?: string
}) {
  const tag = mandateTag(mandate)
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-sm px-2 py-0.5 text-[13px] font-semibold',
        MANDATE_STYLE[tag.tone],
        className,
      )}
    >
      {tag.label}
    </span>
  )
}
