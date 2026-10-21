# 02 · Extração e estruturação

## Objetivo

Transformar cada PDF em um conjunto de **propostas organizadas numa taxonomia comum de temas**, para que planos escritos de formas diferentes possam ser comparados item a item.

## O que faz

1. **Extrai o conteúdo** do PDF: texto, títulos, listas e tabelas. PDFs digitalizados passam por reconhecimento de texto (OCR).
2. **Limpa o texto**: remove cabeçalhos e rodapés repetidos, numeração de página e quebras de linha artificiais.
3. **Reconstrói a estrutura** do documento (capítulos, seções e subseções), preservando a página de origem de cada trecho.
4. **Divide em trechos** de tamanho adequado para análise, sem cortar uma proposta ao meio.
5. **Identifica propostas**: separa o que é compromisso concreto ("criar X até 2028") do que é diagnóstico ou discurso ("o país enfrenta desafios").
6. **Classifica por tema** usando a taxonomia comum. Uma proposta pode pertencer a mais de um tema.
7. **Extrai atributos** de cada proposta, quando existirem: meta numérica, prazo, público afetado, região, fonte de recursos, órgão responsável.

## Taxonomia de temas (versão inicial)

Economia e emprego · Tributação · Previdência · Segurança pública · Saúde · Educação · Meio ambiente e clima · Infraestrutura e mobilidade · Habitação · Assistência social · Agronegócio e desenvolvimento rural · Ciência, tecnologia e inovação · Cultura · Política externa · Governança e combate à corrupção · Direitos e cidadania.

A taxonomia é mantida em `data/` e pode evoluir; cada tema tem descrição e exemplos para orientar a classificação.

## Entradas

- Documento pronto vindo da [Ingestão](01-ingestao-de-documentos.md).
- Taxonomia de temas vigente.

## Saídas

Para cada plano, uma lista de propostas com:

| Campo | Exemplo |
|---|---|
| Texto original | "Ampliar o programa de crédito a microempreendedores em 30% até 2027." |
| Página | 14 |
| Seção | Desenvolvimento econômico |
| Tema(s) | Economia e emprego |
| Público afetado | Microempreendedores |
| Meta / prazo | +30% / 2027 |
| Fonte de recursos | Não informada |

## Localização no documento

Além do texto e da página, cada proposta pode guardar a **área da página** onde está escrita (em coordenadas relativas). Ela vem da extração automática e das marcações aprovadas pela comunidade ([Visualizador do plano e rotulagem](17-visualizador-do-plano-e-rotulagem.md)), que também servem de exemplos anotados para avaliar a extração.

## Regras de negócio

- O texto original nunca é reescrito: resumos e classificações são **adicionados**, não substituem o trecho.
- Toda proposta guarda a página de origem; sem página, não pode ser citada como evidência.
- Classificações com baixa confiança são marcadas para revisão humana.

## Questões em aberto

- Nível de revisão humana obrigatório antes de publicar um plano processado.
- Tratamento de anexos, gráficos e infográficos.
