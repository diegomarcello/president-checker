import { FlagStripe, Logo } from '@/components/brand'
import { reopenConsentBanner } from '@/lib/analytics'

export function SiteFooter() {
  return (
    <footer className="border-t border-hairline bg-white text-charcoal">
      <div className="mx-auto grid max-w-[1280px] gap-8 px-4 py-12 sm:px-8 md:grid-cols-[1.5fr_1fr_1fr]">
        <div>
          <Logo />
          <p className="mt-4 max-w-sm text-sm text-steel">
            Compara candidatos e políticos à luz do seu contexto, a partir dos planos de governo. Não recomenda voto e não é afiliado a nenhum
            partido, candidato ou órgão eleitoral.
          </p>
        </div>
        <div>
          <h3 className="text-sm font-semibold">Produto</h3>
          <ul className="mt-3 space-y-1.5 text-sm text-steel">
            <li><a href="#como-funciona" className="hover:text-ink">Como funciona</a></li>
            <li><a href="#/termos" className="hover:text-ink">Termos de uso</a></li>
            <li><a href="#/registro" className="hover:text-ink">Meu registro de uso</a></li>
            <li>
              <button type="button" onClick={reopenConsentBanner} className="hover:text-ink">
                Preferências de cookies
              </button>
            </li>
            <li><a href="#/em-exercicio" className="hover:text-ink">Painel em exercício</a></li>
            <li><a href="#/curadoria" className="hover:text-ink">Curadoria e contribuições</a></li>
            <li><a href="#/comparar" className="hover:text-ink">Comparar candidatos</a></li>
            <li><a href="#privacidade" className="hover:text-ink">Privacidade e LGPD</a></li>
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-semibold">Aviso</h3>
          <p className="mt-3 text-sm text-steel">
            Candidatos, partidos e planos exibidos são fictícios e servem apenas para demonstração. A análise
            é automatizada e pode conter erros. É proibida a coleta automatizada e o uso para treinar IA, conforme os{' '}
            <a href="#/termos" className="underline hover:text-ink">termos de uso</a>.
          </p>
        </div>
      </div>
      <FlagStripe />
    </footer>
  )
}
