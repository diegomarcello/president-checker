# 07 · Mapa de risco e comparação

## Objetivo

Entregar ao eleitor, em uma única tela, **a comparação lado a lado dos candidatos por tema**, destacando pontos fortes, pontos fracos, lacunas e o nível de risco de cada plano para o seu perfil.

## O que mostra

### Visão de mapa (resumo)

Uma grade com os temas nas linhas, os candidatos nas colunas e uma cor por célula indicando o risco para o perfil:

| Tema (relevância) | Candidato A | Candidato B | Candidato C |
|---|---|---|---|
| Economia (alta) | 🟡 Médio | 🔴 Alto | 🟢 Baixo |
| Segurança (média) | 🔴 Alto | 🟢 Baixo | 🟡 Médio |
| Educação (média) | 🟢 Baixo | ⚪ Neutro | 🟡 Médio |
| Saúde (baixa) | 🟡 Médio | 🟡 Médio | 🟢 Baixo |

- Cada coluna mostra o selo de origem do plano: ✔ verificado (catálogo) ou ⚠ enviado pelo eleitor.
- Os temas aparecem **ordenados pela relevância** para o perfil.
- **Neutro** indica que o plano trata o tema, mas sem impacto direto no perfil.
- **Lacuna** é sinalizada à parte, quando o tema é relevante e o plano não o aborda.

### Visão detalhada (por tema)

Ao abrir um tema, o eleitor vê para cada candidato:

- ✅ **Pontos fortes** para o seu perfil.
- ❌ **Pontos fracos** para o seu perfil.
- ⚠️ **Alertas** (proposta vaga, sem fonte de recursos, dependente de aprovação difícil).
- ➖ **Lacunas** (o que o plano não diz).
- 📄 **Citação** com o trecho original e a página, com acesso ao PDF.
- **Por que este risco:** os sinais que levaram ao nível de risco atribuído.

### Histórico de mandato

Uma aba complementar mostra, para quem já teve mandato, o que foi prometido no plano da última campanha e o que consta como concluído, em andamento ou pendente ([Histórico de mandato](12-historico-de-mandato.md)). Ela comunica a **entrega passada**; o mapa comunica o **risco das propostas futuras**. Os dois não se somam em nota única.

### Pontos de convergência e divergência

Para cada tema, um resumo curto do que os candidatos propõem de parecido e onde suas propostas diferem.

## Interações

- Adicionar, remover ou trocar candidatos direto no mapa, combinando planos do catálogo e planos enviados ([Catálogo e seleção](11-catalogo-e-selecao-de-candidatos.md)).
- **Destacar diferenças** e **ocultar semelhanças** entre os candidatos, como em um comparador de produtos.
- Ajustar o peso dos temas e ver o mapa ser recalculado.
- Alternar entre a **visão personalizada** e a **visão geral** (sem perfil).
- Exportar ou compartilhar a comparação, sem dados do perfil embutidos. Planos enviados pelo eleitor saem com o selo de não verificado.

## Regras de negócio

- O mapa **não soma** os riscos em uma nota final por candidato nem indica um "vencedor". A leitura e a decisão são do eleitor.
- Candidatos aparecem em ordem neutra (alfabética ou aleatória), nunca ordenados por resultado.
- Toda célula do mapa precisa ter justificativa e citação acessíveis em um clique.
- A visão sempre informa a data e a versão dos planos usados.
