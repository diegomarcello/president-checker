# 05 · Motor de inteligência (agentes, RAG e CAG)

## Objetivo

Analisar os planos de governo à luz do perfil do eleitor e produzir, para cada tema relevante, os pontos fortes, os pontos fracos e as lacunas de cada candidato, **sempre com evidência no texto original**.

## Como a inteligência é organizada

O trabalho é dividido entre agentes especializados, coordenados por um orquestrador. Cada agente tem uma responsabilidade clara, o que torna o resultado mais confiável e mais fácil de auditar.

| Agente | Responsabilidade |
|---|---|
| **Orquestrador** | Recebe o perfil e a lista de candidatos, decide quais temas analisar e em que ordem, e consolida o resultado. |
| **Agente de perfil** | Traduz o perfil do eleitor em perguntas concretas por tema (ex.: "como cada plano afeta a tributação de autônomos com renda entre R$ 10 e 20 mil?"). |
| **Agentes temáticos** | Um por tema (economia, segurança, saúde...). Leem o que cada plano propõe sobre o tema, avaliam impacto no perfil, concretude e viabilidade, e listam pontos fortes, fracos e lacunas. |
| **Agente comparador** | Coloca os candidatos lado a lado no mesmo tema, com os mesmos critérios, e aponta onde as propostas convergem ou divergem. |
| **Agente verificador** | Confere cada afirmação contra o trecho citado, descarta o que não tem evidência e verifica se a linguagem está neutra e equilibrada entre os candidatos. |

## RAG e CAG: como os agentes consultam os planos

Os agentes usam duas estratégias, de forma combinada:

- **CAG (Cache-Augmented Generation):** o conteúdo estável, como os resumos organizados de cada plano por tema, a taxonomia e os critérios de avaliação, já está pré-carregado. Isso garante que todos os eleitores recebam análises consistentes sobre o mesmo plano e que a resposta seja rápida. É a estratégia principal para a **visão geral** de um tema.
- **RAG (Retrieval-Augmented Generation):** quando o agente precisa de um detalhe específico ligado ao perfil (uma faixa de renda, uma região, um setor), ele busca na [base de conhecimento](03-base-de-conhecimento.md) os trechos mais relevantes e responde com base neles. É a estratégia para **personalização e precisão**.

Em resumo: o CAG dá a base comum e consistente; o RAG traz o detalhe que importa para aquele eleitor.

## Entradas

- Perfil de relevância do [eleitor](04-perfil-do-eleitor.md).
- Planos dos candidatos selecionados, via base de conhecimento.
- Pontuações dos [modelos de ML](06-modelos-de-machine-learning.md) (relevância, concretude, risco).

## Saídas

Para cada tema × candidato:

- Pontos fortes para o perfil, com citação.
- Pontos fracos para o perfil, com citação.
- Lacunas (o que o perfil precisaria e o plano não trata).
- Justificativa resumida, usada pelo [mapa de risco](07-mapa-de-risco-e-comparacao.md).

## Regras de negócio

- **Sem citação, sem afirmação.** Qualquer ponto sem trecho de origem é descartado pelo verificador.
- Todos os candidatos são avaliados com **as mesmas perguntas e os mesmos critérios**.
- O motor não emite recomendação de voto nem ranking geral de candidatos.
- Quando o plano é ambíguo, o sistema diz que é ambíguo em vez de supor uma interpretação.
- Análises gerais (sem perfil) podem ser pré-calculadas e reaproveitadas; apenas a camada personalizada é calculada a cada consulta.
