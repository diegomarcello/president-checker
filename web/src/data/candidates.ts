import type { Candidate } from './types'
import { LOCAL_CANDIDATES } from './localCandidates'
import { MANDATES } from './mandates'

const ELECTION = 'Eleição Geral · Presidente (demonstração)'
const base = {
  type: 'presidente' as const,
  office: 'Presidente da República',
  election: ELECTION,
  origin: 'catalogo' as const,
}

/**
 * Fictional candidates and plans, used only to demonstrate the product.
 * Any resemblance to real people, parties or proposals is coincidental.
 */
const BASE: Candidate[] = [
  {
    ...base,
    id: 'helena-albuquerque',
    name: 'Helena Albuquerque',
    ballotName: 'Helena Albuquerque',
    party: 'AR',
    partyName: 'Aliança Renovação',
    planVersion: 'v2',
    planDate: '12/08/2026',
    pages: 64,
    color: '#5645d4',
    themes: {
      economia: {
        concreteness: 78,
        viability: 70,
        strengths: [
          { text: 'Crédito a microempreendedores com meta de +30% até 2028', page: 12 },
        ],
        weaknesses: [{ text: 'Não detalha a fonte de recursos do fundo garantidor', page: 13 }],
        effects: {
          mei: { delta: -10, note: 'Crédito direcionado a MEI e pequenos negócios' },
          autonomo: { delta: -8, note: 'Linha de crédito para quem trabalha por conta própria' },
          empresario: { delta: -6, note: 'Fundo garantidor facilita crédito para empresas' },
        },
        effectsPage: 12,
      },
      tributacao: {
        concreteness: 82,
        viability: 62,
        strengths: [
          { text: 'Regime único simplificado para autônomos e MEI em até 18 meses', page: 18 },
        ],
        weaknesses: [
          { text: 'Perda de arrecadação estimada, sem compensação indicada', page: 19 },
        ],
        effects: {
          autonomo: { delta: -12, note: 'Regime simplificado reduz a burocracia para autônomos' },
          mei: { delta: -12, note: 'Regime simplificado reduz a burocracia para MEI' },
          rendaAlta: {
            delta: 8,
            note: 'Teto do regime simplificado limita o crescimento acima de R$ 10 mil/mês',
          },
        },
        effectsPage: 18,
      },
      seguranca: {
        concreteness: 40,
        viability: 55,
        strengths: [{ text: 'Integração de bases de dados de segurança entre os estados', page: 31 }],
        weaknesses: [{ text: 'Sem metas numéricas de redução de crimes', page: 32 }],
      },
      saude: {
        concreteness: 55,
        viability: 60,
        strengths: [{ text: 'Ampliação da telemedicina na atenção básica', page: 40 }],
        weaknesses: [{ text: 'Sem plano para as filas de cirurgias eletivas', page: 41 }],
        effects: {
          'regiao-norte': { delta: -6, note: 'Telemedicina alcança comunidades remotas' },
        },
        effectsPage: 40,
      },
      educacao: {
        concreteness: 62,
        viability: 66,
        strengths: [
          { text: 'Requalificação profissional de adultos: 1 milhão de vagas até 2029', page: 46 },
        ],
        weaknesses: [{ text: 'Ensino básico tratado de forma genérica', page: 47 }],
        effects: {
          tecnologia: { delta: -8, note: 'Trilhas de requalificação em tecnologia' },
          filhos: { delta: 6, note: 'Poucas ações para o ensino básico, relevante para quem tem filhos' },
        },
        effectsPage: 46,
      },
    },
  },
  {
    ...base,
    id: 'marcos-tavares',
    name: 'Marcos Tavares',
    ballotName: 'Marcos Tavares',
    party: 'MBN',
    partyName: 'Movimento Brasil Novo',
    planVersion: 'v1',
    planDate: '05/08/2026',
    pages: 71,
    color: '#dd5b00',
    themes: {
      economia: {
        concreteness: 70,
        viability: 52,
        strengths: [
          { text: 'Investimento público em infraestrutura com cronograma por região', page: 9 },
        ],
        weaknesses: [{ text: 'Depende de mais endividamento, sem trava fiscal', page: 10 }],
        effects: {
          'regiao-nordeste': { delta: -8, note: 'Obras previstas para a sua região' },
          'regiao-norte': { delta: -8, note: 'Obras previstas para a sua região' },
          empresario: { delta: 6, note: 'Risco de aumento de juros por endividamento público' },
        },
        effectsPage: 9,
      },
      tributacao: {
        concreteness: 74,
        viability: 48,
        strengths: [{ text: 'Isenção de IR para renda de até R$ 5 mil/mês', page: 21 }],
        weaknesses: [{ text: 'Nova faixa de 35% para renda acima de R$ 10 mil/mês', page: 22 }],
        effects: {
          baixaRenda: { delta: -14, note: 'Faixa de isenção beneficia a sua renda atual' },
          rendaAlta: { delta: 16, note: 'Nova faixa de 35% atinge a renda que você espera ter' },
        },
        effectsPage: 22,
      },
      seguranca: {
        concreteness: 45,
        viability: 60,
        strengths: [
          { text: 'Policiamento comunitário em áreas de maior vulnerabilidade', page: 33 },
        ],
        weaknesses: [{ text: 'Metas genéricas e sem prazo', page: 34 }],
      },
      saude: {
        concreteness: 85,
        viability: 66,
        strengths: [{ text: 'Zerar a fila de cirurgias eletivas em 24 meses', page: 38 }],
        weaknesses: [{ text: 'A meta exige contratação ampla, sem fonte indicada', page: 39 }],
        effects: {
          idoso: { delta: -10, note: 'Prioriza a atenção a pessoas com mais de 50 anos' },
          aposentado: { delta: -6, note: 'Prioriza a atenção a aposentados' },
        },
        effectsPage: 38,
      },
      educacao: {
        concreteness: 72,
        viability: 64,
        strengths: [{ text: 'Escola em tempo integral para 50% da rede até 2030', page: 44 }],
        weaknesses: [{ text: 'Pouco sobre ensino superior', page: 45 }],
        effects: {
          filhos: { delta: -12, note: 'Escola em tempo integral para quem tem filhos' },
          estudante: { delta: 6, note: 'Pouco sobre ensino superior' },
        },
        effectsPage: 44,
      },
      ambiente: {
        concreteness: 58,
        viability: 56,
        strengths: [{ text: 'Energia solar em habitação popular', page: 52 }],
        weaknesses: [{ text: 'Sem plano específico contra o desmatamento', page: 53 }],
      },
    },
  },
  {
    ...base,
    id: 'beatriz-nogueira',
    name: 'Beatriz Nogueira',
    ballotName: 'Beatriz Nogueira',
    party: 'UC',
    partyName: 'União Cidadã',
    planVersion: 'v1',
    planDate: '09/08/2026',
    pages: 58,
    color: '#0075de',
    themes: {
      economia: {
        concreteness: 60,
        viability: 70,
        strengths: [{ text: 'Regra fiscal com meta de resultado primário', page: 7 }],
        weaknesses: [{ text: 'Poucas medidas diretas de geração de emprego', page: 8 }],
        effects: {
          empresario: { delta: -6, note: 'Previsibilidade fiscal tende a reduzir juros' },
        },
        effectsPage: 7,
      },
      tributacao: {
        concreteness: 66,
        viability: 68,
        strengths: [{ text: 'Alíquota única sobre o consumo, sem mudar faixas do IR', page: 16 }],
        weaknesses: [{ text: 'Transição de 10 anos adia os efeitos', page: 17 }],
        effects: {
          rendaAlta: { delta: -4, note: 'Não altera as faixas do imposto de renda' },
        },
        effectsPage: 16,
      },
      seguranca: {
        concreteness: 90,
        viability: 74,
        strengths: [
          {
            text: 'Metas regionais de redução de homicídios e crimes patrimoniais, com prazos',
            page: 28,
          },
        ],
        weaknesses: [{ text: 'Concentra investimento nas capitais', page: 29 }],
        effects: {
          'regiao-sudeste': { delta: -6, note: 'Metas detalhadas para o Sudeste' },
          'regiao-norte': { delta: 8, note: 'Recursos concentrados fora da sua região' },
          'regiao-nordeste': { delta: 6, note: 'Recursos concentrados fora da sua região' },
        },
        effectsPage: 28,
      },
      saude: {
        concreteness: 50,
        viability: 62,
        strengths: [{ text: 'Gestão por resultados em hospitais federais', page: 36 }],
        weaknesses: [{ text: 'Sem metas de cobertura', page: 37 }],
      },
      educacao: {
        concreteness: 55,
        viability: 60,
        strengths: [{ text: 'Avaliação nacional com bônus por desempenho', page: 42 }],
        weaknesses: [{ text: 'Não trata de creche e primeira infância', page: 43 }],
        effects: {
          filhos: { delta: 8, note: 'Não trata de creche, relevante para quem tem filhos pequenos' },
        },
        effectsPage: 43,
      },
      ambiente: {
        concreteness: 48,
        viability: 60,
        strengths: [{ text: 'Fiscalização do desmatamento por satélite', page: 50 }],
        weaknesses: [{ text: 'Sem metas de redução de emissões', page: 51 }],
        effects: {
          agro: { delta: 6, note: 'Fiscalização mais rígida sobre áreas de produção' },
        },
        effectsPage: 50,
      },
    },
  },
  {
    ...base,
    id: 'paulo-rangel',
    name: 'Paulo Rangel',
    ballotName: 'Paulo Rangel',
    party: 'PH',
    partyName: 'Partido Horizonte',
    planVersion: 'v1',
    planDate: '01/08/2026',
    pages: 49,
    color: '#1aae39',
    themes: {
      economia: {
        concreteness: 72,
        viability: 66,
        strengths: [
          { text: 'Corredores logísticos para escoar a safra: 12 obras priorizadas', page: 14 },
        ],
        weaknesses: [{ text: 'Foco em commodities, pouco sobre indústria e serviços', page: 15 }],
        effects: {
          agro: { delta: -14, note: 'Obras logísticas voltadas ao setor agropecuário' },
          'regiao-centro-oeste': { delta: -8, note: 'Corredores passam pela sua região' },
          tecnologia: { delta: 4, note: 'Pouca atenção ao setor de tecnologia' },
        },
        effectsPage: 14,
      },
      tributacao: {
        concreteness: 52,
        viability: 58,
        strengths: [{ text: 'Desoneração de insumos agrícolas', page: 24 }],
        weaknesses: [{ text: 'Não trata da tributação de serviços e autônomos', page: 25 }],
        effects: {
          agro: { delta: -10, note: 'Desoneração de insumos reduz seu custo de produção' },
          autonomo: { delta: 8, note: 'Não aborda a tributação de autônomos' },
        },
        effectsPage: 24,
      },
      seguranca: {
        concreteness: 62,
        viability: 64,
        strengths: [{ text: 'Reforço do policiamento em rodovias e fronteiras', page: 35 }],
        weaknesses: [{ text: 'Sem foco em áreas urbanas', page: 36 }],
      },
      educacao: {
        concreteness: 58,
        viability: 62,
        strengths: [
          { text: 'Escolas técnicas agrícolas e de energia: 200 unidades até 2030', page: 48 },
        ],
        weaknesses: [{ text: 'Sem ações para o ensino superior', page: 49 }],
        effects: {
          estudante: { delta: -6, note: 'Ampliação do ensino técnico' },
          agro: { delta: -6, note: 'Formação técnica voltada ao campo' },
        },
        effectsPage: 48,
      },
      ambiente: {
        concreteness: 66,
        viability: 58,
        strengths: [
          { text: 'Pagamento por serviços ambientais a produtores rurais', page: 55 },
        ],
        weaknesses: [{ text: 'Flexibiliza regras de licenciamento ambiental', page: 56 }],
        effects: { agro: { delta: -6, note: 'Pagamento por serviços ambientais ao produtor' } },
        effectsPage: 55,
      },
    },
  },
  {
    ...base,
    id: 'camila-esteves',
    name: 'Camila Esteves',
    ballotName: 'Camila Esteves',
    party: 'AVN',
    partyName: 'Aliança Verde Nacional',
    planVersion: 'v3',
    planDate: '14/08/2026',
    pages: 82,
    color: '#ff64c8',
    themes: {
      economia: {
        concreteness: 76,
        viability: 60,
        strengths: [
          { text: 'Fundo de inovação de R$ 20 bi para startups e indústria verde', page: 11 },
        ],
        weaknesses: [{ text: 'Efeito sobre o emprego só em horizonte de 8 anos', page: 12 }],
        effects: {
          tecnologia: { delta: -14, note: 'Fundo de inovação voltado a startups de tecnologia' },
          jovem: { delta: -6, note: 'Empregos de inovação para quem está no início da carreira' },
        },
        effectsPage: 11,
      },
      tributacao: {
        concreteness: 70,
        viability: 56,
        strengths: [
          { text: 'Imposto sobre carbono com devolução às famílias de menor renda', page: 20 },
        ],
        weaknesses: [{ text: 'Pode elevar custos de energia e transporte no curto prazo', page: 21 }],
        effects: {
          baixaRenda: { delta: -6, note: 'Devolução do imposto às famílias de menor renda' },
          empresario: { delta: 6, note: 'Aumento de custos de energia para empresas' },
        },
        effectsPage: 20,
      },
      seguranca: {
        concreteness: 38,
        viability: 52,
        strengths: [{ text: 'Prevenção com foco em juventude e esporte', page: 30 }],
        weaknesses: [{ text: 'Sem metas ou indicadores', page: 31 }],
        effects: { jovem: { delta: -4, note: 'Prevenção voltada à juventude' } },
        effectsPage: 30,
      },
      saude: {
        concreteness: 64,
        viability: 62,
        strengths: [{ text: 'Saúde mental e atenção primária nas escolas', page: 39 }],
        weaknesses: [{ text: 'Sem plano para reduzir filas', page: 40 }],
        effects: {
          filhos: { delta: -8, note: 'Atenção primária dentro das escolas' },
          jovem: { delta: -6, note: 'Foco em saúde mental de jovens' },
        },
        effectsPage: 39,
      },
      educacao: {
        concreteness: 80,
        viability: 68,
        strengths: [
          { text: 'Programação e inglês na rede pública a partir de 2027', page: 45 },
        ],
        weaknesses: [{ text: 'Formação de professores só a partir de 2029', page: 46 }],
        effects: {
          tecnologia: { delta: -10, note: 'Formação de base em programação' },
          filhos: { delta: -8, note: 'Programação e inglês na escola pública' },
          estudante: { delta: -8, note: 'Novo currículo já a partir de 2027' },
        },
        effectsPage: 45,
      },
      ambiente: {
        concreteness: 92,
        viability: 70,
        strengths: [
          { text: 'Zerar o desmatamento ilegal até 2030 e cortar 45% das emissões', page: 56 },
        ],
        weaknesses: [{ text: 'Custo da transição não detalhado', page: 58 }],
        effects: {
          agro: { delta: 8, note: 'Restrições mais duras sobre áreas de produção' },
          'regiao-norte': { delta: -6, note: 'Foco na proteção da Amazônia' },
        },
        effectsPage: 56,
      },
    },
  },
]

export const CATALOG: Candidate[] = [...BASE, ...LOCAL_CANDIDATES].map((c) => ({
  ...c,
  mandate: MANDATES[c.id] ?? null,
}))
