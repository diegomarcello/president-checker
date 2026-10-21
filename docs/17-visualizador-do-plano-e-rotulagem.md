# 17 · Visualizador do plano e rotulagem colaborativa

## Objetivo

Mostrar ao eleitor **onde, no documento original, está escrito cada compromisso** de um político, e permitir que qualquer pessoa **ajude a plataforma a crescer** marcando esses trechos (rotulagem, ou *labeling*). Cada marcação melhora a rastreabilidade do que é afirmado e alimenta os modelos de extração.

## Onde o eleitor chega ao visualizador

- No [painel Em exercício](12-historico-de-mandato.md): o link **Ver no plano · p. N** em cada compromisso (tabela, lista no celular e "Fazendo agora").
- No histórico de mandato (na comparação e na página do candidato): a referência **Plano 2022 · p. 18** de cada compromisso.
- Na [Curadoria](13-curadoria-e-contribuicoes.md): o link **Ver no documento** de cada marcação.

O visualizador é uma **página própria**, que abre já na página certa do documento, com o compromisso selecionado.

## O que a página mostra

- **Cabeçalho:** candidato, cargo exercido e ano da campanha do plano.
- **Lista de compromissos** do plano, cada um com situação (concluído, em andamento, pendente), tema, página e estado da localização: *Localização confirmada* ou *Sem marcação*.
- **O documento**, uma página por vez, com navegação (anterior, próxima), **zoom** e legenda de cores:
  - verde: localização confirmada;
  - roxo: o compromisso selecionado;
  - azul tracejado: marcação da comunidade aguardando curadoria;
  - laranja tracejado: a marcação feita pela própria pessoa.
- **Fonte do andamento** do compromisso selecionado, com a data de atualização.
- **Marcações da comunidade na página**, com o botão **Concordo** para votar.

## Como a comunidade ajuda (rotulagem)

1. A pessoa seleciona um compromisso que ainda está **sem marcação** (ou aciona **Marcar no documento** para qualquer trecho).
2. No **modo de marcação**, ela **arrasta** sobre o texto para desenhar uma área ou **toca/clica em um parágrafo** (o que também serve para navegação por teclado e para telas de toque).
3. Uma janela mostra o **trecho marcado** e pergunta de qual compromisso ele é: um da lista ou **um compromisso que não está na lista**. Neste último caso, a pessoa descreve o compromisso e escolhe o tema.
4. Uma **observação opcional** pode ajudar a curadoria a conferir.
5. A marcação entra na fila da **Curadoria** como *Marcação no documento*, e aparece na hora para quem a criou ("Sua marcação").

## Votação e decisão

- Qualquer pessoa pode votar **Concordo** em marcações aguardando curadoria, no próprio visualizador ou na Curadoria. Os votos definem apenas a **ordem de análise**.
- A curadoria **aprova ou rejeita** com os mesmos critérios para todos, registrando o motivo ([Curadoria e contribuições](13-curadoria-e-contribuicoes.md)).
- **Marcação aprovada** passa a ser a **localização oficial** do compromisso: a área fica verde para todos e o estado vira *Localização confirmada*.
- **Compromisso novo aprovado** entra na lista de compromissos do político e passa a ser acompanhado no histórico.

## Como isso ajuda a plataforma

| Marcação da comunidade | O que a plataforma ganha |
|---|---|
| Área confirmada de um compromisso | Evidência visual para o eleitor e cobertura de localização |
| Compromisso novo | Lista de compromissos mais completa |
| Áreas desenhadas e confirmadas | Exemplos anotados para treinar e avaliar a [extração de propostas](02-extracao-e-estruturacao.md) |
| Rejeições com motivo | Casos difíceis para melhorar regras e modelos |

## Regras de negócio

- **Sem marcação oficial sem curadoria.** O que a comunidade marca é sempre exibido como sugestão até ser aprovado.
- **Localização ≠ cumprimento.** Marcar onde algo está escrito não altera a situação do compromisso (concluído, em andamento ou pendente); isso depende de fonte pública ([Histórico de mandato](12-historico-de-mandato.md)).
- **Mesmos critérios para todos** os candidatos, partidos e cargos.
- **Texto do documento intacto.** A plataforma só sobrepõe áreas e nunca altera o conteúdo exibido.
- **Marcações são públicas** na Curadoria; o formulário pede ciência. Não é pedido nome nem identificação ([Privacidade e LGPD](09-privacidade-e-lgpd.md)).
- **Uma marcação aprovada pode ser contestada** pelo mesmo canal, com novas evidências.

## Formatos de documento

- **Produto real:** PDF (exibido como imagens de página renderizadas, com camada de texto) ou **imagem** enviada pela curadoria, como fotos ou digitalizações do plano. As áreas são guardadas em coordenadas relativas à página (0 a 1), então valem em qualquer zoom e tamanho de tela.
- **Protótipo:** não há PDFs reais. Cada página é **gerada** a partir dos compromissos do político, com texto de preenchimento e a frase do compromisso em posições fixas. O visualizador, as áreas e o fluxo de marcação são os mesmos do produto real.

## No protótipo

As marcações, os votos e as decisões ficam só na sessão do navegador, e as marcações de exemplo são fictícias. Há uma marcação aprovada (que torna oficial a localização de um compromisso) e duas aguardando curadoria.

## Questões em aberto

- **Qualidade das marcações:** comparar a área desenhada com o trecho extraído automaticamente para sugerir à curadoria quais conferir primeiro.
- **Várias marcações para o mesmo compromisso:** como escolher a melhor (maior concordância, menor área) e como unir áreas de um mesmo trecho que atravessa páginas.
- **Documentos escaneados:** necessidade de reconhecimento de texto (OCR) para sugerir marcações e para a camada de texto.
- **Reconhecimento e incentivo** a quem contribui, sem identificar pessoas nem criar ranking de usuários.
- **Direitos sobre o documento** exibido e exigência de manter a fonte oficial citada ao lado.
