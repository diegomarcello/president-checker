import { ArrowRight, FileCheck2, GitCompareArrows, MapPinned, SlidersHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'

const STEPS = [
  {
    icon: MapPinned,
    tint: 'bg-tint-mint',
    title: '1. Conte seu contexto',
    text: 'Estado, faixa etária, ramo de atuação e renda atual e esperada. Tudo opcional, em faixas e só durante a sua visita.',
  },
  {
    icon: SlidersHorizontal,
    tint: 'bg-tint-sky',
    title: '2. Ajuste as prioridades',
    text: 'Sugerimos os temas mais relevantes para o seu perfil e você decide o peso de cada um: economia, segurança, saúde e mais.',
  },
  {
    icon: GitCompareArrows,
    tint: 'bg-tint-peach',
    title: '3. Escolha até 3 candidatos',
    text: 'Navegue pelo catálogo de candidatos já processados ou envie o PDF do plano de um político, como num comparador de produtos.',
  },
  {
    icon: FileCheck2,
    tint: 'bg-tint-lavender',
    title: '4. Leia o mapa e o histórico',
    text: 'Pontos fortes, fracos e lacunas por tema, com gráficos. Para quem já teve mandato, veja o que prometeu, o que entregou e o que falta.',
  },
]

export function HowItWorks({ onStart }: { onStart: () => void }) {
  return (
    <section id="como-funciona" className="mx-auto max-w-[1280px] px-4 py-16 sm:px-8 md:py-24">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-micro-caps text-link">Como funciona</p>
        <h2 className="text-display mt-3">Do Oiapoque ao Chuí, a mesma régua para todos</h2>
        <p className="mt-4 text-lg text-slate">
          Todos os políticos são avaliados pelos mesmos temas, perguntas e critérios. O que muda é o que pesa para você.
        </p>
      </div>
      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {STEPS.map((s) => (
          <article key={s.title} className={`${s.tint} rounded-lg p-6 text-charcoal sm:p-8`}>
            <s.icon className="size-7" aria-hidden />
            <h3 className="mt-5 text-[22px] leading-tight">{s.title}</h3>
            <p className="mt-3 text-[15px] leading-relaxed">{s.text}</p>
          </article>
        ))}
      </div>
      <div className="mt-10 text-center">
        <Button size="lg" className="h-11 px-5 text-[15px]" onClick={onStart}>
          Começar pelo meu perfil <ArrowRight />
        </Button>
      </div>
    </section>
  )
}
