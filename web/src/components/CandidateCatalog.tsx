import { useMemo, useState } from 'react'
import { Check, FilePlus2, MapPin, Plus, Search, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { CandidateAvatar, MandateBadge, OriginSeal } from '@/components/brand'
import { SectionFeedback } from '@/components/SectionFeedback'
import { OFFICES, OFFICE_BY_VALUE } from '@/data/offices'
import { THEMES } from '@/data/themes'
import { UFS } from '@/data/ufs'
import type { Candidate, OfficeType } from '@/data/types'
import { cn } from '@/lib/utils'

type Origin = 'todos' | 'catalogo' | 'enviado'
type OfficeFilter = 'todos' | OfficeType

const ORIGINS: { value: Origin; label: string }[] = [
  { value: 'todos', label: 'Todos' },
  { value: 'catalogo', label: 'Verificados' },
  { value: 'enviado', label: 'Enviados por mim' },
]

const ALL = 'all'
const collator = new Intl.Collator('pt-BR')

const norm = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()

interface Props {
  candidates: Candidate[]
  selected: string[]
  max: number
  onToggle: (id: string) => void
  onUpload: () => void
  /** State chosen in the profile step, offered as a one-click filter. */
  suggestedUf?: string | null
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        'shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition-colors focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none',
        active ? 'border-ink-deep bg-ink-deep text-white' : 'border-hairline text-steel hover:bg-surface',
      )}
    >
      {children}
    </button>
  )
}

function locationLabel(c: Candidate): string {
  if (!c.location) return 'Abrangência nacional'
  const parts = [c.location.neighborhood, c.location.city, c.location.uf].filter(Boolean)
  return parts.join(' · ')
}

export function CandidateCatalog({ candidates, selected, max, onToggle, onUpload, suggestedUf }: Props) {
  const [query, setQuery] = useState('')
  const [origin, setOrigin] = useState<Origin>('todos')
  const [office, setOffice] = useState<OfficeFilter>('todos')
  const [uf, setUf] = useState(ALL)
  const [city, setCity] = useState(ALL)
  const [hood, setHood] = useState(ALL)
  const full = selected.length >= max

  // Presidents have national scope: location filters do not apply to them.
  const showLocation = office === 'todos' || OFFICE_BY_VALUE[office].hasLocation
  const locationActive = showLocation && (uf !== ALL || city !== ALL || hood !== ALL)

  const cities = useMemo(() => {
    const set = new Set<string>()
    for (const c of candidates) {
      if (c.location?.city && (uf === ALL || c.location.uf === uf)) set.add(c.location.city)
    }
    return [...set].sort(collator.compare)
  }, [candidates, uf])

  const hoods = useMemo(() => {
    const set = new Set<string>()
    for (const c of candidates) {
      const l = c.location
      if (l?.neighborhood && (uf === ALL || l.uf === uf) && l.city === city) set.add(l.neighborhood)
    }
    return [...set].sort(collator.compare)
  }, [candidates, uf, city])

  const visible = useMemo(() => {
    const q = norm(query.trim())
    return candidates
      .filter((c) => origin === 'todos' || c.origin === origin)
      .filter((c) => office === 'todos' || c.type === office)
      .filter((c) => {
        if (!locationActive) return true
        const l = c.location
        if (!l) return false // president: no location, excluded once a place is chosen
        return (
          (uf === ALL || l.uf === uf) &&
          (city === ALL || l.city === city) &&
          (hood === ALL || l.neighborhood === hood)
        )
      })
      .filter((c) => !q || norm(c.name).includes(q) || norm(c.party).includes(q) || norm(c.partyName).includes(q))
      .sort((a, b) => collator.compare(a.name, b.name))
  }, [candidates, query, origin, office, uf, city, hood, locationActive])

  const filtersActive = query.trim() !== '' || origin !== 'todos' || office !== 'todos' || locationActive

  const clearAll = () => {
    setQuery('')
    setOrigin('todos')
    setOffice('todos')
    setUf(ALL)
    setCity(ALL)
    setHood(ALL)
  }

  const chooseOffice = (value: OfficeFilter) => {
    setOffice(value)
    if (value !== 'todos' && !OFFICE_BY_VALUE[value].hasLocation) {
      setUf(ALL)
      setCity(ALL)
      setHood(ALL)
    }
  }

  const chooseUf = (value: string) => {
    setUf(value)
    setCity(ALL)
    setHood(ALL)
  }

  const chooseCity = (value: string) => {
    setCity(value)
    setHood(ALL)
  }

  return (
    <div>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="relative md:w-96">
            <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-steel" aria-hidden />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar por nome do candidato"
              aria-label="Filtrar por nome do candidato"
              className="h-11 border-hairline bg-surface pl-10 text-base"
            />
          </div>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrar por origem do plano">
            {ORIGINS.map((o) => (
              <Chip key={o.value} active={origin === o.value} onClick={() => setOrigin(o.value)}>
                {o.label}
              </Chip>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-2 text-sm font-medium text-charcoal" id="office-filter-label">
            Cargo
          </p>
          <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0" role="group" aria-labelledby="office-filter-label">
            <Chip active={office === 'todos'} onClick={() => chooseOffice('todos')}>
              Todos os cargos
            </Chip>
            {OFFICES.map((o) => (
              <Chip key={o.value} active={office === o.value} onClick={() => chooseOffice(o.value)}>
                {o.label}
              </Chip>
            ))}
          </div>
        </div>

        {showLocation ? (
          <div className="rounded-lg border border-hairline bg-surface-soft p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="flex items-center gap-2 text-sm font-medium text-charcoal">
                <MapPin className="size-4 text-steel" aria-hidden /> Local (opcional)
              </p>
              {suggestedUf && uf !== suggestedUf && (
                <Button type="button" variant="ghost" size="sm" onClick={() => chooseUf(suggestedUf)}>
                  Usar meu estado ({suggestedUf})
                </Button>
              )}
            </div>
            <div className="mt-3 grid gap-3 sm:grid-cols-3">
              <Select value={uf} onValueChange={chooseUf}>
                <SelectTrigger className="h-11 w-full bg-white" aria-label="Estado">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ALL}>Todos os estados</SelectItem>
                  {UFS.slice()
                    .sort((a, b) => collator.compare(a.nome, b.nome))
                    .map((u) => (
                      <SelectItem key={u.sigla} value={u.sigla}>
                        {u.nome}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              <Select value={city} onValueChange={chooseCity} disabled={cities.length === 0}>
                <SelectTrigger className="h-11 w-full bg-white" aria-label="Cidade">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ALL}>Todas as cidades</SelectItem>
                  {cities.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={hood} onValueChange={setHood} disabled={city === ALL || hoods.length === 0}>
                <SelectTrigger className="h-11 w-full bg-white" aria-label="Bairro">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ALL}>Todos os bairros</SelectItem>
                  {hoods.map((h) => (
                    <SelectItem key={h} value={h}>
                      {h}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <p className="mt-2 text-xs text-steel">
              Cidade e bairro mostram os locais que têm candidatos no catálogo. Presidente tem abrangência nacional e não
              entra nos filtros de local.
            </p>
          </div>
        ) : (
          <p className="rounded-lg bg-surface p-3 text-sm text-slate">
            Presidente tem abrangência nacional, por isso não há filtro de estado, cidade ou bairro.
          </p>
        )}
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-steel" role="status" aria-live="polite">
          Ordem alfabética, sem destaques. {filtersActive ? `${visible.length} de ${candidates.length}` : candidates.length}{' '}
          candidatos {filtersActive ? 'encontrados' : 'disponíveis'}.
        </p>
        {filtersActive && (
          <Button type="button" variant="ghost" size="sm" onClick={clearAll}>
            <X /> Limpar filtros
          </Button>
        )}
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <button
          type="button"
          onClick={onUpload}
          className="flex min-h-[220px] flex-col items-start justify-between rounded-lg bg-tint-yellow-bold p-6 text-left text-charcoal transition-shadow hover:shadow-card focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none sm:p-8"
        >
          <FilePlus2 className="size-8" aria-hidden />
          <span>
            <span className="block text-[22px] leading-tight font-semibold">Adicionar político por PDF</span>
            <span className="mt-2 block text-[15px] leading-relaxed">
              Não encontrou o político? Envie o PDF do plano de governo dele e compare com os candidatos do catálogo. Ele
              entra com o selo <strong>não verificado</strong>.
            </span>
          </span>
        </button>

        {visible.map((c) => {
          const isSelected = selected.includes(c.id)
          const covered = THEMES.filter((t) => c.themes[t.id])
          return (
            <article
              key={c.id}
              className={cn(
                'flex flex-col rounded-lg border bg-white p-6 transition-shadow',
                isSelected ? 'border-2 border-primary bg-surface shadow-card' : 'border-hairline',
              )}
            >
              <div className="flex items-start gap-3">
                <CandidateAvatar candidate={c} className="size-12 text-base" />
                <div className="min-w-0">
                  <h3 className="truncate text-lg leading-snug">{c.ballotName}</h3>
                  <p className="truncate text-sm text-steel">
                    {c.partyName}
                    {c.party !== '—' && ` (${c.party})`}
                  </p>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <OriginSeal origin={c.origin} />
                <span className="rounded-sm bg-tint-lavender px-2 py-0.5 text-[13px] font-semibold text-brand-purple-800">
                  {c.office}
                </span>
                <MandateBadge mandate={c.mandate} />
              </div>
              <p className="mt-3 flex items-center gap-1.5 text-sm text-slate">
                <MapPin className="size-3.5 shrink-0 text-steel" aria-hidden /> {locationLabel(c)}
              </p>
              <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div>
                  <dt className="text-steel">Plano</dt>
                  <dd className="font-medium">
                    {c.planVersion} · {c.planDate}
                  </dd>
                </div>
                <div>
                  <dt className="text-steel">Páginas</dt>
                  <dd className="font-medium">{c.pages}</dd>
                </div>
              </dl>
              <div className="mt-4">
                <p className="text-sm text-steel">
                  Aborda {covered.length} de {THEMES.length} temas
                </p>
                <ul className="mt-2 flex gap-1.5" aria-label="Temas abordados">
                  {THEMES.map((t) => (
                    <li
                      key={t.id}
                      title={`${t.label}: ${c.themes[t.id] ? 'abordado' : 'lacuna'}`}
                      className={cn(
                        'flex size-8 items-center justify-center rounded-md',
                        c.themes[t.id] ? `${t.tint} text-charcoal` : 'border border-dashed border-hairline-strong text-stone',
                      )}
                    >
                      <t.icon className="size-4" aria-hidden />
                      <span className="sr-only">
                        {t.label}: {c.themes[t.id] ? 'abordado' : 'lacuna'}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              <Button
                size="lg"
                variant={isSelected ? 'outline' : 'default'}
                disabled={!isSelected && full}
                onClick={() => onToggle(c.id)}
                aria-pressed={isSelected}
                className="mt-6 w-full"
              >
                {isSelected ? (
                  <>
                    <Check /> Na comparação · remover
                  </>
                ) : full ? (
                  `Limite de ${max} candidatos`
                ) : (
                  <>
                    <Plus /> Adicionar à comparação
                  </>
                )}
              </Button>
            </article>
          )
        })}
      </div>

      <SectionFeedback
        className="mt-8"
        section="candidatos:catalogo"
        label="Candidatos · catálogo e filtros"
        prompt="O catálogo e os filtros fazem sentido para você?"
      />

      {visible.length === 0 && (
        <div className="mt-6 rounded-lg bg-surface p-6 text-center text-slate">
          <p>Nenhum candidato encontrado com esses filtros.</p>
          <div className="mt-3 flex flex-wrap justify-center gap-2">
            {filtersActive && (
              <Button variant="outline" onClick={clearAll}>
                Limpar filtros
              </Button>
            )}
            <Button onClick={onUpload}>Enviar o PDF do plano</Button>
          </div>
        </div>
      )}
    </div>
  )
}
