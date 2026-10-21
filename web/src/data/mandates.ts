import type { Mandate } from './types'

/**
 * Fictional mandate history, used only to demonstrate the product.
 * Each promise comes from the candidate's LAST campaign plan.
 */
export const MANDATES: Record<string, Mandate> = {
  'marcos-tavares': {
    role: 'Governador de estado (fictício)',
    officeType: 'governador',
    period: '2023 – 2026',
    situation: 'em-exercicio',
    campaignYear: 2022,
    promises: [
      {
        id: 'mt1', theme: 'tributacao', status: 'concluida', planPage: 18,
        text: 'Isentar a cesta básica do imposto estadual',
        source: 'Diário Oficial do Estado, Lei 1.204/2023', updatedAt: '03/2023',
      },
      {
        id: 'mt2', theme: 'educacao', status: 'concluida', planPage: 27,
        text: 'Reajustar o piso dos professores da rede estadual',
        source: 'Portal da Transparência do Estado', updatedAt: '05/2024',
      },
      {
        id: 'mt3', theme: 'seguranca', status: 'andamento', progress: 67, planPage: 33,
        text: 'Criar 12 bases de policiamento comunitário',
        source: 'Secretaria de Segurança, painel de obras', updatedAt: '09/2026',
        note: '8 de 12 bases em funcionamento',
      },
      {
        id: 'mt4', theme: 'saude', status: 'andamento', progress: 31, planPage: 38,
        text: 'Zerar a fila de cirurgias eletivas em 24 meses',
        source: 'Secretaria de Saúde, boletim de filas', updatedAt: '08/2026',
        note: 'Fila caiu 31%; o prazo de 24 meses já venceu',
      },
      {
        id: 'mt5', theme: 'economia', status: 'andamento', progress: 60, planPage: 9,
        text: 'Executar o plano de obras de infraestrutura com cronograma por região',
        source: 'Painel de obras do governo estadual', updatedAt: '09/2026',
      },
      {
        id: 'mt6', unlocated: true, theme: 'ambiente', status: 'pendente', planPage: 52,
        text: 'Instalar energia solar em habitação popular',
        source: 'Diário Oficial do Estado (sem edital publicado)', updatedAt: '09/2026',
        note: 'Edital ainda não foi publicado',
      },
    ],
  },
  'beatriz-nogueira': {
    role: 'Senadora',
    officeType: 'senador',
    period: '2019 – 2027',
    situation: 'em-exercicio',
    campaignYear: 2018,
    promises: [
      {
        id: 'bn1', theme: 'economia', status: 'concluida', planPage: 7,
        text: 'Aprovar uma regra fiscal com meta de resultado primário',
        source: 'Senado Federal, Lei Complementar 211/2023', updatedAt: '08/2023',
      },
      {
        id: 'bn2', theme: 'seguranca', status: 'concluida', planPage: 28,
        text: 'Relatar o projeto de metas regionais de redução de homicídios',
        source: 'Senado Federal, tramitação do PL 3.310/2021', updatedAt: '11/2022',
      },
      {
        id: 'bn3', theme: 'ambiente', status: 'concluida', planPage: 50,
        text: 'Aprovar a fiscalização do desmatamento por satélite',
        source: 'Diário Oficial da União, Lei 14.870/2022', updatedAt: '06/2022',
      },
      {
        id: 'bn4', theme: 'tributacao', status: 'andamento', progress: 70, planPage: 16,
        text: 'Aprovar a alíquota única sobre o consumo',
        source: 'Senado Federal, tramitação da PEC 45/2019', updatedAt: '09/2026',
        note: 'Aprovada em comissão, aguardando votação em plenário',
      },
      {
        id: 'bn5', theme: 'educacao', status: 'andamento', progress: 40, planPage: 42,
        text: 'Criar a avaliação nacional com bônus por desempenho',
        source: 'Senado Federal, tramitação do PL 1.980/2024', updatedAt: '07/2026',
      },
      {
        id: 'bn6', unlocated: true, theme: 'saude', status: 'pendente', planPage: 36,
        text: 'Instituir gestão por resultados em hospitais federais',
        source: 'Senado Federal (nenhum projeto apresentado)', updatedAt: '09/2026',
        note: 'Nenhum projeto de lei foi apresentado',
      },
    ],
  },
  'helena-albuquerque': {
    role: 'Prefeita (fictícia)',
    officeType: 'prefeito',
    period: '2021 – 2024',
    situation: 'encerrado',
    campaignYear: 2020,
    promises: [
      {
        id: 'ha1', theme: 'economia', status: 'concluida', planPage: 12,
        text: 'Criar a linha de crédito para microempreendedores',
        source: 'Diário Oficial do Município, Decreto 412/2021', updatedAt: '10/2021',
      },
      {
        id: 'ha2', theme: 'tributacao', status: 'concluida', planPage: 18,
        text: 'Simplificar a tributação municipal de MEI',
        source: 'Câmara Municipal, Lei 987/2022', updatedAt: '04/2022',
      },
      {
        id: 'ha3', theme: 'saude', status: 'concluida', planPage: 40,
        text: 'Implantar telemedicina nas unidades básicas de saúde',
        source: 'Secretaria Municipal de Saúde, relatório de gestão', updatedAt: '12/2023',
      },
      {
        id: 'ha4', theme: 'seguranca', status: 'andamento', progress: 50, planPage: 31,
        text: 'Integrar câmeras de monitoramento e guarda municipal',
        source: 'Relatório final de gestão 2021–2024', updatedAt: '12/2024',
        note: 'Entregue parcialmente ao fim do mandato',
      },
      {
        id: 'ha5', theme: 'educacao', status: 'andamento', progress: 55, planPage: 46,
        text: 'Qualificar 20 mil adultos para o mercado de trabalho',
        source: 'Secretaria Municipal de Educação', updatedAt: '12/2024',
        note: '11 mil vagas preenchidas',
      },
      {
        id: 'ha6', unlocated: true, theme: 'educacao', status: 'pendente', planPage: 47,
        text: 'Abrir creches com atendimento em horário estendido',
        source: 'Relatório final de gestão 2021–2024', updatedAt: '12/2024',
      },
    ],
  },
  'camila-esteves': {
    role: 'Deputada federal',
    officeType: 'deputado-federal',
    period: '2019 – 2022',
    situation: 'encerrado',
    campaignYear: 2018,
    promises: [
      {
        id: 'ce1', theme: 'economia', status: 'concluida', planPage: 11,
        text: 'Aprovar o marco legal das startups',
        source: 'Câmara dos Deputados, Lei 14.112/2021', updatedAt: '06/2021',
      },
      {
        id: 'ce2', theme: 'saude', status: 'concluida', planPage: 39,
        text: 'Aprovar a lei de saúde mental nas escolas',
        source: 'Diário Oficial da União, Lei 14.455/2022', updatedAt: '03/2022',
      },
      {
        id: 'ce3', theme: 'educacao', status: 'andamento', progress: 50, planPage: 45,
        text: 'Incluir programação no currículo da rede pública',
        source: 'Câmara dos Deputados, tramitação do PL 2.215/2020', updatedAt: '12/2022',
        note: 'Aprovado na Câmara; aguardava o Senado ao fim do mandato',
      },
      {
        id: 'ce4', theme: 'ambiente', status: 'andamento', progress: 40, planPage: 56,
        text: 'Aprovar a meta de zerar o desmatamento ilegal',
        source: 'Câmara dos Deputados, tramitação do PL 1.744/2021', updatedAt: '12/2022',
      },
      {
        id: 'ce5', unlocated: true, theme: 'tributacao', status: 'pendente', planPage: 20,
        text: 'Criar o imposto sobre carbono',
        source: 'Câmara dos Deputados, PL 998/2019 (arquivado)', updatedAt: '01/2023',
        note: 'Projeto arquivado ao fim da legislatura',
      },
      {
        id: 'ce6', unlocated: true, theme: 'seguranca', status: 'pendente', planPage: 30,
        text: 'Instituir programa de prevenção à violência entre jovens',
        source: 'Câmara dos Deputados (nenhum projeto apresentado)', updatedAt: '01/2023',
      },
    ],
  },
  'luciana-prado': {
    role: 'Governadora de estado (fictícia)',
    officeType: 'governador',
    period: '2023 – 2026',
    situation: 'em-exercicio',
    campaignYear: 2022,
    promises: [
      {
        id: 'lp1', theme: 'saude', status: 'concluida', planPage: 14,
        text: 'Inaugurar 3 hospitais regionais',
        source: 'Diário Oficial do Estado, atos de inauguração', updatedAt: '05/2025',
      },
      {
        id: 'lp2', theme: 'educacao', status: 'andamento', progress: 55, planPage: 22,
        text: 'Escola em tempo integral para 40% da rede estadual',
        source: 'Secretaria de Educação, painel de matrículas', updatedAt: '09/2026',
        note: '22% da rede já em tempo integral',
      },
      {
        id: 'lp3', theme: 'seguranca', status: 'andamento', progress: 35, planPage: 31,
        text: 'Contratar 6 mil policiais',
        source: 'Secretaria de Segurança, relatório de efetivo', updatedAt: '08/2026',
        note: '2,1 mil contratados',
      },
      {
        id: 'lp4', unlocated: true, theme: 'economia', status: 'pendente', planPage: 9,
        text: 'Criar o fundo estadual de crédito para pequenos negócios',
        source: 'Diário Oficial do Estado (sem ato publicado)', updatedAt: '09/2026',
      },
    ],
  },
  'edson-barreto': {
    role: 'Prefeito (fictício)',
    officeType: 'prefeito',
    period: '2025 – 2028',
    situation: 'em-exercicio',
    campaignYear: 2024,
    promises: [
      {
        id: 'eb1', theme: 'saude', status: 'concluida', planPage: 17,
        text: 'Zerar a fila de consultas na atenção básica',
        source: 'Secretaria Municipal de Saúde, painel de filas', updatedAt: '07/2026',
      },
      {
        id: 'eb2', theme: 'educacao', status: 'andamento', progress: 45, planPage: 25,
        text: 'Construir 20 novas creches',
        source: 'Prefeitura, painel de obras', updatedAt: '09/2026',
        note: '9 de 20 creches entregues',
      },
      {
        id: 'eb3', unlocated: true, theme: 'ambiente', status: 'andamento', progress: 20, planPage: 40,
        text: 'Plantar 100 mil árvores',
        source: 'Secretaria do Verde e Meio Ambiente', updatedAt: '08/2026',
      },
      {
        id: 'eb4', theme: 'seguranca', status: 'pendente', planPage: 33,
        text: 'Instalar 500 câmeras de monitoramento',
        source: 'Prefeitura, portal de licitações (sem edital)', updatedAt: '09/2026',
      },
    ],
  },
  // paulo-rangel: sem mandato anterior (mandate = null)
}
