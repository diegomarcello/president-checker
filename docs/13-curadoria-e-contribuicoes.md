# 13 · Curadoria e contribuições

## Objetivo

Permitir que qualquer pessoa **sugira informações adicionais ou correções** sobre um candidato, e que todos **acompanhem e priorizem** o que a curadoria vai analisar, de forma pública e transparente. A curadoria continua sendo quem decide o que entra; a comunidade ajuda a apontar o que merece atenção primeiro.

## Como funciona

1. **Envio.** Na página do candidato, o botão **Enviar informação ou correção** abre um formulário. O eleitor envia um **site** (link) ou um **arquivo** e explica o que a fonte mostra.
2. **Fila.** A contribuição entra na tela de **Curadoria** com o status *Recebida*. Ela só altera o perfil do candidato depois de aprovada.
3. **Votação.** Qualquer pessoa pode votar para **priorizar** contribuições da fila. Os votos definem apenas a **ordem de análise**, nunca o conteúdo nem o resultado.
4. **Análise e decisão.** A curadoria passa a contribuição para *Em análise* e decide: *Aprovada e incluída* ou *Rejeitada*, sempre com uma nota explicando o motivo.
5. **Inclusão.** Quando aprovada, a informação é incorporada ao perfil (por exemplo, atualiza o status ou o progresso de um compromisso no [histórico de mandato](12-historico-de-mandato.md)) e a decisão fica registrada na tela de Curadoria.

## Marcações no documento

Além de sites e arquivos, a fila recebe **marcações no documento**: áreas desenhadas por qualquer pessoa no visualizador para indicar onde um compromisso está escrito, ou para propor um compromisso novo ([Visualizador do plano e rotulagem](17-visualizador-do-plano-e-rotulagem.md)). Elas seguem o mesmo processo de votação de prioridade e decisão, e o cartão tem o link **Ver no documento**. A marcação aprovada vira a localização oficial do compromisso.

## O que o eleitor envia

| Campo | Descrição |
|---|---|
| Tipo | **Informação adicional** (algo que falta) ou **Correção de informação** (algo que está errado) |
| Fonte | **Site** (link http ou https) ou **Arquivo** (PDF, imagem, DOCX, XLSX ou CSV, até 25 MB) |
| Título | Frase curta que resume a contribuição |
| O que a fonte mostra | Explicação de 20 a 500 caracteres |
| Compromisso (opcional) | Qual compromisso do histórico de mandato a contribuição esclarece ou corrige |
| Ciência | Confirmação de que a contribuição ficará visível publicamente e de que não deve conter dados pessoais de terceiros |

Antes de enviar, a tela avisa que **a aprovação e a inclusão aparecerão na tela de Curadoria**. Depois do envio, há um atalho para acompanhar a contribuição já filtrada pelo candidato.

## A tela de Curadoria

Tela pública, acessível sem login.

- **Resumo:** quantas contribuições estão recebidas, em análise, aprovadas e rejeitadas.
- **Fila de curadoria:** contribuições aguardando decisão, ordenadas por votos, com a **posição na fila**. O botão **Priorizar** registra ou remove o voto da pessoa.
- **Decididas:** contribuições aprovadas ou rejeitadas, com data da decisão e **nota da curadoria**.
- **Filtros e ordenação:** por candidato, por tipo (informação ou correção) e por mais votadas ou mais recentes.
- **Cada cartão mostra:** título, tipo, status, candidato (com link para a página dele), descrição, compromisso relacionado, fonte (domínio do site ou nome e tamanho do arquivo) e datas.

Também há um contador na página do candidato ("2 contribuições na fila · 1 já incluída") com link para a Curadoria filtrada.

## Status

| Status | Significado | Votação |
|---|---|---|
| Recebida | Entrou na fila, ainda não foi aberta pela curadoria | Aberta |
| Em análise | A curadoria está verificando a fonte | Aberta |
| Aprovada e incluída | Verificada e incorporada ao perfil | Encerrada |
| Rejeitada | Não atende aos critérios, com motivo registrado | Encerrada |

## Regras de negócio

- **Curadoria decide; votos priorizam.** O número de votos altera só a ordem da fila. Uma contribuição muito votada pode ser rejeitada, e uma sem votos pode ser aprovada.
- **Mesmos critérios para todos.** A análise segue os critérios públicos de [neutralidade e transparência](10-neutralidade-e-transparencia.md), sem tratamento diferente por candidato ou partido.
- **Só fontes verificáveis.** Entram documentos e fontes públicas comprováveis. Opinião, boato e conteúdo sem dado verificável são rejeitados, com o motivo explicado.
- **Correção exige evidência.** Uma correção só altera um status ou dado se a fonte comprovar.
- **Um voto por pessoa** em cada contribuição, que pode ser retirado. Medidas contra votação automatizada ou em massa são necessárias no produto real.
- **Candidatos e campanhas também participam.** Podem enviar contribuições e contestar status pelo mesmo canal, sujeitos às mesmas regras.
- **Links seguros.** Apenas links http e https são aceitos. Eles abrem em nova aba, sem repassar a origem do acesso.
- **Prazo de resposta.** Cada contribuição mostra a data de envio e a de decisão para que a espera seja visível.

## Privacidade

- O eleitor não precisa se identificar para enviar nem para votar.
- Arquivos e links enviados ficam **públicos** na tela de Curadoria, por isso o formulário pede ciência e proíbe dados pessoais de terceiros. Conteúdo com esse tipo de dado é removido pela curadoria.
- O voto não é associado a uma pessoa identificável. Ver [Privacidade e LGPD](09-privacidade-e-lgpd.md).

## Questões em aberto

- Como evitar votação em massa ou automatizada sem exigir identificação do eleitor.
- Prazo máximo de análise e o que acontece com contribuições sem decisão por muito tempo.
- Quem compõe a curadoria, como seus integrantes são escolhidos e como seus conflitos de interesse são declarados.
- Se contribuições semelhantes devem ser agrupadas para evitar duplicidade na fila.
- Processo de recurso para uma contribuição rejeitada.
