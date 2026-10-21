# 12 · Histórico de mandato

## Objetivo

Mostrar, para quem já exerce ou exerceu cargo eletivo, **o que prometeu no plano da última campanha, o que já concluiu, o que está em andamento e o que ainda falta**. O mapa de risco compara propostas futuras; o histórico compara a **entrega passada**, e os dois juntos dão ao eleitor uma visão mais completa.

## O que faz

- Identifica a situação de cada candidato: **em exercício**, **mandato encerrado** ou **sem mandato anterior**.
- Para quem teve mandato, liga os compromissos do **plano da última campanha** a fatos verificáveis: leis sancionadas, obras entregues, programas lançados, projetos arquivados.
- Atribui a cada compromisso uma situação, sempre com **fonte pública e data da última atualização**.
- Mostra os compromissos de candidatos diferentes lado a lado, em colunas, com filtro por situação.

## Situações de um compromisso

| Situação | Quando se aplica | Nome para mandato encerrado |
|---|---|---|
| **Concluído** | A entrega prometida foi feita e há fonte que comprove. | Concluído |
| **Em andamento** | Há ação em curso ou entrega parcial, com percentual de progresso quando houver dado. | Parcial |
| **Pendente** | Não há entrega nem ação registrada. | Não entregue |

Notas explicam o contexto quando necessário (por exemplo, "prazo de 24 meses já venceu" ou "projeto arquivado ao fim da legislatura").

## O que o eleitor vê

- **Resumo na página inicial:** uma faixa curta mostra quantos políticos estão em exercício e quantos compromissos estão concluídos, em andamento e pendentes, com o botão **Abrir o painel de análise**.
- **Painel de análise "Em exercício"** (página própria, em formato de dashboard):
  - **Filtros:** situação do mandato (em exercício, mandato encerrado ou todos), **cargo exercido** (governador, senador, prefeito, deputado...) e **tema**.
  - **Indicadores:** políticos, compromissos acompanhados, concluídos, em andamento e pendentes, cada um com a participação no total.
  - **Gráficos:** compromissos por político (barras empilhadas), visão geral da participação de cada situação (rosca) e compromissos por tema.
  - **Cartões por político:** cargo, período, barra de situação e o que está **fazendo agora** com percentual de progresso, com os botões **Ver dados de [nome]** e **Comparar**.
  - **Tabela de todos os compromissos** (em celular, lista de cartões), com busca, filtro por situação e ordenação por ordem alfabética, maior progresso ou atualização mais recente. Cada linha mostra a fonte e a data.
  - Ordem sempre alfabética por padrão e **contagens, não nota**: o painel não ranqueia políticos.
- **Página do candidato:** reúne cabeçalho (partido, cargo, selos, versão do plano), o histórico de mandato completo com filtro por situação e a visão geral das propostas do plano atual por tema, sem considerar o perfil do eleitor. Tem o botão **Comparar este candidato**.
- **Selo no catálogo:** Em exercício, Mandato encerrado ou Sem mandato anterior, já no cartão do candidato ([Catálogo e seleção](11-catalogo-e-selecao-de-candidatos.md)).
- **Aba Histórico na comparação**, com uma coluna por candidato:
  - cargo, período e ano da campanha de referência;
  - barra com a proporção de compromissos concluídos, em andamento e pendentes, e a contagem ("2 de 6 concluídos");
  - lista de compromissos com tema, situação, progresso, página do plano da campanha, fonte e data.
- **Candidato sem mandato anterior:** a coluna explica que não há entrega a avaliar e que isso não é bom nem ruim.

## De onde vêm os dados

| Fonte | Para quê |
|---|---|
| Plano de governo da última campanha (o mesmo fluxo de [Ingestão](01-ingestao-de-documentos.md) e [Extração](02-extracao-e-estruturacao.md)) | Lista de compromissos, com tema e página |
| Diários oficiais, leis e atos publicados | Confirmar entregas concluídas |
| Portais de transparência, painéis de obras e relatórios de gestão | Acompanhar execução e progresso |
| Sistemas de tramitação do Legislativo | Acompanhar projetos de lei de parlamentares |

Os agentes do [Motor de inteligência](05-motor-de-inteligencia.md) propõem a ligação entre compromisso e evidência; a situação só é publicada com fonte citada e passa por revisão humana por amostragem.

## Regras de negócio

- **Sem fonte, sem status.** Um compromisso sem evidência pública aparece como "sem informação", nunca como pendente.
- **Mesmos critérios para todos.** A definição de cada situação e o processo de verificação são iguais para qualquer candidato e partido.
- **Contagens, não nota.** O sistema mostra quantos compromissos estão em cada situação, sem nota final nem ranking de "quem mais cumpriu".
- **Cargos diferentes não são equivalentes.** Parlamentares propõem e votam leis; chefes do Executivo executam. A tela avisa que o tipo e o número de compromissos variam entre cargos.
- **Atualização.** Cada status mostra a data da última verificação. Para quem está em exercício, a verificação é recorrente; para mandato encerrado, o histórico é fixado ao fim do mandato.
- **Plano enviado pelo eleitor:** não tem histórico verificado. A tela informa isso em vez de inferir.
- **Compromissos com a própria linguagem do plano:** o texto do compromisso é extraído do documento, sem reescrita opinativa.

## Onde cada compromisso está escrito

Cada compromisso tem um link para o **documento do plano** da última campanha, aberto na página certa e com o trecho destacado. Quando a localização ainda não foi marcada, qualquer pessoa pode ajudar ([Visualizador do plano e rotulagem](17-visualizador-do-plano-e-rotulagem.md)).

## Correções e informações adicionais

Qualquer pessoa pode enviar uma fonte para corrigir ou complementar um status. A contribuição passa pela fila pública da [Curadoria](13-curadoria-e-contribuicoes.md) e só altera o histórico depois de aprovada.

## Questões em aberto

- Qual é a fonte de referência quando há conflito entre dados oficiais e a versão do político.
- Como tratar compromissos que dependem de outro Poder (por exemplo, o prefeito promete algo que exige aprovação da Câmara).
- Como tratar candidato que mudou de cargo (por exemplo, foi deputado e depois governador) e qual campanha é a de referência.
- Prazo e responsável pela contestação de um status por parte do político ou da equipe dele.
