# 09 · Privacidade e LGPD

## Objetivo

Definir quais dados do eleitor o sistema usa, por que usa e como os protege, em conformidade com a Lei Geral de Proteção de Dados (Lei 13.709/2018).

## Ponto de atenção: o que a LGPD protege

Idade, localização, profissão e renda **são dados pessoais** e estão cobertos pela LGPD. O que eles não são é **dados pessoais sensíveis** (art. 5º, II), categoria com regras mais rígidas que inclui origem racial ou étnica, convicção religiosa, **opinião política**, filiação a sindicato ou a organização de caráter religioso, filosófico ou político, dados de saúde, vida sexual, dados genéticos e biométricos.

Por isso o produto adota duas linhas:

1. **Coletar só dados pessoais não sensíveis**, de forma anônima e em faixas, para que o eleitor não seja identificável.
2. **Evitar inferir opinião política.** Num sistema sobre eleições, as prioridades escolhidas e o histórico de navegação podem sugerir a preferência política de alguém. Esses sinais não são armazenados de forma associada a uma pessoa.

## Diretrizes

| Diretriz | Como se aplica |
|---|---|
| **Finalidade** | Os dados servem apenas para personalizar a comparação naquela consulta. |
| **Necessidade** | Só pedimos campos com uso claro; todos são opcionais. |
| **Anonimização** | Sem login obrigatório, sem nome, CPF, e-mail ou endereço completo. Renda e idade em faixas. Localização no nível de município. |
| **Transparência** | Cada campo explica para que serve. Política de privacidade em linguagem simples. |
| **Retenção mínima** | O perfil vive apenas durante a sessão. Se o eleitor quiser salvar, isso exige ação explícita e consentimento. |
| **Separação** | Dados do eleitor nunca se misturam à base de conhecimento dos planos nem são usados para treinar modelos de forma identificável. |
| **Agregação** | Estatísticas de uso (ex.: temas mais escolhidos) só em forma agregada, com volume mínimo que impeça reidentificação. |

## Arquivos enviados pelo eleitor

- O PDF enviado é usado apenas para a comparação daquela sessão e é **apagado ao fim dela**.
- O arquivo não é visível para outros eleitores nem entra no catálogo sem um pedido explícito do eleitor e a verificação da curadoria.
- Um PDF pode conter dados pessoais de terceiros (por exemplo, nomes e contatos em anexos). Esses dados não são extraídos para a análise, que considera apenas as propostas.
- A escolha de quais candidatos comparar não é armazenada de forma associada à pessoa, pelo mesmo motivo das prioridades: ela pode sugerir preferência política.

## Contribuições para a curadoria

- Enviar ou votar não exige login nem identificação.
- Links e arquivos enviados à curadoria ficam **públicos** na tela de Curadoria. O formulário informa isso, pede ciência e proíbe dados pessoais de terceiros; conteúdo que os contenha é removido.
- Votos de priorização não são associados a uma pessoa identificável e não são usados para inferir preferência política.
- Diferente do plano que o eleitor envia para comparar (privado e apagado ao fim da sessão), uma contribuição é feita para ser pública. Ver [Curadoria e contribuições](13-curadoria-e-contribuicoes.md).

## Medição de uso (Google Analytics)

- A medição só começa **depois que o eleitor aceita** um aviso de cookies, pode ser recusada sem perder funções e é desligada automaticamente quando o navegador envia *Global Privacy Control* ou *Do Not Track*.
- São enviadas apenas visitas a telas, com caminhos genéricos. **Nunca** vão para o Google os candidatos consultados, o perfil ou as prioridades, porque isso pode revelar preferência política.
- Detalhes em [Medição de uso](15-medicao-de-uso.md).

## Registro de uso e feedback

- O **feedback** ("faz sentido" / "não faz sentido", com descrição opcional) é voluntário. Sem consentimento de navegação, ele é guardado **sem o candidato e sem o tema** da tela.
- O **registro de navegação** (etapas, abas, temas e candidatos abertos) fica **desligado por padrão**, exige consentimento separado do Google Analytics e é anônimo, porque pode indicar preferência política, dado sensível.
- O eleitor vê, baixa e apaga tudo em **Meu registro de uso**. Ao desligar, o histórico de navegação é apagado.
- Detalhes em [Feedback e registro de uso](16-feedback-e-registro-de-uso.md).

## O que nunca coletamos

- Intenção de voto ou preferência partidária.
- Qualquer dado pessoal sensível.
- Identificadores diretos (nome, documento, contato).

## Questões em aberto

- Se haverá conta de usuário para salvar comparações e, nesse caso, qual base legal e qual fluxo de consentimento.
- Revisão jurídica sobre regras eleitorais (TSE) aplicáveis a ferramentas de comparação de candidatos durante o período de campanha.
