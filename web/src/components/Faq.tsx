import { Lock } from 'lucide-react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

const ITEMS = [
  {
    q: 'O sistema recomenda em quem votar?',
    a: 'Não. Ele compara propostas com os mesmos critérios para todos os candidatos, não gera nota final e não ordena candidatos por resultado. A leitura e a decisão são suas.',
  },
  {
    q: 'Quais dados meus são usados?',
    a: 'Apenas dados de contexto não sensíveis e opcionais: estado, faixa etária, ramo, vínculo de trabalho e faixas de renda. Não pedimos nome, CPF, e-mail, intenção de voto ou qualquer dado sensível previsto na LGPD.',
  },
  {
    q: 'Idade e renda não são protegidas pela LGPD?',
    a: 'São dados pessoais e a LGPD se aplica a eles, mas não são dados pessoais sensíveis. Por isso coletamos em faixas, de forma anônima, sem login, e só mantemos durante a sua sessão. O perfil e as suas escolhas ficam só no seu navegador. Se você aceitar, contamos visitas com o Google Analytics, mas nunca enviamos candidatos consultados, perfil ou prioridades. Separadamente, você pode ligar um registro anônimo do que você vê para melhorar o Confere; ele vem desligado e você vê, baixa e apaga em "Meu registro de uso".',
  },
  {
    q: 'O que significa "plano não verificado"?',
    a: 'É um PDF que você mesmo enviou. Ele é processado na hora, vale só para a sua visita e recebe o selo de não verificado, porque não passou pela revisão da curadoria. Planos do catálogo levam o selo de verificado.',
  },
  {
    q: 'Como o risco é calculado?',
    a: 'Combinamos o quanto a proposta é concreta (meta, prazo, público, fonte de recursos), sua viabilidade e o efeito sobre o seu perfil. Cada nível mostra os sinais que pesaram, e toda afirmação cita a página do plano.',
  },
]

export function Faq() {
  return (
    <section id="privacidade" className="bg-surface">
      <div className="mx-auto grid max-w-[1280px] gap-10 px-4 py-16 sm:px-8 md:py-24 lg:grid-cols-[1fr_1.4fr]">
        <div>
          <p className="text-micro-caps text-link">Privacidade e LGPD</p>
          <h2 className="text-h2 mt-3">Perguntas frequentes</h2>
          <p className="mt-4 max-w-md text-slate">
            Transparência sobre o que usamos, o que nunca coletamos e como chegamos a cada conclusão.
          </p>
          <div className="mt-6 flex max-w-md items-start gap-3 rounded-lg bg-tint-mint p-5 text-charcoal">
            <Lock className="mt-0.5 size-5 shrink-0" aria-hidden />
            <p className="text-sm leading-relaxed">
              Nunca perguntamos sua preferência política, religião, saúde ou outros dados sensíveis. Suas
              prioridades e escolhas de candidatos não são guardadas junto a uma pessoa.
            </p>
          </div>
        </div>
        <Accordion type="single" collapsible className="rounded-lg border border-hairline bg-white px-5">
          {ITEMS.map((item, i) => (
            <AccordionItem key={item.q} value={`faq-${i}`}>
              <AccordionTrigger className="text-left text-[17px] font-semibold">{item.q}</AccordionTrigger>
              <AccordionContent className="text-[15px] leading-relaxed text-slate">{item.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
