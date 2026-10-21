# 06 · Modelos de machine learning

## Objetivo

Dar ao sistema critérios **mensuráveis e reproduzíveis** para decidir o que é relevante, o que é concreto e o que é arriscado, complementando a análise em linguagem natural dos agentes.

## Modelos previstos

### Classificador de temas

Decide a qual tema (ou temas) da taxonomia cada proposta pertence. Alimenta a [Extração e estruturação](02-extracao-e-estruturacao.md) e indica o grau de confiança de cada classificação.

### Modelo de relevância perfil → tema

Estima o quanto cada tema e cada tipo de proposta afeta um determinado perfil. Exemplos do que ele aprende:

- Mudanças em faixas de imposto pesam mais para quem espera aumento de renda.
- Propostas de previdência pesam mais com o aumento da faixa etária.
- Propostas regionais pesam mais para quem mora na região citada.

A relevância sugerida é combinada com as prioridades que o próprio eleitor escolheu. **A escolha do eleitor sempre prevalece.**

### Pontuação de concretude

Mede o quanto uma proposta é específica, observando se ela tem:

- meta mensurável;
- prazo;
- público-alvo definido;
- fonte de recursos ou forma de financiamento;
- responsável pela execução.

Uma proposta vaga ("melhorar a segurança") pontua baixo; uma proposta específica ("contratar 10 mil policiais até 2028 com recursos do fundo X") pontua alto.

### Pontuação de risco

Combina os sinais anteriores em um nível de risco por tema × candidato × perfil:

| Sinal | Aumenta o risco quando... |
|---|---|
| Impacto no perfil | A proposta tende a prejudicar a situação do eleitor |
| Concretude | A proposta é vaga ou sem meta |
| Viabilidade | Não há fonte de recursos ou depende de mudanças difíceis de aprovar |
| Cobertura | O tema é relevante para o perfil e o plano não o aborda (lacuna) |

O resultado é uma escala simples (baixo, médio, alto) acompanhada da explicação de quais sinais pesaram.

## Ciclo de melhoria

- **Conjunto de avaliação:** propostas reais anotadas por pessoas (tema, concretude, público afetado) servem de referência para medir a qualidade dos modelos.
- **Revisão humana:** classificações com baixa confiança vão para revisão, e as correções retroalimentam os modelos.
- **Feedback do eleitor:** o usuário pode sinalizar "esta análise não faz sentido para mim", e esses sinais (anônimos) ajudam a calibrar a relevância.
- **Teste de equilíbrio:** a cada nova versão, os modelos são avaliados para confirmar que não favorecem sistematicamente nenhum candidato ou espectro político (ver [Neutralidade e transparência](10-neutralidade-e-transparencia.md)).

## Regras de negócio

- Toda pontuação precisa ser explicável em linguagem simples para o eleitor.
- Os critérios de concretude e risco são públicos e iguais para todos os planos.
