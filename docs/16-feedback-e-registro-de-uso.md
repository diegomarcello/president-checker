# 16 · Feedback e registro de uso

## Objetivo

Entender **o que o eleitor está vendo, o que faz sentido para ele e o que não faz**, para melhorar as análises, os gráficos e a forma de apresentar as informações, sem criar um retrato das preferências políticas de ninguém.

## Duas coisas diferentes

| | Feedback por seção | Registro de navegação |
|---|---|---|
| **O que é** | O eleitor diz **Faz sentido** ou **Não faz sentido** sobre a seção que está vendo, com uma **descrição opcional**. | Um log dos passos: etapas, abas, temas abertos e candidatos comparados. |
| **Como começa** | Por um gesto voluntário: clicar em um dos botões. | Só depois que o eleitor **liga** a opção "Registrar o que eu vejo para melhorar". |
| **Padrão** | Sempre disponível. | **Desligado.** |
| **Carrega o candidato?** | Só se o registro de navegação estiver ligado. | Sim, é o propósito dele, por isso exige consentimento. |

## Feedback por seção

- Aparece nas seções que a pessoa está vendo: prioridades sugeridas (perfil), catálogo e filtros, mapa de risco (visão geral e **cada tema**), cada gráfico (adequação, concretude, distribuição), histórico de mandato, propostas do plano na página do candidato e fila da Curadoria.
- Dois botões: **Faz sentido** e **Não faz sentido**. O voto é registrado na hora.
- Em seguida abre um campo de **descrição opcional** (até 500 caracteres) com o aviso para não escrever dados pessoais. A pessoa pode enviar a descrição, escolher "Agora não" ou ignorar.
- Dá para mudar o voto ou editar a descrição depois. Cada seção guarda só o último feedback da pessoa.

## Registro de navegação

Quando ligado, registra eventos como:

| Evento | Exemplo |
|---|---|
| Etapa vista | "Viu a etapa Candidatos" |
| Página aberta | "Abriu a Curadoria", "Abriu a página de um candidato: [nome]" |
| Aba aberta | "Abriu a aba Gráficos" |
| Tema aberto | "Abriu o tema Tributação" |
| Comparação | "Comparou: [candidato A], [candidato B]" |
| Feedback | "Não faz sentido · Mapa de risco · Tributação" + descrição |

Nunca registra: o perfil informado (estado, idade, renda, vínculo, ramo), as prioridades por tema, votos da Curadoria, textos ou arquivos de contribuições, nome ou qualquer identificação.

## Por que o registro de navegação exige consentimento

Quais candidatos uma pessoa abre e compara pode revelar **preferência política**, que a LGPD trata como **dado pessoal sensível** (art. 5º, II). Por isso:

1. **Consentimento separado, específico e desligado por padrão**, independente do Google Analytics. O aviso de privacidade traz as duas opções com interruptores desligados.
2. **Anonimato:** cada visita tem um identificador aleatório de sessão, sem ligação com nome, conta, IP ou perfil.
3. **Transparência:** a tela **Meu registro de uso** mostra tudo o que foi guardado, em linguagem simples.
4. **Controle:** o eleitor pode **baixar** o registro (JSON), **apagar tudo** e **desligar** a qualquer momento. Ao desligar, o histórico de navegação é apagado; os feedbacks voluntários continuam.
5. **Sinais do navegador:** com *Global Privacy Control* ou *Do Not Track*, o registro de navegação fica desligado e a opção, indisponível.
6. **Separação:** o registro **nunca** vai para o Google Analytics, e o Analytics nunca recebe candidato, perfil ou prioridade ([Medição de uso](15-medicao-de-uso.md)).

## Feedback sem registro ligado

Se o eleitor deixar o registro desligado mas der um feedback, ele é guardado **sem o candidato e sem o tema** da tela, só com a seção (por exemplo, "Mapa de risco · visão geral") e a descrição. Assim o feedback ajuda a melhorar a seção sem indicar o interesse da pessoa.

## No protótipo

Tudo fica **apenas no navegador** do eleitor (`localStorage`), limitado a 500 itens, e nada é enviado a servidor. A tela `#/registro` permite ver, baixar e apagar.

## No produto real

- O registro e o feedback seriam enviados a um **sistema próprio** (não a ferramentas de terceiros), identificados só pelo identificador aleatório da visita.
- **Retenção curta** (por exemplo, 90 dias para eventos de navegação) e exclusão automática.
- **Acesso restrito** ao time de produto e privacidade; registro de quem acessa.
- **Relatórios somente agregados**, com tamanho mínimo de grupo para impedir reidentificação (por exemplo, "70% acharam que o gráfico de concretude não faz sentido", nunca "esta pessoa viu estes candidatos").
- **Moderação das descrições:** conteúdo com dados pessoais é removido, e as descrições são tratadas como texto livre sensível.
- **Pedido de exclusão:** o eleitor pode apagar o que já foi enviado informando o código da visita mostrado em "Meu registro de uso".
- Revisão jurídica e avaliação de impacto à proteção de dados antes da publicação.

## Como a equipe usa o feedback

- Ordena as seções por proporção de "não faz sentido" para priorizar revisões.
- Lê as descrições para achar erros de interpretação, termos confusos e casos que as regras não cobrem.
- Alimenta o conjunto de avaliação dos [modelos de machine learning](06-modelos-de-machine-learning.md) e as correções da [Curadoria](13-curadoria-e-contribuicoes.md).
- **Não** muda análises automaticamente com base em votos: o feedback é um sinal para revisão humana, e a [neutralidade](10-neutralidade-e-transparencia.md) é preservada mesmo que uma análise seja impopular.

## Questões em aberto

- Prazo de retenção e base legal definitivos (consentimento específico para dado sensível).
- Como evitar feedback em massa ou automatizado sem identificar o eleitor.
- Se haverá um painel interno com os resultados agregados e quem tem acesso.
- Como tratar descrições que citam candidatos de forma ofensiva ou com dados pessoais.
