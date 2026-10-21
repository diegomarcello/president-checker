import { SubPageHeader } from '@/components/SubPageHeader'

const SECTIONS: { title: string; items: string[] }[] = [
  {
    title: 'Uso permitido',
    items: [
      'Consultar, comparar e compartilhar links para as telas do Confere para fins pessoais, jornalísticos, educacionais e de pesquisa, citando a fonte.',
      'Citar trechos curtos de análises, sempre indicando o Confere, a data da consulta e a fonte pública original que sustenta a informação.',
    ],
  },
  {
    title: 'Uso automatizado e raspagem (scraping)',
    items: [
      'É proibida a coleta automatizada de conteúdo por robôs, crawlers, scrapers, extensões ou scripts, em massa ou de forma sistemática, sem autorização prévia por escrito.',
      'É proibido usar o conteúdo, as análises, os históricos de mandato e as contribuições para treinar, ajustar ou alimentar modelos de inteligência artificial, ou para compor bases de dados de terceiros.',
      'É proibido contornar limites de acesso, bloqueios técnicos, o arquivo robots.txt ou a reserva de direitos de mineração de textos e dados (TDM) declarada neste site.',
      'Buscadores e agentes de IA que consultam páginas para responder a uma pessoa ou para exibir resultados de busca com link para a fonte são permitidos, desde que respeitem o robots.txt, citem o Confere e não armazenem o conteúdo para treinar modelos.',
      'Os demais robôs devem seguir as regras publicadas em /robots.txt.',
    ],
  },
  {
    title: 'Direitos sobre o conteúdo',
    items: [
      'A seleção, a organização, as pontuações e as análises do Confere são protegidas. Documentos oficiais e dados públicos citados continuam sendo públicos e podem ser consultados diretamente nas fontes indicadas em cada informação.',
      'Quem envia uma contribuição à curadoria declara ter o direito de compartilhá-la e autoriza sua exibição pública na tela de Curadoria.',
    ],
  },
  {
    title: 'Parcerias e acesso autorizado',
    items: [
      'Pesquisadores, veículos de imprensa e organizações da sociedade civil podem solicitar acesso estruturado aos dados para fins de interesse público. Esse acesso é concedido por autorização, com identificação e limites de uso.',
    ],
  },
  {
    title: 'Consequências',
    items: [
      'O acesso de origens que violem estes termos pode ser bloqueado sem aviso, e o descumprimento pode gerar medidas legais cabíveis, conforme a Lei de Direitos Autorais (Lei 9.610/1998) e a legislação aplicável.',
    ],
  },
]

export function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      <SubPageHeader />
      <main className="mx-auto max-w-3xl px-4 py-10 sm:px-8 sm:py-14">
        <p className="text-micro-caps text-link">Termos de uso</p>
        <h1 className="text-display mt-3">Regras de uso do Confere</h1>
        <p className="mt-4 text-lg text-slate">
          O Confere existe para informar o eleitor com transparência. Estas regras protegem a qualidade e a neutralidade
          do conteúdo e evitam que ele seja copiado em massa ou usado fora de contexto.
        </p>

        <div className="mt-10 space-y-10">
          {SECTIONS.map((s) => (
            <section key={s.title}>
              <h2 className="text-[22px]">{s.title}</h2>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-[15px] leading-relaxed text-slate marker:text-steel">
                {s.items.map((i) => (
                  <li key={i}>{i}</li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        <p className="mt-12 rounded-lg bg-surface p-5 text-sm text-steel">
          Protótipo: estes termos são um modelo de demonstração e precisam de revisão jurídica antes da publicação. Os
          dados exibidos no protótipo são fictícios.
        </p>
      </main>
    </div>
  )
}
