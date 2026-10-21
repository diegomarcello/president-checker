import { ArrowRight, BarChart3 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { Candidate } from '@/data/types'
import { STATUS_COLOR, flattenPromises, withMandate } from '@/lib/mandate'

/** Landing-page entry point to the "Em exercício" dashboard. */
export function IncumbentsTeaser({ candidates, onOpen }: { candidates: Candidate[]; onOpen: () => void }) {
  const incumbents = withMandate(candidates, 'em-exercicio')
  if (incumbents.length === 0) return null
  const rows = flattenPromises(incumbents)
  const count = (s: 'concluida' | 'andamento' | 'pendente') => rows.filter((r) => r.promise.status === s).length

  const stats = [
    { value: incumbents.length, label: 'em exercício', color: undefined },
    { value: count('concluida'), label: 'compromissos concluídos', color: STATUS_COLOR.concluida },
    { value: count('andamento'), label: 'em andamento', color: STATUS_COLOR.andamento },
    { value: count('pendente'), label: 'pendentes', color: STATUS_COLOR.pendente },
  ]

  return (
    <section id="em-exercicio" className="bg-surface">
      <div className="mx-auto grid max-w-[1280px] items-center gap-8 px-4 py-14 sm:px-8 md:py-20 lg:grid-cols-[1.1fr_1fr]">
        <div>
          <p className="text-micro-caps text-link">Painel de análise · Em exercício</p>
          <h2 className="text-display mt-3">Quem está no cargo e o que já entregou</h2>
          <p className="mt-4 max-w-xl text-lg text-slate">
            Um painel com gráficos e filtros mostra o que cada político prometeu na última campanha, o que concluiu, o que
            está fazendo e o que ainda falta.
          </p>
          <Button size="lg" className="mt-6 h-11 px-5 text-[15px]" onClick={onOpen}>
            <BarChart3 /> Abrir o painel de análise <ArrowRight />
          </Button>
        </div>
        <div
          className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-hairline bg-hairline"
          role="group"
          aria-label="Resumo dos políticos em exercício"
        >
          {stats.map((s) => (
            <div key={s.label} className="bg-white p-5 text-center sm:p-6">
              <p className="text-4xl font-semibold tracking-tight" style={{ color: s.color }}>
                {s.value}
              </p>
              <p className="mt-1 text-sm text-slate">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
