import { ArrowRight, FileSearch, ShieldCheck, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CandidateAvatar, RiskBadge } from '@/components/brand'
import { CATALOG } from '@/data/candidates'
import { THEMES } from '@/data/themes'
import { analyzeTheme } from '@/lib/analysis'
import { profileTags } from '@/lib/profile'
import { EMPTY_PROFILE } from '@/lib/profile'

/** Brand-colored "sticky-note" dots and a losango, as in the DESIGN.md hero. */
function Decor() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <svg className="absolute -top-10 -right-24 hidden w-[620px] opacity-40 md:block" viewBox="0 0 620 420" fill="none">
        <path d="M310 20 600 210 310 400 20 210Z" stroke="#1a2a52" strokeWidth="2" />
        <path d="M310 70 540 210 310 350 80 210Z" stroke="#1a2a52" strokeWidth="2" />
        <circle cx="310" cy="210" r="104" stroke="#1a2a52" strokeWidth="2" />
        <path d="M200 190c80-26 170-10 250 40" stroke="#1a2a52" strokeWidth="2" />
      </svg>
      <span className="absolute top-14 left-[6%] size-6 rotate-12 rounded-sm bg-br-yellow" />
      <span className="absolute top-28 left-[16%] size-4 rounded-full bg-br-green" />
      <span className="absolute top-10 right-[34%] size-5 -rotate-12 rounded-sm bg-brand-pink" />
      <span className="absolute top-[42%] left-[3%] size-5 rounded-full bg-link" />
      <span className="absolute top-[38%] right-[5%] size-6 rotate-45 rounded-sm bg-br-yellow" />
      <span className="absolute right-[12%] bottom-[34%] size-4 rounded-full bg-br-green" />
      <span className="absolute bottom-[24%] left-[10%] size-4 rotate-6 rounded-sm bg-brand-purple" />
    </div>
  )
}

function MockupCard() {
  const tags = profileTags(EMPTY_PROFILE)
  const shown = CATALOG.slice(0, 3)
  const themes = THEMES.slice(0, 4)
  return (
    <div
      className="mx-auto w-full max-w-3xl overflow-hidden rounded-lg border border-hairline bg-white text-left text-ink shadow-mockup"
      role="img"
      aria-label="Exemplo do mapa de risco com três candidatos fictícios e quatro temas"
    >
      <div className="flex items-center gap-2 border-b border-hairline bg-surface-soft px-4 py-3">
        <span className="size-2.5 rounded-full bg-danger/70" />
        <span className="size-2.5 rounded-full bg-br-yellow" />
        <span className="size-2.5 rounded-full bg-success" />
        <span className="ml-3 text-xs font-medium text-steel">Mapa de risco · exemplo com dados fictícios</span>
      </div>
      <div className="overflow-x-auto">
        <div className="min-w-[520px] p-4 sm:p-5">
          <div className="grid grid-cols-[1.1fr_repeat(3,1fr)] items-center gap-3 pb-3">
            <span className="text-micro-caps text-steel">Tema</span>
            {shown.map((c) => (
              <span key={c.id} className="flex items-center gap-2 text-sm font-semibold">
                <CandidateAvatar candidate={c} className="size-7 text-[11px]" />
                <span className="truncate">{c.name.split(' ')[0]}</span>
              </span>
            ))}
          </div>
          {themes.map((t) => (
            <div
              key={t.id}
              className="grid grid-cols-[1.1fr_repeat(3,1fr)] items-center gap-3 border-t border-hairline-soft py-3"
            >
              <span className="flex items-center gap-2 text-sm font-medium">
                <t.icon className="size-4 text-steel" aria-hidden /> {t.short}
              </span>
              {shown.map((c) => (
                <RiskBadge key={c.id} level={analyzeTheme(c, t.id, tags).level} short />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function Hero({ onStart }: { onStart: () => void }) {
  return (
    <section id="topo" className="relative isolate bg-navy text-white">
      <Decor />
      <div className="relative mx-auto max-w-[1280px] px-4 pt-14 pb-16 text-center sm:px-8 sm:pt-20 md:pb-24">
        <p className="mx-auto mb-5 inline-flex items-center gap-2 rounded-full border border-navy-mid bg-navy-deep px-3.5 py-1.5 text-[13px] font-semibold text-on-dark-muted">
          <span className="inline-flex size-4 items-center justify-center rounded-full bg-br-green">
            <span className="size-2 rotate-45 bg-br-yellow" />
          </span>
          Feito para o eleitor brasileiro · Dados de demonstração
        </p>
        <h1 className="text-hero mx-auto max-w-4xl">
          Compare candidatos e políticos pelo que importa para o <span className="text-br-yellow">seu Brasil</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-on-dark-muted">
          Conte um pouco do seu contexto, escolha até 3 candidatos e veja lado a lado pontos fortes, pontos fracos e
          riscos de cada político, com base no que consta em seus planos de governo e sempre com a página de origem. Sem recomendar voto.
        </p>
        <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
          <Button
            size="lg"
            className="h-11 bg-primary px-5 text-[15px]"
            onClick={onStart}
          >
            Começar a comparar <ArrowRight />
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="h-11 border-on-dark-muted bg-transparent px-5 text-[15px] text-white hover:bg-navy-mid hover:text-white"
          >
            <a href="#como-funciona">Como funciona</a>
          </Button>
        </div>
        <ul className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-on-dark-muted">
          <li className="inline-flex items-center gap-2">
            <FileSearch className="size-4 text-br-yellow" aria-hidden /> Citação da página em cada afirmação
          </li>
          <li className="inline-flex items-center gap-2">
            <ShieldCheck className="size-4 text-br-yellow" aria-hidden /> Sem login, sem dados sensíveis
          </li>
          <li className="inline-flex items-center gap-2">
            <Sparkles className="size-4 text-br-yellow" aria-hidden /> Mesmos critérios para todos
          </li>
        </ul>
        <div className="mt-12 md:mt-16">
          <MockupCard />
        </div>
      </div>
    </section>
  )
}
