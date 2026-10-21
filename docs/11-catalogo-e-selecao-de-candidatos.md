# 11 · Catálogo e seleção de candidatos

## Objetivo

Permitir que o eleitor monte sua comparação **como em um comparador de produtos**: navega por um catálogo de candidatos com planos já processados, adiciona os que quer comparar e, se quiser, inclui um plano próprio enviado em PDF.

## Duas origens de plano

| | Catálogo | Plano enviado pelo usuário |
|---|---|---|
| **Quem carrega** | Curadoria do projeto ([Ingestão](01-ingestao-de-documentos.md)) | O próprio eleitor, na tela de seleção |
| **Processamento** | Feito previamente, com revisão humana | Feito na hora, sem revisão humana |
| **Disponibilidade** | Imediata | Após alguns instantes de processamento, com barra de progresso |
| **Análise geral (sem perfil)** | Pré-calculada e reaproveitada | Calculada na hora |
| **Selo na interface** | ✔ Verificado | ⚠ Enviado por você, não verificado |
| **Duração** | Permanente, com histórico de versões | Apenas durante a sessão do eleitor |
| **Compartilhável** | Sim | Não (ou apenas com o selo de não verificado) |

As duas origens podem ser misturadas livremente numa mesma comparação: por exemplo, dois candidatos do catálogo e um plano enviado pelo usuário.

## O catálogo

### Card do candidato

Cada candidato aparece como um card com:

- nome de urna e foto oficial;
- partido ou coligação;
- cargo e abrangência (Presidente, Governador de SP, Prefeito de Campinas, Vereadora de São Paulo...);
- local de atuação (bairro, cidade e estado) ou "abrangência nacional" para Presidente;
- eleição (ano e turno);
- situação de mandato: em exercício, mandato encerrado ou sem mandato anterior ([Histórico de mandato](12-historico-de-mandato.md));
- versão e data do plano processado;
- resumo dos temas cobertos pelo plano (ex.: "aborda 14 de 16 temas");
- botão **Adicionar à comparação**.

### Filtros

Todos os filtros são **opcionais** e podem ser combinados. O catálogo mostra quantos candidatos foram encontrados e oferece **Limpar filtros**.

| Filtro | Como funciona |
|---|---|
| **Nome** | Busca pelo nome do candidato, ignorando acentos e maiúsculas. Também encontra pelo partido. |
| **Cargo** | Presidente, Governador, Senador, Deputado federal, Deputado estadual, Prefeito ou Vereador. Sem escolha, mostra todos os cargos. |
| **Estado** | Lista os 27 estados. Aplicável a todos os cargos, **exceto Presidente**. |
| **Cidade** | Lista as cidades que têm candidatos no catálogo, dentro do estado escolhido (ou de todos). |
| **Bairro** | Só é habilitado depois de escolher uma cidade. Lista os bairros com candidatos naquela cidade. |
| **Origem do plano** | Todos, Verificados ou Enviados por mim. |

Regras:

- **Presidente tem abrangência nacional.** Ao escolher o cargo Presidente, os filtros de estado, cidade e bairro desaparecem, com uma explicação na tela.
- **Local exclui quem não tem local.** Com "Todos os cargos", se o eleitor escolher um estado, cidade ou bairro, os candidatos a Presidente deixam de aparecer, porque não pertencem a um local.
- **Hierarquia.** Trocar o estado limpa cidade e bairro; trocar a cidade limpa o bairro.
- **Atalho "Usar meu estado".** Se o eleitor informou o estado no perfil, um botão aplica esse estado ao filtro com um clique, sem aplicá-lo automaticamente.
- **Sem resultados.** A tela oferece limpar os filtros ou enviar o PDF do plano do político.
- Os candidatos já escolhidos continuam na bandeja mesmo quando saem da lista por causa de um filtro.
- A ordem continua alfabética, nunca por popularidade ou resultado.

## Bandeja de comparação

Como em um comparador de produtos, os candidatos escolhidos ficam numa bandeja fixa na tela:

- Mínimo de **2** e máximo de **3** candidatos por comparação, para que as colunas continuem legíveis no celular. Ao atingir 3, os demais cartões ficam bloqueados até que um candidato seja removido.
- Remover ou trocar um candidato sem perder o perfil e as prioridades já informados.
- Botão **Enviar plano em PDF**, que ocupa uma vaga da bandeja.
- Botão **Ver comparação**, liberado quando há ao menos 2 candidatos e todos os planos da bandeja estão prontos.
- A seleção acontece no **passo 2** do assistente de comparação, depois do perfil ([Experiência do usuário](08-experiencia-do-usuario.md)).

## Envio de plano pelo usuário

1. O eleitor envia o PDF e informa nome do político, **cargo** e, exceto para Presidente, o **local de atuação** (estado, cidade e bairro, todos opcionais). Isso permite que o plano apareça nos mesmos filtros do catálogo.
2. O sistema valida o arquivo ([Ingestão](01-ingestao-de-documentos.md)) e verifica se o conteúdo parece de fato um plano de governo. Se não parecer, avisa e não segue.
3. O plano passa pela [Extração e estruturação](02-extracao-e-estruturacao.md) com os mesmos critérios do catálogo.
4. Se o arquivo for idêntico a um plano que já está no catálogo, o sistema usa a versão verificada e avisa o eleitor.
5. O plano entra na bandeja com o selo **não verificado**.

## Recursos de comparador

- **Destacar diferenças:** realça os temas em que os candidatos divergem mais.
- **Ocultar semelhanças:** esconde os temas em que as propostas são equivalentes.
- **Fixar coluna:** mantém um candidato fixo enquanto troca os demais.
- **Cargos diferentes:** o sistema avisa quando a bandeja mistura candidatos a cargos diferentes. A comparação é permitida, mas com alerta de que as competências e as promessas de cada cargo são distintas.
- **Link de comparação:** gera um link com os candidatos do catálogo selecionados, sem dados de perfil.

## Regras de negócio

- Planos do catálogo e planos enviados são analisados **com os mesmos critérios**. Só muda o selo de origem.
- Um plano enviado pelo usuário nunca entra no catálogo automaticamente. O eleitor pode sugeri-lo à curadoria, que fará o processo completo de verificação.
- O selo de origem acompanha o plano em todas as telas, exportações e citações.

## Questões em aberto

- Limite de envios por sessão e tamanho máximo do PDF enviado pelo usuário.
- Se candidatos sem plano registrado aparecem no catálogo, com o aviso "plano não disponível".
- Se a comparação entre cargos diferentes deve ser permitida ou bloqueada.
