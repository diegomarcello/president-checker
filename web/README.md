# Confere · Web

Interface do eleitor: página inicial com resumo, painel de análise em exercício (`#/em-exercicio`), página de dados do candidato (`#/candidato/<id>`), tela de Curadoria (`#/curadoria`) e assistente de comparação em 3 passos (perfil → candidatos, máx. 3 → resultado), com mapa de risco e gráficos.
Visual baseado em [`../docs/DESIGN.md`](../docs/DESIGN.md), com identidade brasileira (verde, amarelo e azul, mapa de estados, textos em pt-BR).

## Stack

- Vite + React 19 + TypeScript
- Tailwind CSS v4 (`@tailwindcss/vite`), tokens em `src/index.css`
- shadcn/ui (`src/components/ui`) sobre Radix
- Recharts via `chart` do shadcn (radar, barras agrupadas, barras empilhadas)

## Rodar

```bash
yarn install
yarn dev      # http://localhost:5173
yarn build
yarn lint
```

## Estado atual

Protótipo sem backend. Candidatos, planos e análises em `src/data` são **fictícios** (17 candidatos: presidentes, governadores, senador, deputados, prefeitos e vereadores, em `candidates.ts` e `localCandidates.ts`).
O risco é calculado no navegador (`src/lib/analysis.ts`) com a mesma fórmula para todos os candidatos.
O envio de PDF é simulado (`src/lib/upload.ts`): o arquivo não sai do navegador e a análise é um placeholder
marcado como "não verificado". O perfil do eleitor vive só em memória, nada é salvo.

## Aviso de IA

`src/components/FloatingNotices.tsx` mantém, fixo no canto inferior esquerdo de todas as telas, um aviso de que as
informações são coletadas e organizadas por IA e podem conter erros. Ele divide a pilha com o aviso de cookies e sobe
acima da barra do assistente.

## Visualizador do plano e rotulagem

`#/documento/<candidato>/<compromisso>[/<marcação>]` (`DocumentViewerPage`, `PlanPageView`, `LabelDialog`). As páginas do
plano são geradas em `src/lib/planDocument.ts` (não há PDFs reais) e as marcações vão para a fila da Curadoria. Veja
[`../docs/17-visualizador-do-plano-e-rotulagem.md`](../docs/17-visualizador-do-plano-e-rotulagem.md).

## Feedback e registro de uso

`src/components/SectionFeedback.tsx` ("faz sentido / não faz sentido" + descrição opcional) e `src/lib/usageLog.ts` (log local).
A navegação só é registrada com consentimento separado e desligado por padrão (`ConsentBanner`); o feedback é
sempre voluntário e, sem consentimento, não leva candidato nem tema. Tela `#/registro` para ver, baixar e apagar.
Veja [`../docs/16-feedback-e-registro-de-uso.md`](../docs/16-feedback-e-registro-de-uso.md).

## Google Analytics

`src/lib/analytics.ts` carrega o GA4 só após consentimento (`ConsentBanner`), respeita Global Privacy Control e envia
somente caminhos genéricos, sem candidato, perfil ou prioridades. ID em `VITE_GA_MEASUREMENT_ID` (`.env.example`).
Veja [`../docs/15-medicao-de-uso.md`](../docs/15-medicao-de-uso.md).

## Proteção contra raspagem

`public/robots.txt`, `public/.well-known/tdmrep.json`, meta tags em `index.html`, cabeçalhos em `vercel.json` e
`public/_headers` (mantenha os dois iguais), e a tela de termos `#/termos`. São pedidos e dificuldades, não uma
barreira absoluta: veja [`../docs/14-protecao-contra-raspagem.md`](../docs/14-protecao-contra-raspagem.md) para os
limites e o que o servidor real precisa ter. `yarn preview` aplica os cabeçalhos de `vercel.json` para teste local.
