import financas from "@/assets/curso-financas.jpg";
import dados from "@/assets/curso-dados.jpg";
import projetos from "@/assets/curso-projetos.jpg";

export type Curso = {
  slug: string;
  titulo: string;
  resumo: string;
  descricao: string;
  objetivo: string;
  publico: string;
  categoria: string;
  instrutor: string;
  cargaHoraria: number;
  modulos: { titulo: string; aulas: string[] }[];
  nota: number;
  preco: number; // 0 = gratuito
  destaque: boolean;
  imagem: string;
  materiais: string[];
  notaMinima: number;
};

export const cursos: Curso[] = [
  {
    slug: "gestao-financeira",
    titulo: "Gestão Financeira para Pequenos Negócios",
    resumo: "Organize caixa, precificação e lucro do seu negócio com método.",
    descricao:
      "Um curso prático de finanças aplicadas à realidade de micro e pequenas empresas brasileiras, do controle de caixa à formação de preço de venda.",
    objetivo:
      "Capacitar o aluno a controlar o fluxo de caixa, precificar corretamente e interpretar os resultados do próprio negócio.",
    publico: "Empreendedores, autônomos e gestores de pequenas empresas.",
    categoria: "Negócios",
    instrutor: "Profa. Marina Duarte",
    cargaHoraria: 40,
    nota: 4.8,
    preco: 0,
    destaque: true,
    imagem: financas,
    materiais: ["Apostila em PDF", "Planilha de fluxo de caixa", "Modelo de precificação"],
    notaMinima: 70,
    modulos: [
      { titulo: "Fundamentos financeiros", aulas: ["Linguagem financeira", "Regime de caixa x competência", "Separando pessoa física e jurídica"] },
      { titulo: "Fluxo de caixa", aulas: ["Montando o caixa diário", "Projeção de 90 dias", "Capital de giro"] },
      { titulo: "Precificação", aulas: ["Custos fixos e variáveis", "Margem de contribuição", "Formação do preço de venda"] },
      { titulo: "Resultados e decisões", aulas: ["DRE simplificada", "Ponto de equilíbrio", "Plano de ação"] },
    ],
  },
  {
    slug: "analise-de-dados",
    titulo: "Análise de Dados com Python",
    resumo: "Da coleta à visualização: análise de dados aplicada ao mercado.",
    descricao:
      "Trilha completa de análise de dados com Python, pandas e visualização, com projetos baseados em bases reais do mercado brasileiro.",
    objetivo:
      "Formar analistas capazes de tratar, analisar e apresentar dados para apoiar decisões de negócio.",
    publico: "Profissionais de qualquer área que queiram atuar com dados.",
    categoria: "Tecnologia",
    instrutor: "Profa. Camila Rocha",
    cargaHoraria: 48,
    nota: 4.9,
    preco: 297,
    destaque: true,
    imagem: dados,
    materiais: ["Apostila em PDF", "Notebooks do curso", "Bases de dados para prática"],
    notaMinima: 70,
    modulos: [
      { titulo: "Python essencial", aulas: ["Ambiente e primeiros passos", "Estruturas de dados", "Funções e boas práticas"] },
      { titulo: "Tratamento de dados", aulas: ["Leitura de arquivos", "Limpeza com pandas", "Junções e agregações"] },
      { titulo: "Análise exploratória", aulas: ["Estatística descritiva", "Detecção de outliers", "Correlações"] },
      { titulo: "Visualização e entrega", aulas: ["Gráficos eficazes", "Dashboards", "Projeto final"] },
    ],
  },
  {
    slug: "gestao-de-projetos",
    titulo: "Gestão de Projetos Ágeis",
    resumo: "Entregue projetos no prazo com Scrum, Kanban e métricas.",
    descricao:
      "Curso voltado à condução prática de projetos ágeis, com cerimônias, artefatos e indicadores de desempenho de time.",
    objetivo: "Preparar o aluno para conduzir times e projetos com práticas ágeis consolidadas.",
    publico: "Líderes de time, analistas e profissionais de projetos.",
    categoria: "Negócios",
    instrutor: "Prof. Diego Ferraz",
    cargaHoraria: 36,
    nota: 4.7,
    preco: 189,
    destaque: false,
    imagem: projetos,
    materiais: ["Apostila em PDF", "Templates de backlog", "Checklist de cerimônias"],
    notaMinima: 70,
    modulos: [
      { titulo: "Bases do ágil", aulas: ["Manifesto ágil", "Papéis e responsabilidades", "Cultura de time"] },
      { titulo: "Scrum na prática", aulas: ["Backlog e refinamento", "Sprint e cerimônias", "Definição de pronto"] },
      { titulo: "Kanban e fluxo", aulas: ["Quadro e WIP", "Lead time e throughput", "Melhoria contínua"] },
    ],
  },
  {
    slug: "comunicacao-corporativa",
    titulo: "Comunicação Corporativa",
    resumo: "Apresentações, e-mails e reuniões que geram resultado.",
    descricao:
      "Desenvolva clareza, estrutura e presença na comunicação profissional, do e-mail do dia a dia à apresentação para a diretoria.",
    objetivo: "Aprimorar a comunicação escrita e falada em contextos corporativos.",
    publico: "Profissionais de todas as áreas e níveis.",
    categoria: "Desenvolvimento profissional",
    instrutor: "Profa. Helena Prado",
    cargaHoraria: 16,
    nota: 4.6,
    preco: 0,
    destaque: false,
    imagem: projetos,
    materiais: ["Apostila em PDF", "Modelos de apresentação"],
    notaMinima: 70,
    modulos: [
      { titulo: "Clareza e estrutura", aulas: ["Pirâmide invertida", "Escrita objetiva", "Revisão eficiente"] },
      { titulo: "Apresentações", aulas: ["Roteiro e narrativa", "Slides que apoiam", "Presença e voz"] },
    ],
  },
];

export const getCurso = (slug: string) => cursos.find((c) => c.slug === slug);

export const formatarPreco = (preco: number) =>
  preco === 0
    ? "Gratuito"
    : preco.toLocaleString("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: 0 });

export const totalAulas = (curso: Curso) =>
  curso.modulos.reduce((soma, m) => soma + m.aulas.length, 0);

export type Certificado = {
  codigo: string;
  aluno: string;
  curso: string;
  cargaHoraria: number;
  emitidoEm: string;
  nota: number;
};

export const certificados: Certificado[] = [
  {
    codigo: "ALT-2026-88412",
    aluno: "Ana Beatriz Moraes",
    curso: "Gestão Financeira para Pequenos Negócios",
    cargaHoraria: 40,
    emitidoEm: "12/05/2026",
    nota: 92,
  },
  {
    codigo: "ALT-2026-10237",
    aluno: "Carlos Henrique Lima",
    curso: "Análise de Dados com Python",
    cargaHoraria: 48,
    emitidoEm: "03/08/2026",
    nota: 85,
  },
];
