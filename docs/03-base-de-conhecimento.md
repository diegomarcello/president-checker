# 03 · Base de conhecimento

## Objetivo

Guardar os planos processados de forma que a inteligência do sistema consiga **encontrar rapidamente o que cada candidato diz sobre qualquer assunto**, mesmo quando os candidatos usam palavras diferentes para a mesma ideia.

## O que faz

A base de conhecimento tem três camadas complementares:

### 1. Índice semântico (embeddings)

Cada trecho e cada proposta recebe uma "impressão digital de significado" (embedding). Isso permite buscas por sentido e não só por palavra-chave. Por exemplo, uma busca por "imposto para quem trabalha por conta própria" encontra trechos que falam em "tributação de MEI", "regime simplificado" ou "pejotização".

### 2. Cache dos planos (base do CAG)

Planos de governo são documentos **finitos e estáveis**: não mudam a cada consulta. Por isso, versões resumidas e organizadas de cada plano, a taxonomia de temas e as regras de análise ficam pré-carregadas para os agentes. Assim, perguntas amplas ("o que o candidato A propõe para economia?") são respondidas de forma rápida e consistente, sem depender de uma nova busca a cada vez.

### 3. Dados estruturados

As propostas com seus atributos (tema, meta, prazo, público, fonte de recursos) ficam disponíveis para filtros e contagens: "quantas propostas de segurança têm meta numérica?".

## Quando usar cada camada

| Situação | Camada principal |
|---|---|
| Visão geral de um tema em um plano | Cache (CAG) |
| Pergunta específica ou detalhe pontual | Índice semântico (RAG) |
| Comparação de métricas entre planos | Dados estruturados |

## Entradas

- Propostas e trechos vindos da [Extração e estruturação](02-extracao-e-estruturacao.md).

## Saídas

- Consultas atendidas para o [Motor de inteligência](05-motor-de-inteligencia.md), sempre devolvendo o trecho, a página e o plano de origem.

## Planos do catálogo e planos enviados

- **Catálogo:** planos processados previamente, persistentes e compartilhados por todos os eleitores. É aqui que o cache do CAG e as análises gerais pré-calculadas trazem mais ganho.
- **Planos enviados pelo eleitor:** ficam em um espaço **isolado da sessão**, com as mesmas três camadas, e são apagados ao fim dela. Não são visíveis para outros eleitores nem misturados ao catálogo.

Ver [Catálogo e seleção de candidatos](11-catalogo-e-selecao-de-candidatos.md).

## Regras de negócio

- Ao entrar uma nova versão de um plano, as três camadas são atualizadas juntas; não pode haver mistura de versões.
- Os dados do eleitor **nunca** entram na base de conhecimento. Ela contém apenas os planos.
- Toda resposta da base indica a origem do plano (catálogo verificado ou enviado pelo eleitor).
