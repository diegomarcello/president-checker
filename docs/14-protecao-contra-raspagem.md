# 14 · Proteção contra raspagem

## Objetivo

Reduzir a coleta em massa do conteúdo do Confere por outros sites, robôs e empresas de IA, protegendo a qualidade das análises, a neutralidade e o trabalho de curadoria.

## Princípio: camadas, não uma barreira única

Um site público não consegue impedir 100% da raspagem: quem quer copiar o que aparece na tela sempre consegue. O objetivo é tornar a coleta **declaradamente proibida, tecnicamente difícil, rastreável e cara**, sem prejudicar a acessibilidade nem o eleitor comum. As camadas abaixo se somam.

## Camadas já implementadas no protótipo

| Camada | O que faz | Onde está |
|---|---|---|
| **robots.txt** | Libera buscadores comuns e **agentes de IA que consultam páginas** (ChatGPT-User, Perplexity-User, Claude-User, OAI-SearchBot, Claude-SearchBot, PerplexityBot, Meta-ExternalFetcher), para que o Confere possa ser citado em respostas. Bloqueia bots de **treinamento** de IA, coletores de datasets e ferramentas de raspagem em massa. Os demais robôs ficam com acesso lento (`Crawl-delay`). Declara também *Content Signals*: busca sim, respostas com citação sim, treino de IA não. | `web/public/robots.txt` |
| **Meta tags** | `robots` com `noai` e `noimageai`, `tdm-reservation` e política de referência de origem, lidas por bots que respeitam esses sinais. | `web/index.html` |
| **Reserva de direitos TDM** | Declara a reserva de direitos de mineração de textos e dados (protocolo TDMRep). | `web/public/.well-known/tdmrep.json` |
| **Cabeçalhos de resposta** | `X-Robots-Tag: noai, noimageai`; `Content-Security-Policy` restritiva; `X-Frame-Options: DENY` e `frame-ancestors 'none'` (impede embutir o site em outro); `X-Content-Type-Options`; `Referrer-Policy`; `Permissions-Policy`; isolamento de origem (`Cross-Origin-*`). | `web/vercel.json` e `web/public/_headers` |
| **Termos de uso** | Proíbe coleta automatizada, uso para treinar IA e contorno de bloqueios, e prevê parcerias com acesso autorizado. Dá base jurídica para notificar e agir. | Tela `#/termos` |
| **Sem mapas de código** | O build não publica *source maps*, o que dificulta entender e replicar a aplicação. | `web/vite.config.ts` |
| **Links externos seguros** | Links de contribuições abrem com `noopener noreferrer nofollow`, para não repassar a origem nem valor de ranqueamento. | Tela de Curadoria |

A política de segurança libera apenas os domínios do Google Analytics necessários à [medição de uso](15-medicao-de-uso.md).

`vercel.json` (Vercel) e `_headers` (Netlify e Cloudflare Pages) trazem os mesmos cabeçalhos, e o `vite preview` aplica os de `vercel.json` para testar localmente. Ao alterar um, atualize o outro.

## Limites do que existe hoje

- **São pedidos, não bloqueios.** `robots.txt`, meta tags e TDMRep só valem para bots que respeitam o protocolo. Raspadores mal-intencionados ignoram.
- **Os dados estão embutidos no código do site.** No protótipo não há servidor: quem abrir o site já recebe tudo, e um raspador com navegador real consegue ler a tela. Por isso a proteção de verdade depende da camada de servidor abaixo.
- **Não há limitação de requisições nem detecção de bots**, porque o protótipo é estático.

## Camadas necessárias no produto real

| Camada | Descrição |
|---|---|
| **Dados só por API** | O front não carrega a base inteira: pede ao servidor apenas o que a tela mostra, em páginas pequenas, sem rota que devolva "todos os candidatos" ou "todos os compromissos" de uma vez. |
| **Limite de requisições** | Rate limiting por IP, por impressão digital do cliente e por sessão, com respostas `429` e bloqueio progressivo. |
| **Gestão de bots** | WAF ou serviço de bot management na borda, com desafio apenas para tráfego suspeito (sem atrapalhar leitores de tela nem eleitores reais) e bloqueio de redes de datacenter e proxies conhecidos. |
| **Análise de comportamento** | Detecção de padrões não humanos: leitura sequencial de todos os perfis, velocidade impossível, navegadores automatizados sem interação. |
| **Dados-armadilha (canary)** | Registros fictícios discretos e únicos por versão, que denunciam cópias quando aparecem em outro site ou em respostas de IA, e permitem rastrear a origem. |
| **Marca d'água** | Variações imperceptíveis no texto exibido (por sessão) para identificar a origem de uma cópia. Uso moderado, para não afetar acessibilidade nem leitura por tecnologias assistivas. |
| **Tokens de curta duração** | Chamadas à API com tokens que expiram rápido e não servem fora do contexto da página. |
| **Acesso autorizado** | Canal de API com chave para pesquisadores, imprensa e sociedade civil, com identificação e limites. Reduz a motivação de raspar e mantém o interesse público atendido. |
| **Monitoramento e resposta** | Alertas de pico de tráfego anômalo, listas de bloqueio atualizadas, notificação extrajudicial aos infratores e registro de evidências. |
| **Arquivo `security.txt`** | Contato oficial para denúncias de abuso. Depende de definir o canal de contato real. |

## O que não fazemos de propósito

- **Não** desabilitar seleção de texto, clique direito ou impressão, nem embaralhar o texto: isso prejudica a acessibilidade e quem usa leitores de tela, e não impede raspagem.
- **Não** exigir cadastro para ler: o Confere é de interesse público e o eleitor não precisa se identificar ([Privacidade e LGPD](09-privacidade-e-lgpd.md)).
- **Não** bloquear buscadores comuns nem agentes de IA que buscam páginas a pedido do usuário: queremos que o eleitor encontre o site, inclusive por assistentes, com citação da fonte. O que se barra é o treinamento de modelos e a cópia em massa.

## Equilíbrio com o interesse público

Os dados de base são públicos (planos de governo, diários oficiais, portais de transparência) e continuam acessíveis nas fontes originais, citadas em cada informação. O que se protege é o trabalho de **seleção, organização, análise e curadoria**, e a integridade do conteúdo (ver [Neutralidade e transparência](10-neutralidade-e-transparencia.md)). Isso evita, por exemplo, cópias editadas que atribuam ao Confere conclusões que ele não fez.

## Questões em aberto

- Como acompanhar a lista de agentes de IA, que muda com frequência, e se algum deles passa a exigir tratamento próprio.
- Quais buscadores devem poder indexar e quais telas devem ser indexáveis (hoje, só a página inicial é útil para indexação, porque as demais usam rotas internas).
- Política de acesso estruturado para pesquisadores e imprensa: critérios, limites e licença de uso.
- Revisão jurídica dos termos de uso e do texto de reserva de direitos.
- Fornecedor e custo de gestão de bots e WAF.
