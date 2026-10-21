# 01 · Ingestão de documentos

## Objetivo

Receber os planos de governo em PDF, garantir que são documentos válidos e registrá-los com as informações mínimas para serem analisados e comparados.

## O que faz

- Aceita o envio de um ou mais PDFs de planos de governo.
- Associa cada arquivo a um **candidato** e a uma **eleição** (cargo, ano, abrangência: federal, estadual ou municipal).
- Verifica se o arquivo é legível: PDF corrompido, protegido por senha ou vazio é rejeitado com mensagem clara.
- Identifica se o PDF tem texto selecionável ou se é digitalizado (imagem), para que a extração use o método adequado.
- Detecta duplicidade: o mesmo arquivo enviado duas vezes não gera duas análises.
- Controla **versões**: se o candidato publicar um plano atualizado, a nova versão substitui a anterior nas comparações, e o histórico é mantido.
- Registra a origem do documento (por exemplo, link do registro de candidatura no TSE) para dar rastreabilidade.

## Quem usa

A ingestão tem dois caminhos, que alimentam as duas origens de plano descritas em [Catálogo e seleção de candidatos](11-catalogo-e-selecao-de-candidatos.md):

- **Curadoria do projeto → catálogo.** Carrega os planos oficiais, que passam por revisão humana e ficam disponíveis para todos os eleitores, já processados.
- **Eleitor → plano da sessão.** Envia um PDF na tela de seleção para comparar com os candidatos do catálogo. O plano é processado na hora, recebe o selo *não verificado* e só existe durante a sessão.

Há ainda um terceiro caminho, separado da ingestão de planos: as **contribuições** de qualquer pessoa (sites e arquivos) vão para a fila da [Curadoria](13-curadoria-e-contribuicoes.md) e só entram no perfil do candidato depois de aprovadas.

## Entradas

- Arquivo PDF.
- Nome do candidato, partido/coligação, cargo, eleição.
- Fonte do documento (opcional, mas recomendada).

## Saídas

- Documento registrado, com status: *recebido → em processamento → pronto para análise* (ou *rejeitado*, com motivo).
- Encaminhamento automático para [Extração e estruturação](02-extracao-e-estruturacao.md).

## Regras de negócio

- Uma comparação só é liberada quando **todos** os planos envolvidos estão prontos para análise.
- Comparar planos de cargos ou eleições diferentes gera alerta ao eleitor (ver [Catálogo e seleção](11-catalogo-e-selecao-de-candidatos.md)).
- Documentos sem identificação de candidato não seguem para análise.
- No envio pelo eleitor, o sistema verifica se o conteúdo parece um plano de governo antes de processar.
- Se o PDF enviado pelo eleitor for idêntico a um plano do catálogo, o sistema reaproveita a versão verificada.

## Questões em aberto

- Limite de tamanho e de páginas por arquivo, e de envios por sessão.
- Moderação de PDFs enviados por eleitores que forem sugeridos para o catálogo.
- Coleta automática dos planos no portal do TSE em vez de envio manual pela curadoria.
