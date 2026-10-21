# 08 · Experiência do usuário

## Objetivo

Permitir que qualquer eleitor, sem conhecimento técnico ou político aprofundado, chegue à comparação personalizada em poucos minutos e entenda o resultado.

## Jornada principal

A apresentação do produto e a comparação ficam em páginas separadas. A página inicial explica o produto; a comparação acontece em uma **página própria, em formato de assistente (wizard) de 3 passos**, com indicador de progresso e botões Voltar e Continuar sempre visíveis.

**Página inicial**

1. **Boas-vindas e painel.** Explica em uma frase o que o sistema faz, o que ele **não** faz (não recomenda voto) e quais dados serão pedidos. O botão principal leva ao assistente. Uma faixa resume quem exerce mandato hoje e leva ao **painel de análise Em exercício**, uma página própria em formato de dashboard com filtros, gráficos e tabela ([Histórico de mandato](12-historico-de-mandato.md)); lá, cada político tem um botão para abrir a **página do candidato** ou iniciar a comparação com ele já escolhido.

**Assistente de comparação**

2. **Passo 1 · Seu perfil (opcional).** Mapa dos estados e formulário curto com os campos de contexto em faixas ([Perfil do eleitor](04-perfil-do-eleitor.md)). Na mesma tela, o sistema sugere os temas mais relevantes para o perfil e o eleitor ajusta o peso de cada um. É possível pular o passo e ver a comparação geral.
3. **Passo 2 · Candidatos (de 2 a 3).** Como em um comparador de produtos, o eleitor navega pelo catálogo de candidatos já processados e filtra por nome, cargo (Presidente, Governador, Senador, deputados, Prefeito, Vereador) e, exceto para Presidente, por estado, cidade e bairro, tudo opcional, e adiciona de 2 a 3 candidatos à bandeja de comparação. Também pode enviar um PDF próprio, que entra na bandeja como plano não verificado ([Catálogo e seleção](11-catalogo-e-selecao-de-candidatos.md)).
4. **Passo 3 · Comparação.** Mapa de risco lado a lado, com gráficos comparativos ([Mapa de risco e comparação](07-mapa-de-risco-e-comparacao.md)). O eleitor abre um tema, lê os pontos fortes e fracos e consulta os trechos originais dos planos. Pode voltar a qualquer passo para ajustar perfil, prioridades ou candidatos, e o resultado é recalculado.
5. **Pergunta livre (evolução).** O eleitor faz uma pergunta em linguagem natural ("o que cada um propõe para quem trabalha com aplicativo?") e recebe resposta com citações.

**Por que o perfil vem antes dos candidatos:** o eleitor já chega ao catálogo com o contexto definido, então a comparação nasce personalizada sem passos extras depois. O passo é opcional para não criar barreira de entrada.

## Componentes da interface

| Tela / elemento | Função |
|---|---|
| Resumo Em exercício | Faixa na página inicial com os totais e o botão para o painel de análise |
| Painel de análise Em exercício | Dashboard em página própria: filtros, indicadores, gráficos, cartões por político e tabela de compromissos |
| Página do candidato | Dados de um candidato: cabeçalho, histórico de mandato e propostas do plano atual por tema |
| Feedback por seção | Botões "Faz sentido" e "Não faz sentido", com descrição opcional, nas seções que a pessoa está vendo |
| Meu registro de uso | Tela onde o eleitor vê, baixa e apaga o que foi registrado e liga ou desliga o registro de navegação |
| Visualizador do plano | Página própria que exibe o documento, destaca onde cada compromisso está escrito e permite marcar trechos |
| Botão de contribuição | Na página do candidato, abre o formulário para enviar um site ou arquivo à curadoria |
| Tela de Curadoria | Fila pública de contribuições, votação de prioridade e decisões da curadoria |
| Indicador de etapas | Mostra o passo atual do assistente e permite voltar aos passos já feitos |
| Catálogo de candidatos | Cards com busca e filtros para escolher quem comparar |
| Bandeja de comparação | Barra fixa no rodapé com os candidatos escolhidos (máx. 3) e o botão para avançar |
| Envio de plano | Recebe o PDF do eleitor e mostra o progresso do processamento |
| Formulário de perfil | Coleta o contexto em faixas, com explicação de uso em cada campo |
| Editor de prioridades | Ajusta temas e pesos |
| Mapa de risco | Visão resumida por tema × candidato |
| Gráficos comparativos | Radar de adequação ao perfil, concretude das propostas e distribuição do risco |
| Painel do tema | Pontos fortes, fracos, lacunas e citações |
| Visualizador do plano | Abre o PDF na página citada |
| Explicação do método | Mostra como relevância, concretude e risco são calculados |

## Papel do BFF

A camada intermediária entre a interface e os serviços (`bff/`) monta as respostas no formato que cada tela precisa, controla a sessão anônima do eleitor e garante que os dados do perfil não sejam enviados para onde não precisam.

## Requisitos de experiência

- Linguagem simples, sem jargão político ou técnico.
- Funciona bem no celular.
- Acessível (leitores de tela, contraste, navegação por teclado).
- Tempo de resposta curto para a visão geral; a camada personalizada pode carregar progressivamente, tema a tema.
- Avisos claros de que a análise é automatizada e pode conter erros, com caminho para reportar problemas. Um aviso pequeno e permanente, fixo no canto inferior esquerdo de todas as telas, informa que as informações são coletadas e organizadas por IA; no assistente, ele fica acima da barra de navegação e, quando o aviso de cookies está aberto, abaixo dele.
