# 15 · Medição de uso (Google Analytics)

## Objetivo

Entender quanto o Confere é acessado e por quais telas, para melhorar o produto, **sem comprometer a privacidade do eleitor**. A medição é feita com o Google Analytics 4 e segue regras mais restritas do que a configuração padrão da ferramenta.

## Por que não usamos o código padrão do Google

O trecho padrão carrega o script e já começa a medir. Aqui isso não serve por três motivos:

1. **LGPD.** O Google Analytics grava cookies e trata endereço IP. Isso exige informar e obter consentimento antes de medir.
2. **Preferência política.** O Confere usa rotas internas como `#/candidato/<nome>`. Um registro padrão de visitas mostraria quais candidatos cada pessoa consultou, o que pode revelar preferência política, um dado sensível. Esse tipo de informação nunca deve ser enviado.
3. **Segurança.** O código inline do trecho padrão seria bloqueado pela política de segurança do site ([Proteção contra raspagem](14-protecao-contra-raspagem.md)). O script é carregado pelo próprio aplicativo, e a política libera apenas os domínios do Google necessários.

## Como funciona

- **Consentimento primeiro.** Na primeira visita, um aviso pergunta se pode medir as visitas, com os botões **Aceitar** e **Recusar**. **Até a pessoa aceitar, o script do Google nem é baixado** e nenhum cookie é criado. Recusar não tira nenhuma função do site.
- **Mudar de ideia a qualquer momento.** O rodapé tem o link **Preferências de cookies**. Ao recusar depois de ter aceitado, a medição para e os cookies do Analytics são apagados.
- **Sinais do navegador.** Se o navegador envia *Global Privacy Control* ou *Do Not Track*, a medição fica desligada sem perguntar, e o botão Aceitar fica indisponível.
- **Modo de consentimento.** Tudo começa negado (`analytics_storage`, `ad_storage`, `ad_user_data`, `ad_personalization`). Só a medição de acessos pode ser liberada pela pessoa; publicidade e personalização de anúncios ficam sempre negadas.
- **Sem sinais do Google.** Recursos de publicidade, como Google Signals e personalização de anúncios, ficam desligados.

## O que é enviado

Apenas visitas a telas, com **caminhos genéricos**:

| Tela | Caminho enviado |
|---|---|
| Página inicial | `/` |
| Assistente de comparação | `/comparar/perfil`, `/comparar/candidatos`, `/comparar/resultado` |
| Página de um candidato | `/candidato` (sem identificar qual) |
| Painel em exercício | `/em-exercicio` (sem filtros) |
| Visualizador do plano | `/documento` (sem candidato nem compromisso) |
| Curadoria | `/curadoria` (sem filtro de candidato) |
| Termos de uso | `/termos` |

## O que nunca é enviado

- Quais candidatos foram escolhidos, consultados ou filtrados.
- Qualquer campo do perfil (estado, idade, renda, vínculo, ramo etc.) ou as prioridades por tema.
- Votos, títulos ou conteúdo de contribuições, e nomes de arquivos enviados.
- Dados de identificação (o Confere não pede nome, CPF ou e-mail).

Eventos novos só podem ser criados com uma lista fixa de nomes e sem parâmetros que revelem candidato, perfil ou prioridade. Qualquer evento novo deve passar por revisão de privacidade.

## Registro próprio e feedback

O que a pessoa vê e acha válido é tratado à parte, com consentimento separado, em [Feedback e registro de uso](16-feedback-e-registro-de-uso.md). Esse registro nunca passa pelo Google Analytics.

## Configuração técnica

- ID de métricas do GA4 em `web/src/lib/analytics.ts`, sobrescrevível pela variável `VITE_GA_MEASUREMENT_ID` (`web/.env.example`).
- Política de segurança do site liberada para `googletagmanager.com` (script) e `google-analytics.com` (envio de dados), em `vercel.json` e `_headers`.
- Escolha do eleitor guardada no navegador (`localStorage`); se ele estiver indisponível, vale só para a visita.

## Questões em aberto

- Redação final do aviso de cookies e da política de privacidade, com revisão jurídica.
- Prazo de retenção dos dados no GA4 (o padrão é 2 meses; avaliar o mínimo necessário).
- Se haverá medição própria, sem cookies e hospedada aqui, como alternativa ao Google Analytics.
- Como tratar a transferência internacional de dados que o uso do Google Analytics implica.
