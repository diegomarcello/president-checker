# 04 · Perfil do eleitor

## Objetivo

Entender o contexto de quem está consultando para que a comparação mostre **o que importa para aquela pessoa**, e não uma análise genérica.

## O que coleta

Todos os campos são **opcionais**. Quanto mais o eleitor informa, mais personalizada fica a análise; sem nenhum dado, o sistema mostra uma comparação geral.

| Campo | Exemplo | Para que serve |
|---|---|---|
| Faixa etária | 30–39 anos | Previdência, educação, mercado de trabalho |
| Localização | Município / UF | Propostas regionais, infraestrutura, segurança local |
| Ramo de atuação | Tecnologia, agro, comércio, serviço público... | Políticas setoriais, crédito, regulação |
| Vínculo de trabalho | CLT, autônomo, MEI, empresário, servidor, estudante, aposentado | Tributação, direitos trabalhistas, previdência |
| Faixa de renda atual | R$ 5–10 mil/mês | Faixas de imposto, programas sociais |
| Renda esperada em 5 anos | R$ 10–20 mil/mês | Impacto futuro de mudanças tributárias e econômicas |
| Escolaridade | Superior completo | Programas de qualificação |
| Composição do domicílio | Mora com filhos em idade escolar | Educação, assistência, saúde |
| Situação de moradia | Aluguel, financiamento, imóvel próprio | Habitação, crédito, juros |

Valores numéricos são coletados em **faixas**, não em valores exatos.

## Prioridades do eleitor

Além do contexto, o eleitor escolhe **quais temas considera mais importantes** (por exemplo: economia, segurança, educação) e pode atribuir peso a cada um. O sistema também **sugere** prioridades a partir do perfil, e o eleitor pode aceitar ou ajustar.

## O que o sistema não pergunta

- Intenção de voto, preferência partidária ou opinião política.
- Religião, origem racial ou étnica, saúde, orientação sexual, filiação sindical ou qualquer outro dado sensível.
- Nome, CPF, e-mail, telefone ou endereço completo.

Detalhes em [Privacidade e LGPD](09-privacidade-e-lgpd.md).

## Saídas

- Um **perfil de relevância**: a lista de temas com o peso de cada um para aquele eleitor, combinando o que ele declarou com o que o modelo de relevância sugere ([Modelos de ML](06-modelos-de-machine-learning.md)).
- O perfil é usado apenas na sessão de consulta.

## Regras de negócio

- O eleitor sempre vê **por que** um tema foi considerado relevante (ex.: "Tributação: alta, porque você informou que é autônomo e espera aumento de renda").
- O eleitor pode editar o perfil e as prioridades a qualquer momento e ver a comparação ser recalculada.
